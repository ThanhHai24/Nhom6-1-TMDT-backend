import { Request, Response } from "express";
const getUsersPage = async (req: Request, res: Response) => {
    res.render("admin/users/user");
}
const getCreateUserPage = async (req: Request, res: Response) => {
    res.render("admin/users/createUser");
}
export { getUsersPage, getCreateUserPage }