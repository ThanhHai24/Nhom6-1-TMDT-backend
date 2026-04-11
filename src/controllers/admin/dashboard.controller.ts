import exp from "constants";
import { Request, Response } from "express";
const getDashboardPage = async (req: Request, res: Response) => {
    res.render("admin/dashboard/dashboard");
}

const getOrdersPage = async (req: Request, res: Response) => {
    res.render("admin/orders/order");
}

const getWarehousePage = async (req: Request, res: Response) => {
    res.render("admin/warehouse/warehouse");
}

const getPromotionPage = async (req: Request, res: Response) => {
    res.render("admin/promotion/promotion");
}

const getShippingPage = async (req: Request, res: Response) => {
    res.render("admin/shipping/shipping");
}

const getNotificationPage = async (req: Request, res: Response) => {
    res.render("admin/notification/notification");
}

const getHistoryPage = async (req: Request, res: Response) => {
    res.render("admin/history/history");
}

export { getDashboardPage, getOrdersPage, getWarehousePage, getPromotionPage, getShippingPage, getNotificationPage, getHistoryPage }