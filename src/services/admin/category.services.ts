import { prisma } from "config/client";

const getAllCategories = async () => {
    const parentCategories = await prisma.category.findMany({
        where: { parentId: null },
        include: { children: true },
        orderBy: { createdAt: 'asc' }
    });

    const childCategories = await prisma.category.findMany({
        where: { parentId: { not: null } },
        include: { parent: true },
        orderBy: { createdAt: 'asc' }
    });

    return { parentCategories, childCategories };
}

const getCategories = async () => {
    return await prisma.category.findMany();
}

export { getAllCategories, getCategories }