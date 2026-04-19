import { Request, Response } from "express";

const getLoginPage = (req: Request, res: Response) => {
    res.render("StorePage/auth/login")
}

const getRegisterPage = (req: Request, res: Response) => {
    res.render("StorePage/auth/register")
}

export default { getLoginPage, getRegisterPage }