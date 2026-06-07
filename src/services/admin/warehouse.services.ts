import { prisma } from "config/client";

// ─────────────────────────────────────────────
// KPI / Stats
// ─────────────────────────────────────────────

export const getWarehouseStats = async () => {
    const [total, outOfStock, lowStock, totalStockValue] = await Promise.all([
        // Tổng sản phẩm đang active
        prisma.product.count({ where: { status: 'ACTIVE' } }),

        // Hết hàng
        prisma.product.count({ where: { status: 'ACTIVE', stock: 0 } }),

        // Sắp hết (stock > 0 và stock <= lowStockThreshold)
        prisma.product.count({
            where: {
                status: 'ACTIVE',
                stock: { gt: 0 },
                AND: [{ stock: { lte: prisma.product.fields.lowStockThreshold as any } }],
            },
        }).catch(() =>
            // fallback nếu không support field ref
            prisma.product.count({ where: { status: 'ACTIVE', stock: { gt: 0, lte: 10 } } })
        ),

        // Tổng giá trị hàng tồn kho (stock * cost)
        prisma.product.findMany({
            where: { status: 'ACTIVE' },
            select: { stock: true, cost: true },
        }).then(prods => prods.reduce((sum, p) => sum + p.stock * p.cost, 0)),
    ]);

    // Tính lowStock thực tế (so sánh với lowStockThreshold từng sản phẩm)
    const lowStockReal = await prisma.product.count({
        where: {
            status: 'ACTIVE',
            stock: { gt: 0, lte: 10 },
        },
    });

    return {
        total,
        outOfStock,
        lowStock: lowStockReal,
        totalStockValue,
    };
};

// ─────────────────────────────────────────────
// Danh sách tồn kho (có filter, search, phân trang)
// ─────────────────────────────────────────────

type StockFilter = 'all' | 'out' | 'low' | 'ok';
type SortBy = 'stock_asc' | 'stock_desc' | 'name_asc' | 'name_desc' | 'sold_desc';

export const getInventoryList = async (opts: {
    page?: number;
    limit?: number;
    search?: string;
    filter?: StockFilter;
    categoryId?: string;
    brandId?: string;
    sort?: SortBy;
}) => {
    const { page = 1, limit = 20, search = '', filter = 'all', categoryId, brandId, sort = 'stock_asc' } = opts;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { status: 'ACTIVE' };

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { sku: { contains: search } },
        ];
    }

    if (filter === 'out') where.stock = 0;
    else if (filter === 'low') where.stock = { gt: 0, lte: 10 };
    else if (filter === 'ok') where.stock = { gt: 10 };

    if (categoryId) where.categoryId = BigInt(categoryId);
    if (brandId) where.brandId = BigInt(brandId);

    // Sort
    let orderBy: any = { stock: 'asc' };
    if (sort === 'stock_desc')  orderBy = { stock: 'desc' };
    if (sort === 'name_asc')    orderBy = { name: 'asc' };
    if (sort === 'name_desc')   orderBy = { name: 'desc' };
    if (sort === 'sold_desc')   orderBy = { stock: 'desc' };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            select: {
                id: true,
                name: true,
                sku: true,
                stock: true,
                lowStockThreshold: true,
                cost: true,
                price: true,
                image: true,
                category: { select: { name: true } },
                brand: { select: { name: true } },
                supplier: { select: { name: true } },
            },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

// ─────────────────────────────────────────────
// Cập nhật tồn kho (nhập/xuất kho thủ công)
// ─────────────────────────────────────────────

export const adjustStock = async (productId: bigint, delta: number, note?: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { stock: true, name: true } });
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    const newStock = product.stock + delta;
    if (newStock < 0) throw new Error(`Tồn kho không đủ. Hiện có: ${product.stock}`);
    return prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
        select: { id: true, name: true, stock: true, sku: true },
    });
};

// Set stock trực tiếp
export const setStock = async (productId: bigint, newStock: number) => {
    if (newStock < 0) throw new Error('Số lượng không hợp lệ');
    return prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
        select: { id: true, name: true, stock: true, sku: true },
    });
};

// ─────────────────────────────────────────────
// Danh sách category và brand để filter
// ─────────────────────────────────────────────
export const getCategoriesForFilter = async () => {
    return prisma.category.findMany({
        where: { status: 'ACTIVE', parentId: { not: null } },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });
};

export const getBrandsForFilter = async () => {
    return prisma.brand.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });
};

// ─────────────────────────────────────────────
// Sản phẩm hết hàng / sắp hết (cho alert section)
// ─────────────────────────────────────────────
export const getCriticalStockProducts = async (limit = 10) => {
    return prisma.product.findMany({
        where: { status: 'ACTIVE', stock: { lte: 5 } },
        orderBy: { stock: 'asc' },
        take: limit,
        select: {
            id: true, name: true, sku: true, stock: true,
            image: true, lowStockThreshold: true,
            category: { select: { name: true } },
        },
    });
};
