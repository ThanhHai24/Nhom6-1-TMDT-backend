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
            categoryId: 6,
        }
    })
    return products
}

const getPCProducts = async function () {
    const products = await prisma.product.findMany({
        where: {
            categoryId: 5,
        }
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
            categoryId: 9,
        }
    })
    return products
}

const getProductBySlug = async function name(slug: string) {
    const product = await prisma.product.findUnique({
        where: {
            slug: slug
        }
    })
    return product
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

    if (categorySlug) where.category = { slug: categorySlug };
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
    const products = await prisma.product.findMany({
        where: categorySlug
            ? { category: { slug: categorySlug }, status: 'ACTIVE' }
            : { status: 'ACTIVE' },
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


export { getHotProducts, getProductBySlug, getLaptopProducts, getPCProducts, getCPUProducts, getGPUProducts, getProductsByFilter, getBrandsForCategory, searchProducts }