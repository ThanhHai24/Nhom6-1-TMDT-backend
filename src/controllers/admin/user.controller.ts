import { prisma } from "config/client";
import { error } from "console";
import { Request, Response } from "express";
import { getActiveUsersCount, getInactiveUsersCount, getAllUsers, getUserCount, HandleCreateUser, getUserByID, updateUserById, HandleDeleteUser, HandleLockUser, HandleActiveUser } from "services/admin/user.service";
const getUsersPage = async (req: Request, res: Response) => {
    const users = await getAllUsers();
    const usercount = await getUserCount();
    const activeUsersCount = await getActiveUsersCount();
    const inactiveUsersCount = await getInactiveUsersCount();
    res.render("admin/users/user", {
        users: users,
        usercount: usercount,
        activeUsersCount: activeUsersCount,
        inactiveUsersCount: inactiveUsersCount
    });
}
const getCreateUserPage = async (req: Request, res: Response) => {
    res.render("admin/users/create");
}

const getUsers = async (req: Request, res: Response) => {
    const usercount = await getUserCount();
    const activeUsersCount = await getActiveUsersCount();
    const inactiveUsersCount = await getInactiveUsersCount();

    const page = parseInt(req.query.page as string) || 1;
    const q = (req.query.q as string) || "";
    const role = (req.query.role as string) || "";
    const status = (req.query.status as string) || "";

    const limit = 5;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (q) {
        where.OR = [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { idCard: { contains: q } },
        ];
    }
    
    if (role) {
        where.role = role;
    }
    
    if (status) {
        where.status = status;
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" }
        }),
        prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(total / limit);

    res.render("admin/users/user", {
        users: users,
        currentPage: page,
        totalPages: totalPages,
        q: q,
        role: role,
        status: status,
        usercount: usercount,
        activeUsersCount: activeUsersCount,
        inactiveUsersCount: inactiveUsersCount
    });
}

const PostCreateUser = async (req: Request, res: Response) => {
    const { fullName, username, email, role, phone, dob, gender, idCard, password } = req.body;
    const file = req.file;
    const avatar = file ? file.filename : null;
    await HandleCreateUser(fullName, username, email, role, phone, dob, gender, idCard, password, avatar);
    res.redirect("/admin/users");
}

const getUserDetailPage = async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = await getUserByID(userId);
    res.render("admin/users/detail", {
        user: user
    });
}

const PostUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, email, phone, role, dob, gender, idcard } = req.body
    const file = req.file;
    const avatar = file ? file.filename : null;
    if (typeof id != "string") {
        return res.status(400).json({ error: "Invalid id" });
    }
    const user = await updateUserById(id, fullName, email, role, phone, dob, gender, idcard, avatar);
    return res.redirect("/admin/users");

}

const PostDeleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    await HandleDeleteUser(userId);
    return res.redirect("/admin/users")
}

const PostLockUser = async (req: Request, res: Response) => {
    const userId = req.params.id as String;
    await HandleLockUser(userId);
    return res.redirect("/admin/users")
}

const PostActiveUser = async (req: Request, res: Response) => {
    const userId = req.params.id as String;
    await HandleActiveUser(userId);
    return res.redirect("/admin/users")
}
export { getUsersPage, getCreateUserPage, PostCreateUser, getUserDetailPage, PostUpdateUser, PostDeleteUser, PostActiveUser, PostLockUser, getUsers }