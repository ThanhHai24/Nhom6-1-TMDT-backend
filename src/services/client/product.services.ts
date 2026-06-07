import { prisma } from "config/client";

const getHotProducts = async function () {
    const products = await prisma.product.findMany({
        where: {
            isHot: true
        },
        take: 10
    })
    return products
}

const getLaptopProducts = async function () {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { categoryId: 4 },
                { categoryId: 18 },
                { categoryId: 19 },
                { categoryId: 20 }
            ]
        },
        take:10
    })
    return products
}

const getPCProducts = async function () {
    const products = await prisma.product.findMany({
        where: {
            categoryId: 1,
        },
        take:10
    })
    return products
}

const getCPUProducts = async function () {
    const products = await prisma.product.findMany({
        where: {
            categoryId: 7,
        }
    })
    return products
}

const getGPUProducts = async function () {
    const products = await prisma.product.findMany({
        where: {
            categoryId: 8,
        },
        take:10
    })
    return products
}

const getProductBySlug = async function (slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: { select: { id: true, slug: true, name: true } },
        },
    });

    if (!product) return null;

    // Nếu là sản phẩm PC, resolve các spec có value là product ID → lấy tên + slug sản phẩm linh kiện
    const PC_CATEGORY_SLUGS = ['pc', 'pc-gaming', 'pc-van-phong', 'pc-do-hoa'];
    const isPC = product.category && PC_CATEGORY_SLUGS.includes(product.category.slug);

    if (isPC && product.specifications) {
        let specs: Array<{ key: string; value: string; productRef?: { name: string; slug: string } | null }> = [];
        try {
            specs = typeof product.specifications === 'string'
                ? JSON.parse(product.specifications)
                : (product.specifications as any);
        } catch {
            specs = [];
        }

        // Tìm tất cả các spec có value là số (product ID)
        const productIdSpecs = specs.filter(s => /^\d+$/.test(String(s.value)));
        const uniqueIds = [...new Set(productIdSpecs.map(s => Number(s.value)))];

        if (uniqueIds.length > 0) {
            const linkedProducts = await prisma.product.findMany({
                where: { id: { in: uniqueIds.map(BigInt) } },
                select: { id: true, name: true, slug: true },
            });
            const productMap = new Map(linkedProducts.map(p => [Number(p.id), p]));

            specs = specs.map(spec => {
                const id = Number(spec.value);
                const ref = productMap.get(id);
                return ref
                    ? { ...spec, productRef: { name: ref.name, slug: ref.slug } }
                    : { ...spec, productRef: null };
            });
        }

        return { ...product, specifications: specs };
    }

    return product;
}

export interface ProductFilterOptions {
    categorySlug?: string;
    brandIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    isHot?: boolean;
    isNew?: boolean;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
}

const getProductsByFilter = async function (opts: ProductFilterOptions) {
    const {
        categorySlug,
        brandIds,
        minPrice,
        maxPrice,
        isHot,
        isNew,
        inStock,
        sort = '',
        page = 1,
        limit = 16,
    } = opts;

    const where: any = { status: 'ACTIVE' };

    if (categorySlug) {
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: { select: { id: true } } },
        });
        if (category) {
            const categoryIds = [category.id, ...category.children.map(c => c.id)];
            where.categoryId = { in: categoryIds };
        } else {
            where.category = { slug: categorySlug };
        }
    }
    if (brandIds && brandIds.length > 0) where.brandId = { in: brandIds };
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (isHot) where.isHot = true;
    if (isNew) where.isNew = true;
    if (inStock) where.stock = { gt: 0 };

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'hot') orderBy = { sold: 'desc' };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        prisma.product.findMany({ where, orderBy, skip, take: limit, include: { brand: true } }),
        prisma.product.count({ where }),
    ]);

    return { products, total, totalPages: Math.ceil(total / limit) };
};

const getBrandsForCategory = async function (categorySlug?: string) {
    let where: any = { status: 'ACTIVE' };

    if (categorySlug) {
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: { select: { id: true } } },
        });
        if (category) {
            const categoryIds = [category.id, ...category.children.map(c => c.id)];
            where.categoryId = { in: categoryIds };
        } else {
            where.category = { slug: categorySlug };
        }
    }

    const products = await prisma.product.findMany({
        where,
        select: { brand: { select: { id: true, name: true } } },
        distinct: ['brandId'],
    });
    return products.map(p => p.brand);
};

export interface SearchOptions {
    searchTerm?: string;
    brandIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    isHot?: boolean;
    isNew?: boolean;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
}

const searchProducts = async function (opts: SearchOptions) {
    const {
        searchTerm = '',
        brandIds,
        minPrice,
        maxPrice,
        isHot,
        isNew,
        inStock,
        sort = '',
        page = 1,
        limit = 16,
    } = opts;

    const where: any = { status: 'ACTIVE' };

    if (searchTerm.trim()) {
        where.name = { contains: searchTerm.trim() };
    }

    if (brandIds && brandIds.length > 0) where.brandId = { in: brandIds };
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (isHot) where.isHot = true;
    if (isNew) where.isNew = true;
    if (inStock) where.stock = { gt: 0 };

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const nameFilter = searchTerm.trim() ? { name: { contains: searchTerm.trim() }, status: 'ACTIVE' as const } : { status: 'ACTIVE' as const };

    const [products, total, brandRows] = await Promise.all([
        prisma.product.findMany({ where, orderBy, skip, take: limit, include: { brand: true } }),
        prisma.product.count({ where }),
        // Brands có trong toàn bộ kết quả tìm kiếm (không phụ thuộc vào filter brand)
        prisma.product.findMany({
            where: nameFilter,
            select: { brand: { select: { id: true, name: true } } },
            distinct: ['brandId'],
        }),
    ]);

    const brands = brandRows.map(r => r.brand);

    return { products, total, totalPages: Math.ceil(total / limit), brands };
};


/**
 * Lấy danh sách sản phẩm tương tự (cùng danh mục, khác sản phẩm hiện tại)
 */
const getRelatedProducts = async function (categoryId: number | bigint, excludeId: number | bigint, limit = 10) {
    const products = await prisma.product.findMany({
        where: {
            categoryId: BigInt(categoryId.toString()),
            id: { not: BigInt(excludeId.toString()) },
            status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products;
};

export { getHotProducts, getProductBySlug, getLaptopProducts, getPCProducts, getCPUProducts, getGPUProducts, getProductsByFilter, getBrandsForCategory, searchProducts, getRelatedProducts }
