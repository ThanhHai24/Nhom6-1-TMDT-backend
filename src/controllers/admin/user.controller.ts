import { Request, Response } from "express";
import { getActiveUsersCount, getInactiveUsersCount, getAllUsers, getUserCount, HandleCreateUser, getUserByID } from "services/admin/user.service";
const getUsersPage = async (req: Request, res: Response) => {
    const users = await getAllUsers();
    const usercount = await getUserCount();
    const activeUsersCount = await getActiveUsersCount();
    const inactiveUsersCount = await getInactiveUsersCount();
    res.render("admin/users/user", { 
        users:users,
        usercount: usercount,
        activeUsersCount: activeUsersCount,
        inactiveUsersCount: inactiveUsersCount
    });
}
const getCreateUserPage = async (req: Request, res: Response) => {
    res.render("admin/users/create");
}

const PostCreateUser = async (req: Request, res: Response) => {
    const{ fullName, username, email, role, phone, dob, gender, idCard, password } = req.body;
    await HandleCreateUser(fullName, username, email, role, phone, dob, gender, idCard, password);
    res.redirect("/admin/users");
}

const getUserDetailPage = async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = await getUserByID(userId);
    res.render("admin/users/detail", { 
        user:user });
}
export { getUsersPage, getCreateUserPage, PostCreateUser, getUserDetailPage }