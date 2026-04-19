import { prisma } from "config/client";

const getAllBrands = async () => {
    return await prisma.brand.findMany();
}

const getBrandCount = async () => {
    const count = await prisma.brand.count();
    return count;
}

const getActiveBrandsCount = async () => {
    const count = await prisma.brand.count({
        where: {
            status: "ACTIVE"
        }
    });
    return count;
}

const getInactiveBrandsCount = async () => {
    const count = await prisma.brand.count({
        where: {
            status: "INACTIVE"
        }
    });
    return count;
}

const HandleCreateBrand = async (name: string, description: string, status: string) => {
    return await prisma.brand.create({
        data: {
            name,
            description,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            status: status == "active" ? "ACTIVE" : "INACTIVE",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
}

const getBrandById = async (id: string) => {
    return await prisma.brand.findUnique({
        where: {
            id: +id
        }
    });
}

const HandleUpdateBrand = async (id: string, name: string, description: string, status: string) => {
    return await prisma.brand.update({
        where: {
            id: +id
        },
        data: {
            name,
            description,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            status: status == "active" ? "ACTIVE" : "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleLockBrand = async (id: string) => {
    return await prisma.brand.update({
        where: {
            id: +id
        },
        data: {
            status: "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleActiveBrand = async (id: string) => {
    return await prisma.brand.update({
        where: {
            id: +id
        },
        data: {
            status: "ACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleDeleteBrand = async (id: string) => {
    return await prisma.brand.delete({
        where: {
            id: +id
        }
    });
}
export { getAllBrands, getBrandCount, getActiveBrandsCount, getInactiveBrandsCount, HandleCreateBrand, getBrandById, HandleUpdateBrand, HandleLockBrand, HandleActiveBrand, HandleDeleteBrand }