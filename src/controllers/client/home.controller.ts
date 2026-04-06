import exp from "constants";
import { Request, Response } from "express";
const getHomePage = async (req: Request, res: Response) => {
    res.render("StorePage/homepage/index");
}

const getProductPage = async (req: Request, res: Response) => {
    res.render("StorePage/homepage/product");
}



export { getHomePage, getProductPage }