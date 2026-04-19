import { prisma } from "config/client"

const getAllShipping = async function name() {
    const shippings = await prisma.shippingOrder.findMany();
    return shippings
}

export {getAllShipping}