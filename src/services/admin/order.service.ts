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
            user: true
        }
    });
}

export { getAllOrders, getOrderCount, getPendingOrdersCount, getConfirmedOrdersCount, getProcessingOrdersCount, getShippedOrdersCount, getDeliveredOrdersCount, getCancelledOrdersCount, getReturnedOrdersCount, getOrderById }