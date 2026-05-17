import { prisma } from "config/client";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function startOfYear(date: Date) {
    return new Date(date.getFullYear(), 0, 1);
}

// ─────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────
const getUserCount = async () => prisma.user.count();

const getUserThisMonthCount = async () => {
    const now = new Date();
    return prisma.user.count({ where: { createdAt: { gte: startOfMonth(now) } } });
};

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────
const getProductsCount = async () => prisma.product.count();

const getProductThisMonthCount = async () => {
    const now = new Date();
    return prisma.product.count({ where: { createdAt: { gte: startOfMonth(now) } } });
};

// ─────────────────────────────────────────────
// Revenue
// ─────────────────────────────────────────────

/** Doanh thu tháng hiện tại (chỉ đơn DELIVERED) */
const getRevenueThisMonth = async (): Promise<number> => {
    const now = new Date();
    const result = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
            status: 'DELIVERED',
            createdAt: { gte: startOfMonth(now) },
        },
    });
    return result._sum.totalAmount ?? 0;
};

/** Doanh thu theo từng tháng trong năm hiện tại (12 phần tử) */
const getMonthlyRevenueThisYear = async (): Promise<number[]> => {
    const now = new Date();
    const year = now.getFullYear();

    const orders = await prisma.order.findMany({
        where: {
            status: 'DELIVERED',
            createdAt: { gte: startOfYear(now), lt: new Date(year + 1, 0, 1) },
        },
        select: { createdAt: true, totalAmount: true },
    });

    const monthly = Array(12).fill(0);
    for (const o of orders) {
        monthly[o.createdAt.getMonth()] += o.totalAmount;
    }
    return monthly;
};

/** Tổng doanh thu năm hiện tại */
const getRevenueThisYear = async (): Promise<number> => {
    const now = new Date();
    const year = now.getFullYear();
    const result = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
            status: 'DELIVERED',
            createdAt: { gte: startOfYear(now), lt: new Date(year + 1, 0, 1) },
        },
    });
    return result._sum.totalAmount ?? 0;
};

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────

/** Tổng đơn hàng năm hiện tại */
const getOrdersCountThisYear = async (): Promise<number> => {
    const now = new Date();
    const year = now.getFullYear();
    return prisma.order.count({
        where: { createdAt: { gte: startOfYear(now), lt: new Date(year + 1, 0, 1) } },
    });
};

/** Số lượng đơn theo từng trạng thái (toàn bộ) */
const getOrderStatusStats = async (): Promise<Record<string, number>> => {
    const groups = await prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
    });
    const result: Record<string, number> = {};
    for (const g of groups) {
        result[g.status] = g._count._all;
    }
    return result;
};

/** Số đơn theo tháng trong năm hiện tại */
const getMonthlyOrdersThisYear = async (): Promise<number[]> => {
    const now = new Date();
    const year = now.getFullYear();

    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startOfYear(now), lt: new Date(year + 1, 0, 1) } },
        select: { createdAt: true },
    });

    const monthly = Array(12).fill(0);
    for (const o of orders) {
        monthly[o.createdAt.getMonth()]++;
    }
    return monthly;
};

// ─────────────────────────────────────────────
// Top sản phẩm bán chạy
// ─────────────────────────────────────────────

const getTopSellingProducts = async (limit = 8): Promise<{ name: string; totalQty: number; revenue: number; image: string | null }[]> => {
    const now = new Date();
    const year = now.getFullYear();

    const items = await prisma.orderItem.findMany({
        where: {
            order: {
                status: 'DELIVERED',
                createdAt: { gte: startOfYear(now), lt: new Date(year + 1, 0, 1) },
            },
        },
        include: { product: { select: { name: true, image: true } } },
    });

    // Gom theo productId
    const map = new Map<string, { name: string; totalQty: number; revenue: number; image: string | null }>();
    for (const item of items) {
        const key = item.productId.toString();
        if (!map.has(key)) {
            map.set(key, { name: item.product.name, totalQty: 0, revenue: 0, image: item.product.image });
        }
        const entry = map.get(key)!;
        entry.totalQty += item.quantity;
        entry.revenue += item.price * item.quantity;
    }

    return Array.from(map.values())
        .sort((a, b) => b.totalQty - a.totalQty)
        .slice(0, limit);
};

// ─────────────────────────────────────────────
// Sản phẩm tồn đọng (stock > 0, status ACTIVE)
// ─────────────────────────────────────────────

const getSlowMovingProducts = async (limit = 8) => {
    return prisma.product.findMany({
        where: { status: 'ACTIVE', stock: { gt: 0 } },
        orderBy: { stock: 'desc' },
        take: limit,
        select: { id: true, name: true, stock: true, price: true, image: true, sku: true },
    });
};

// ─────────────────────────────────────────────
// Khuyến mãi đang áp dụng
// ─────────────────────────────────────────────

const getActivePromotions = async () => {
    const now = new Date();
    return prisma.promotion.findMany({
        where: {
            OR: [
                { startDate: null, endDate: null },
                { startDate: { lte: now }, endDate: { gte: now } },
                { startDate: { lte: now }, endDate: null },
                { startDate: null, endDate: { gte: now } },
            ],
        },
        include: { coupons: true },
        orderBy: { endDate: 'asc' },
        take: 10,
    });
};

/** Đơn hàng gần nhất */
const getRecentOrders = async (limit = 8) => {
    return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            code: true,
            customerName: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            orderItems: { select: { quantity: true, product: { select: { name: true } } }, take: 1 },
        },
    });
};

export {
    getUserCount, getUserThisMonthCount,
    getProductsCount, getProductThisMonthCount,
    getRevenueThisMonth, getMonthlyRevenueThisYear, getRevenueThisYear,
    getOrdersCountThisYear, getOrderStatusStats, getMonthlyOrdersThisYear,
    getTopSellingProducts, getSlowMovingProducts,
    getActivePromotions, getRecentOrders,
};