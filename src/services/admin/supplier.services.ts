import { prisma } from "config/client";

const getAllSuppliers = async () => {
    return await prisma.supplier.findMany();
}

export { getAllSuppliers }