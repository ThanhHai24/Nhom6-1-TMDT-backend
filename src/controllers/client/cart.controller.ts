import { Request, Response } from "express";
import { prisma } from "config/client";
import { createOrderTransaction, validateCartStock } from "../../services/client/cart.services";
import { InsufficientStockError } from "../../types/errors";

const getCartPage = async (req: Request, res: Response) => {
    return res.render('StorePage/cart/cart');
}

const addToCart = async (req: Request, res: Response) => {
    try {
        const { product_id, product_qty } = req.body;
        const quantity = parseInt(product_qty as string) || 1;

        if (!product_id) {
            return res.status(400).send("Product ID is required");
        }

        const product = await prisma.product.findUnique({
            where: { id: BigInt(product_id as string) }
        });

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // ── Kiểm tra tồn kho ────────────────────────────────────────────────
        if (product.stock <= 0) {
            const errorMsg = `Sản phẩm "${product.name}" đã hết hàng.`;
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(400).json({ success: false, message: errorMsg });
            }
            req.session.error_msg = errorMsg;
            return req.session.save(() => res.redirect("back"));
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const cart = req.session.cart;
        const productIdStr = product.id.toString();
        const existingItemIndex = cart.findIndex(item => item.productId === productIdStr);

        // Tính tổng số lượng sau khi thêm (đã có trong giỏ + thêm mới)
        const currentQtyInCart = existingItemIndex > -1 ? cart[existingItemIndex].quantity : 0;
        const newTotalQty = currentQtyInCart + quantity;

        if (newTotalQty > product.stock) {
            const allowedQty = product.stock - currentQtyInCart;
            const errorMsg = allowedQty <= 0
                ? `Bạn đã thêm tối đa số lượng có thể đặt cho sản phẩm "${product.name}".`
                : `Chỉ còn ${product.stock} "${product.name}" trong kho. Bạn chỉ có thể thêm tối đa ${allowedQty} sản phẩm nữa.`;

            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(400).json({ success: false, message: errorMsg });
            }
            req.session.error_msg = errorMsg;
            return req.session.save(() => res.redirect("back"));
        }
        // ────────────────────────────────────────────────────────────────────

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                productId: productIdStr,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image || "no-image.png",
                sku: product.sku
            });
        }

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).send("Internal Server Error");
            }
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.json({ success: true, message: "Added to cart", cartCount: cart.reduce((t, i) => t + i.quantity, 0) });
            }

            if (req.body['buy-now'] !== undefined) {
                return res.redirect('/cart');
            }
            // Just redirect back after adding
            res.redirect("back");
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Internal Server Error");
    }
}

const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { product_id } = req.body;
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.productId !== product_id);
            req.session.save((err) => {
                if (err) console.error(err);
                res.redirect("/cart");
            });
        } else {
            res.redirect("/cart");
        }
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.redirect("/cart");
    }
}

const updateCart = async (req: Request, res: Response) => {
    try {
        const { product_id, quantity } = req.body;
        const newQty = parseInt(quantity as string);

        if (req.session.cart && newQty > 0) {
            const item = req.session.cart.find(i => i.productId === product_id);
            if (item) {
                // ── Kiểm tra tồn kho trước khi cập nhật ────────────────────
                const product = await prisma.product.findUnique({
                    where: { id: BigInt(product_id as string) },
                    select: { stock: true, name: true }
                });

                if (!product) {
                    req.session.error_msg = "Sản phẩm không tồn tại.";
                    return req.session.save(() => res.redirect("/cart"));
                }

                if (newQty > product.stock) {
                    req.session.error_msg =
                        `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho. ` +
                        `Số lượng đặt đã được điều chỉnh về ${product.stock}.`;
                    item.quantity = product.stock; // Tự động điều chỉnh về tối đa
                } else {
                    item.quantity = newQty;
                }
                // ───────────────────────────────────────────────────────────
            }
            req.session.save((err) => {
                if (err) console.error(err);
                res.redirect("/cart");
            });
        } else {
            res.redirect("/cart");
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        res.redirect("/cart");
    }
}

const checkout = async (req: Request, res: Response) => {
    try {
        const { customerName, customerPhone, address, city, district, ward, notes, shippingFee } = req.body;
        const cart = req.session.cart;
        const user = req.user as any;

        if (!cart || cart.length === 0) {
            return res.redirect("/cart");
        }

        if (!customerName || !customerPhone || !address || !city) {
            return res.status(400).send("Missing required fields");
        }

        const uId = user && user.id ? BigInt(user.id) : undefined;
        const shippingAddress = `${address}, ${ward}, ${district}, ${city}`;
        const fee = parseInt(shippingFee as string, 10) || 0;

        await createOrderTransaction(cart, customerName, customerPhone, shippingAddress, notes || "", uId, fee);

        // Clear cart
        req.session.cart = [];

        req.session.save((err) => {
            if (err) console.error(err);

            // Override locals explicitly so the rendered page immediately picks up the empty state
            res.locals.cart = [];
            res.locals.cartCount = 0;

            res.render("StorePage/cart/cart", {
                success_msg: "Đặt hàng thành công! Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất."
            });
        });
    } catch (error) {
        if (error instanceof InsufficientStockError) {
            // Lỗi hết hàng / race condition → thông báo thân thiện
            console.warn("Stock error during checkout:", error.message);
            return res.render("StorePage/cart/cart", {
                error_msg: error.message,
                cart: req.session.cart   // giữ lại giỏ hàng để khách điều chỉnh
            });
        }

        // Lỗi hệ thống khác
        console.error("Error checking out:", error);
        res.status(500).send("Internal Server Error");
    }
}

export {
    getCartPage,
    addToCart,
    removeFromCart,
    updateCart,
    checkout
}