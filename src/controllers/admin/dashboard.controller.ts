import { Request, Response } from "express";
import { getProductsCount, getProductThisMonthCount, getUserCount, getUserThisMonthCount } from "services/admin/dashboard.services";
const getDashboardPage = async (req: Request, res: Response) => {
    const usersCount = await getUserCount();
    const usersThisMonth = await getUserThisMonthCount();
    const productsCount = await getProductsCount();
    const productsThisMonth = await getProductThisMonthCount();
    res.render("admin/dashboard/dashboard", {
        usersCount: usersCount,
        usersThisMonth: usersThisMonth,
        productsCount: productsCount,
        productsThisMonth: productsThisMonth
    });
}

const getWarehousePage = async (req: Request, res: Response) => {
    res.render("admin/warehouse/warehouse");
}

const getPromotionPage = async (req: Request, res: Response) => {
    res.render("admin/promotion/promotion");
}

const getNotificationPage = async (req: Request, res: Response) => {
    res.render("admin/notification/notification");
}

const getHistoryPage = async (req: Request, res: Response) => {
    res.render("admin/history/history");
}

export { getDashboardPage, getWarehousePage, getPromotionPage, getNotificationPage, getHistoryPage }