import { Request, Response } from "express";
import { getAllShipping } from "services/admin/shipping.services";

const getShippingPage = async (req: Request, res: Response) => {
    const shipping = await getAllShipping();
    res.render("admin/shipping/shipping", {
        shipping
    });
}

export { getShippingPage }