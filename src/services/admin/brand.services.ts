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

const HandleCreateBrand = async (name: string, categoryIds: string[], description: string, status: string) => {
    return await prisma.$transaction(async (tx) => {
        const brand = await tx.brand.create({
            data: {
                name,
                description,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                status: status == "active" ? "ACTIVE" : "INACTIVE",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        if (categoryIds && categoryIds.length > 0) {
            await tx.categoryBrand.createMany({
                data: categoryIds.map(catId => ({
                    categoryId: BigInt(catId),
                    brandId: brand.id
                }))
            });
        }

        return brand;
    });
}

const getBrandById = async (id: string) => {
    const brand = await prisma.brand.findUnique({
        where: {
            id: +id
        },
        include: {
            categoryBrands: true
        }
    });

    if (brand) {
        return {
            ...brand,
            categoryIds: brand.categoryBrands.map(cb => cb.categoryId)
        };
    }
    return null;
}

const HandleUpdateBrand = async (id: string, name: string, categoryIds: string[], description: string, status: string) => {
    return await prisma.$transaction(async (tx) => {
        const brand = await tx.brand.update({
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

        await tx.categoryBrand.deleteMany({
            where: {
                brandId: +id
            }
        });

        if (categoryIds && categoryIds.length > 0) {
            await tx.categoryBrand.createMany({
                data: categoryIds.map(catId => ({
                    categoryId: BigInt(catId),
                    brandId: +id
                }))
            });
        }

        return brand;
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

const getBrandsByCategoryId = async (categoryId: string) => {
    const links = await prisma.categoryBrand.findMany({
        where: { categoryId: BigInt(categoryId) },
        include: {
            brand: {
                select: { id: true, name: true, slug: true, status: true }
            }
        },
        orderBy: { brand: { name: 'asc' } }
    });
    return links.map(l => l.brand);
}

export { getAllBrands, getBrandCount, getActiveBrandsCount, getInactiveBrandsCount, HandleCreateBrand, getBrandById, HandleUpdateBrand, HandleLockBrand, HandleActiveBrand, HandleDeleteBrand, getBrandsByCategoryId }