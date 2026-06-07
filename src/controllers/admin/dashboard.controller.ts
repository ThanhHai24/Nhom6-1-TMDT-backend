import { Request, Response } from "express";
import {
    getUserCount, getUserThisMonthCount,
    getProductsCount, getProductThisMonthCount,
    getRevenueThisMonth, getMonthlyRevenueThisYear, getRevenueThisYear,
    getOrdersCountThisYear, getOrderStatusStats, getMonthlyOrdersThisYear,
    getTopSellingProducts, getSlowMovingProducts,
    getActivePromotions, getRecentOrders,
} from "services/admin/dashboard.services";

const getDashboardPage = async (req: Request, res: Response) => {
    const [
        usersCount,
        usersThisMonth,
        productsCount,
        productsThisMonth,
        revenueThisMonth,
        revenueThisYear,
        monthlyRevenue,
        ordersThisYear,
        orderStatusStats,
        monthlyOrders,
        topProducts,
        slowMoving,
        activePromotions,
        recentOrders,
    ] = await Promise.all([
        getUserCount(),
        getUserThisMonthCount(),
        getProductsCount(),
        getProductThisMonthCount(),
        getRevenueThisMonth(),
        getRevenueThisYear(),
        getMonthlyRevenueThisYear(),
        getOrdersCountThisYear(),
        getOrderStatusStats(),
        getMonthlyOrdersThisYear(),
        getTopSellingProducts(8),
        getSlowMovingProducts(8),
        getActivePromotions(),
        getRecentOrders(8),
    ]);

    // Ngày hiện tại cho header
    const now = new Date();
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const currentDate = `${dayNames[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const currentYear = now.getFullYear();

    res.render("admin/dashboard/dashboard", {
        usersCount,
        usersThisMonth,
        productsCount,
        productsThisMonth,
        revenueThisMonth,
        revenueThisYear,
        monthlyRevenue: JSON.stringify(monthlyRevenue),
        ordersThisYear,
        orderStatusStats: JSON.stringify(orderStatusStats),
        monthlyOrders: JSON.stringify(monthlyOrders),
        topProducts: JSON.stringify(topProducts),
        slowMoving,
        activePromotions,
        recentOrders,
        currentDate,
        currentYear,
        layout: "admin/layout/main",
        title: "Dashboard"
    });
};

const getWarehousePage = async (req: Request, res: Response) => {
    res.render("admin/warehouse/warehouse", {
        layout: "admin/layout/main",
        title: "Quản lý kho"
    });
};

const getPromotionPage = async (req: Request, res: Response) => {
    res.render("admin/promotion/promotion", {
        layout: "admin/layout/main",
        title: "Quản lý khuyến mãi"
    });
};

const getNotificationPage = async (req: Request, res: Response) => {
    res.render("admin/notification/notification", {
        layout: "admin/layout/main",
        title: "Quản lý thông báo"
    });
};

const getHistoryPage = async (req: Request, res: Response) => {
    res.render("admin/history/history", {
        layout: "admin/layout/main",
        title: "Lịch sử hoạt động"
    });
};

export { getDashboardPage, getWarehousePage, getPromotionPage, getNotificationPage, getHistoryPage };