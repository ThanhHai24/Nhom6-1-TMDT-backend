import { Request, Response } from "express";
import { getSystemNotifications } from "services/admin/notification.services";

const getNotificationsPage = async (req: Request, res: Response) => {
    try {
        const notifications = await getSystemNotifications();
        
        res.render("admin/notification/notification", {
            notifications,
            layout: "admin/layout/main",
            title: "Quản lý Thông báo"
        });
    } catch (error) {
        console.error("Error loading notifications page:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { getNotificationsPage };
