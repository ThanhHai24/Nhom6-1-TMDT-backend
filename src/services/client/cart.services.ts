import { prisma } from "config/client";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { CartItem } from "../../types/express-session";
import { InsufficientStockError } from "../../types/errors";

function generateOrderCode() {
    const now = new Date();

    // YYYYMMDD
    const date =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');

    // random 6 ký tự
    const random = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `PCS-${date}-${random}`;
}

/**
 * Kiểm tra tồn kho cho từng item trong giỏ hàng (đọc thông thường, không lock).
 * Dùng để validate trước khi hiển thị nút đặt hàng hoặc khi thêm/cập nhật giỏ.
 *
 * @returns Danh sách item không đủ hàng (mảng rỗng = tất cả OK)
 */
export const validateCartStock = async (
    cartData: CartItem[]
): Promise<{ productId: string; productName: string; requested: number; available: number }[]> => {
    const outOfStock: { productId: string; productName: string; requested: number; available: number }[] = [];

    for (const item of cartData) {
        const product = await prisma.product.findUnique({
            where: { id: BigInt(item.productId) },
            select: { id: true, name: true, stock: true }
        });

        if (!product || product.stock < item.quantity) {
            outOfStock.push({
                productId: item.productId,
                productName: product?.name ?? item.name,
                requested: item.quantity,
                available: product?.stock ?? 0
            });
        }
    }

    return outOfStock;
};

/**
 * Tạo đơn hàng trong một transaction an toàn với Pessimistic Locking.
 *
 * Quy trình bên trong transaction:
 *   1. SELECT stock ... FOR UPDATE  →  lock từng row sản phẩm
 *   2. Kiểm tra stock đủ hay không
 *   3. UPDATE stock (trừ số lượng đặt)
 *   4. Tạo Order + OrderItems + StatusHistory
 *
 * Nếu 2 request đến cùng lúc:
 *   - Request thứ nhất lock row → kiểm tra OK → trừ tồn → commit
 *   - Request thứ hai chờ lock → sau khi lock được thấy stock đã giảm → throw InsufficientStockError
 */
export const createOrderTransaction = async (
    cartData: CartItem[],
    customerName: string,
    customerPhone: string,
    shippingAddress: string,
    notes: string,
    userId?: bigint,
    shippingFee: number = 0
) => {
    // Calculate total
    const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Generate order code
    const code = generateOrderCode();

    const orderData = {
        code,
        customerName,
        customerPhone,
        shippingAddress,
        shippingFee,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PENDING,
        notes,
        ...(userId && { userId: userId })
    };

    const orderItemsData = cartData.map(item => ({
        productId: BigInt(item.productId),
        quantity: item.quantity,
        price: item.price
    }));

    return await prisma.$transaction(async (tx) => {
        // ── BƯỚC 1: Lock từng sản phẩm & kiểm tra tồn kho ──────────────────
        for (const item of cartData) {
            // SELECT ... FOR UPDATE: lock row, transaction khác phải chờ
            const rows = await tx.$queryRaw<{ id: bigint; name: string; stock: number }[]>`
                SELECT id, name, stock
                FROM products
                WHERE id = ${BigInt(item.productId)}
                FOR UPDATE
            `;

            if (rows.length === 0) {
                throw new Error(`Sản phẩm ID ${item.productId} không tồn tại.`);
            }

            const product = rows[0];

            if (product.stock < item.quantity) {
                throw new InsufficientStockError(
                    item.productId,
                    product.name,
                    item.quantity,
                    product.stock
                );
            }
        }

        // ── BƯỚC 2: Trừ tồn kho ─────────────────────────────────────────────
        for (const item of cartData) {
            await tx.$executeRaw`
                UPDATE products
                SET stock = stock - ${item.quantity},
                    updatedAt = NOW()
                WHERE id = ${BigInt(item.productId)}
            `;
        }

        // ── BƯỚC 3: Tạo đơn hàng ────────────────────────────────────────────
        const newOrder = await tx.order.create({
            data: {
                ...orderData,
                orderItems: {
                    create: orderItemsData
                },
                statusHistory: {
                    create: [
                        {
                            status: OrderStatus.PENDING,
                            notes: 'Đơn hàng được tạo',
                            changedById: userId
                        }
                    ]
                }
            }
        });

        return newOrder;
    });
};