import { prisma } from "config/client";

const getAllBrands = async () => {
    return await prisma.brand.findMany();
}

export { getAllBrands }