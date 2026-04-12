import { prisma } from "config/client";

const getAllOrders = async () => {
    return await prisma.order.findMany();
}


export { getAllOrders }