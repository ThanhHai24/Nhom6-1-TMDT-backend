import { Request, Response } from "express";
import { prisma } from "config/client";

// Lấy danh sách đơn hàng
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });

        const serialized = JSON.stringify(orders, (key, value) => typeof value === "bigint" ? value.toString() : value);
        res.status(200).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách đơn hàng", details: error });
    }
};

// Thêm mới đơn hàng
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { 
            userId, customerName, customerPhone, shippingAddress, 
            paymentMethod, notes, items 
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
             res.status(400).json({ error: "Đơn hàng phải có ít nhất 1 sản phẩm" });
             return;
        }

        // Tính tổng tiền dựa trên items truyền lên
        // (Giả sử client gửi { productId, quantity, price })
        let totalAmount = 0;
        const orderItemsPayload = items.map((item: any) => {
            const sum = item.quantity * item.price;
            totalAmount += sum;
            return {
                productId: BigInt(item.productId),
                quantity: item.quantity,
                price: item.price
            };
        });

        // Tạo mã order unique (ví dụ: ORD-TIMESTAMP)
        const code = `ORD-${Date.now()}`;

        const order = await prisma.order.create({
            data: {
                code,
                userId: userId ? BigInt(userId) : null,
                customerName,
                customerPhone,
                shippingAddress,
                totalAmount,
                paymentMethod: paymentMethod || "COD",
                notes,
                orderItems: {
                    create: orderItemsPayload
                }
            },
            include: {
                orderItems: true
            }
        });

        const serialized = JSON.stringify(order, (key, value) => typeof value === "bigint" ? value.toString() : value);
        res.status(201).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo đơn hàng", details: error });
    }
};
