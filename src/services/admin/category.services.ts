import { prisma } from "config/client";

// Simple Vietnamese slug generator helper
const toSlug = (str: string): string => {
    str = str.toLowerCase();
    // Remove Vietnamese accents
    str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
    str = str.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
    str = str.replace(/[íìỉĩị]/g, 'i');
    str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
    str = str.replace(/[úùủũụưứừửữự]/g, 'u');
    str = str.replace(/[ýỳỷỹỵ]/g, 'y');
    str = str.replace(/đ/g, 'd');
    // Remove special characters, keep letters, numbers, spaces, and hyphens
    str = str.replace(/[^a-z0-9\s-]/g, '');
    // Replace multiple spaces or hyphens with a single hyphen
    str = str.replace(/[\s-]+/g, '-');
    // Trim leading/trailing hyphens
    return str.replace(/^-+|-+$/g, '');
};

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

const HandleCreateCategory = async (
    name: string,
    description: string,
    icon: string,
    status: string,
    parentId?: string | null
) => {
    const generatedSlug = toSlug(name);
    return await prisma.category.create({
        data: {
            name,
            slug: generatedSlug,
            description,
            icon: icon || null,
            status: status === "active" ? "ACTIVE" : "INACTIVE",
            parentId: parentId ? BigInt(parentId) : null,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
}

const HandleUpdateCategory = async (
    id: string,
    name: string,
    description: string,
    icon: string,
    status: string,
    parentId?: string | null
) => {
    const generatedSlug = toSlug(name);
    return await prisma.category.update({
        where: { id: BigInt(id) },
        data: {
            name,
            slug: generatedSlug,
            description,
            icon: icon || null,
            status: status === "active" ? "ACTIVE" : "INACTIVE",
            parentId: parentId ? BigInt(parentId) : null,
            updatedAt: new Date()
        }
    });
}

export { getAllCategories, getCategories, HandleCreateCategory, HandleUpdateCategory }