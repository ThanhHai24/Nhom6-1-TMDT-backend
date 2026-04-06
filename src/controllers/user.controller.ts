import { Request, Response } from "express";
import { getAllUsers, getUserById, handleCreateUser, handleDeleteUser, updateUserById } from "../services/user.service";



const getCreateUserPage = (req: Request, res: Response) => {
    res.render("create-user")
}

const postCreateUser = async (req: Request, res: Response) => {
    // object destructuring
    const { name, email, address } = req.body;
    const a = await handleCreateUser(name, email, address);
    res.redirect("/");
}

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
    }
    await handleDeleteUser(id);
    return res.redirect("/");
}

const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
    }
    const user = await getUserById(id);
    return res.render("view-user", {
        id: id,
        user: user
    })
}

const postUpdateUser = async (req: Request, res: Response) => {
    const { id, name, email, address } = req.body;
    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
    }
    const user = await updateUserById(id, name, email, address);
    return res.redirect("/");
}

export { postCreateUser, postDeleteUser, getViewUser, postUpdateUser }