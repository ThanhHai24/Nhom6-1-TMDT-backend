import { prisma } from "config/client";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { CartItem } from "../../types/express-session";

export const createOrderTransaction = async (
    cartData: CartItem[],
    customerName: string,
    customerPhone: string,
    shippingAddress: string,
    notes: string,
    userId?: bigint
) => {
    // Calculate total
    const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Generate order code
    const timestamp = new Date().getTime().toString().slice(-6);
    const code = `ORD-${timestamp}-${Math.floor(Math.random() * 1000)}`;

    const orderData = {
        code,
        customerName,
        customerPhone,
        shippingAddress,
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
        const newOrder = await tx.order.create({
            data: {
                ...orderData,
                orderItems: {
                    create: orderItemsData
                }
            }
        });
        return newOrder;
    });
};