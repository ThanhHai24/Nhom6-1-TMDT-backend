import { prisma } from "config/client";

const getAllOrders = async () => {
    return await prisma.order.findMany();
}

const getOrderCount = async () => {
    console.log(await prisma.order.count());
    return await prisma.order.count();
}

const getPendingOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "PENDING" } });
}

const getConfirmedOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "CONFIRMED" } });
}

const getProcessingOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "PROCESSING" } });
}

const getShippedOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "SHIPPED" } });
}

const getDeliveredOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "DELIVERED" } });
}

const getCancelledOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "CANCELLED" } });
}

const getReturnedOrdersCount = async () => {
    return await prisma.order.count({ where: { status: "RETURNED" } });
}

const getOrderById = async (id: string) => {
    return await prisma.order.findUnique({
        where: { id: +id },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            },
            shippingOrders: {
                include: {
                    provider: true
                }
            },
            user: true,
            statusHistory: {
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    changedBy: true
                }
            }
        }
    });
}

const updateOrderStatus = async (id: string, status: string, userId?: bigint) => {
    if (status === 'SHIPPED') {
        // Find or create a virtual provider
        let provider = await prisma.shippingProvider.findFirst({
            where: { code: 'VIRTUAL' }
        });
        
        if (!provider) {
            provider = await prisma.shippingProvider.create({
                data: {
                    name: 'Vận chuyển Ảo (Mock)',
                    code: 'VIRTUAL',
                    apiKey: 'N/A'
                }
            });
        }

        // Check if a shipping order already exists
        const existingShipping = await prisma.shippingOrder.findFirst({
            where: { orderId: +id }
        });

        if (!existingShipping) {
            const currentOrder = await prisma.order.findUnique({
                where: { id: +id },
                select: { shippingFee: true }
            });

            await prisma.shippingOrder.create({
                data: {
                    orderId: +id,
                    providerId: provider.id,
                    trackingNumber: `MOCK-${Date.now()}`,
                    shippingCost: currentOrder?.shippingFee || 0,
                    estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
                    status: 'IN_TRANSIT'
                }
            });
        }
    }

    return await prisma.$transaction([
        prisma.order.update({
            where: { id: +id },
            data: { status: status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" }
        }),
        prisma.orderStatusHistory.create({
            data: {
                orderId: +id,
                status: status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED",
                notes: 'Trạng thái được cập nhật',
                changedById: userId
            }
        })
    ]);
}

export { getAllOrders, getOrderCount, getPendingOrdersCount, getConfirmedOrdersCount, getProcessingOrdersCount, getShippedOrdersCount, getDeliveredOrdersCount, getCancelledOrdersCount, getReturnedOrdersCount, getOrderById, updateOrderStatus }