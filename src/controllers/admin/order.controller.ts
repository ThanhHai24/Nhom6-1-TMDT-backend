import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllOrders } from "services/admin/order.service";

const getOrdersPage = async (req: Request, res: Response) => {
    const orders = await getAllOrders();
    res.render("admin/orders/order");
}

export { getOrdersPage }