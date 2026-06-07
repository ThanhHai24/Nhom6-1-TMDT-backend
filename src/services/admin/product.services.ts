import { prisma } from "config/client";
const autoGenerateSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/\//g, "-")      // bỏ dấu /
        .replace(/\s+/g, "-")     // khoảng trắng -> -
        .replace(/-+/g, "-");     // tránh ----
};
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

const getProductsPaginated = async function (page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            skip,
            take: limit,
            include: {
                category: true,
                brand: true,
                supplier: true,
            },
            orderBy: { id: 'desc' },
        }),
        prisma.product.count(),
    ]);
    return { products, totalCount };
}

const HandleCreateProduct = async function (name: string, slug: string, sku: string, shortDescription: string, description: string, cost: string | number, price: string | number, stock: string | number, lowStockThreshold: string | number, image: string | undefined, images: string[], isHot: boolean, isNew: boolean, isFeatured: boolean, category: string, brand: string, supplier: string, specifications: any, warranty: string | number | null) {
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
            specifications: specifications ? specifications : null,
            warranty: warranty ? Number(warranty) : null,
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
            reviews: {
                include: { user: { select: { id: true, fullName: true, email: true, avatar: true } } },
                orderBy: { createdAt: 'desc' },
            },
            _count: { select: { reviews: true } },
        },
    });
}

const incrementViewCount = async (id: string | number) => {
    await prisma.product.update({
        where: { id: BigInt(id) },
        data: { viewCount: { increment: 1 } },
    });
}

const HandleUpdateProduct = async function (id: string, name: string, slug: string, shortDescription: string, description: string, cost: string | number, price: string | number, stock: string | number, lowStockThreshold: string | number, image: string | undefined, images: string[], isHot: boolean, isNew: boolean, isFeatured: boolean, category: string, brand: string, supplier: string, specifications: any, warranty: string | number | null) {
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
            specifications: specifications ? specifications : undefined,
            warranty: warranty !== undefined && warranty !== '' ? Number(warranty) : null,
        },
    });
}
const HandleDeleteProduct = async (id: string) => {
    const productId = BigInt(id);

    // 1. Kiểm tra xem sản phẩm đã có trong đơn hàng nào chưa
    const orderItemsCount = await prisma.orderItem.count({
        where: { productId }
    });

    if (orderItemsCount > 0) {
        // Nếu có đơn hàng, thực hiện soft-delete (chuyển trạng thái sang INACTIVE) để không làm mất lịch sử đơn hàng
        await prisma.product.update({
            where: { id: productId },
            data: { status: 'INACTIVE' }
        });
        return { success: true, type: 'soft' };
    }

    // 2. Không có đơn hàng, tiến hành xoá cứng. Xoá reviews và wishlists trước để tránh lỗi ràng buộc
    await prisma.review.deleteMany({
        where: { productId }
    });

    await prisma.wishlistItem.deleteMany({
        where: { productId }
    });

    // 3. Thực hiện xoá sản phẩm
    await prisma.product.delete({
        where: { id: productId }
    });

    return { success: true, type: 'hard' };
}


export { autoGenerateSlug, generateSKUWithDB, HandleCreateProduct, getAllProducts, getProductsPaginated, HandleActiveProduct, HandleLockProduct, getProductById, HandleUpdateProduct, incrementViewCount, HandleDeleteProduct }