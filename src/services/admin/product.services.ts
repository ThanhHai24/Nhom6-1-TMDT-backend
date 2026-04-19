import { prisma } from "config/client";
const autoGenerateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, "-");
}
async function generateSKUWithDB(prisma, categoryId: string) {
    // 1. Lấy category từ DB
    const category = await prisma.category.findUnique({
        where: { id: BigInt(categoryId) },
        select: { name: true }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // 2. Tạo prefix từ name
    const prefix = category.name
        .substring(0, 3)
        .toUpperCase()
        .replace(/\s/g, '');

    // 3. Đếm sản phẩm
    const count = await prisma.product.count();

    const number = String(count + 1).padStart(5, '0');

    return `${prefix}-${number}`;
}

const getAllProducts = async function () {
    return await prisma.product.findMany({
        include: {
            category: true,
            brand: true,
            supplier: true,
        },
    });
}

const HandleCreateProduct = async function (name: string, slug: string, sku: string, shortDescription: string, description: string, cost: string | number, price: string | number, stock: string | number, lowStockThreshold: string | number, image: string | undefined, images: string[], isHot: boolean, isNew: boolean, isFeatured: boolean, category: string, brand: string, supplier: string) {
    await prisma.product.create({
        data: {
            name,
            slug,
            sku,
            shortDescription: shortDescription ?? '',
            description: description ?? null,
            cost: Number(cost),
            price: Number(price),
            stock: Number(stock),
            lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : 10,
            image: image ?? null,
            images: images && images.length > 0 ? JSON.stringify(images) : null,
            isHot: !!isHot,
            isNew: !!isNew,
            isFeatured: !!isFeatured,
            categoryId: BigInt(category),
            brandId: BigInt(brand),
            supplierId: BigInt(supplier),
        },
    });

}
const HandleActiveProduct = async (id: String) => {
    const ativatedProduct = await prisma.product.update({
        where: {
            id: +id
        },
        data: {
            status: "ACTIVE"
        }
    }
    )
}

const HandleLockProduct = async (id: String) => {
    const lockedProduct = await prisma.product.update({
        where: {
            id: +id
        },
        data: {
            status: "INACTIVE"
        }
    }
    )
}

const getProductById = async (id: String) => {
    return await prisma.product.findUnique({
        where: {
            id: +id
        },
        include: {
            category: true,
            brand: true,
            supplier: true,
        },
    });
}

const HandleUpdateProduct = async function (id: string, name: string, slug: string, shortDescription: string, description: string, cost: string | number, price: string | number, stock: string | number, lowStockThreshold: string | number, image: string | undefined, images: string[], isHot: boolean, isNew: boolean, isFeatured: boolean, category: string, brand: string, supplier: string) {
    await prisma.product.update({
        where: {
            id: +id
        },
        data: {
            name,
            slug,
            shortDescription: shortDescription ?? '',
            description: description ?? null,
            cost: Number(cost),
            price: Number(price),
            stock: Number(stock),
            lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : 10,
            image: image ?? null,
            images: images && images.length > 0 ? JSON.stringify(images) : null,
            isHot: !!isHot,
            isNew: !!isNew,
            isFeatured: !!isFeatured,
            categoryId: category ? BigInt(category) : undefined,
            brandId: brand ? BigInt(brand) : undefined,
            supplierId: supplier ? BigInt(supplier) : undefined,
        },
    });
}


export { autoGenerateSlug, generateSKUWithDB, HandleCreateProduct, getAllProducts, HandleActiveProduct, HandleLockProduct, getProductById, HandleUpdateProduct }