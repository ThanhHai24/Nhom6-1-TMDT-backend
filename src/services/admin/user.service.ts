import { Role } from "@prisma/client";
import { prisma } from "config/client";
import { get } from "http";

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}

const getUserCount = async () => {
    const count = await prisma.user.count();
    return count;
}

const getActiveUsersCount = async () => {
    const count = await prisma.user.count({
        where: {
            status: "ACTIVE"
        }
    });
    return count;
}

const getInactiveUsersCount = async () => {
    const count = await prisma.user.count({
        where: {
            status: "INACTIVE"
        }
    });
    return count;
}

function parseRole(role: string): Role {
    if (!Object.values(Role).includes(role as Role)) {
        throw new Error('Role không hợp lệ');
    }
    return role as Role;
}

const HandleCreateUser = async (fullName: string, username: string, email: string, role: string, phone: string, dob: Date, gender: string, idCard: string, password: string) => {
    await prisma.user.create({
        data: {
            fullName: fullName,
            username: username,
            email: email,
            role: parseRole(role),
            phone: phone,
            avatar: "",
            dob: new Date(dob),
            gender: gender,
            idCard: idCard,
            password: password
        }
    });
}

const getUserByID = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: +id
        }
    });
    return user;
}
export { getAllUsers, getUserCount, getActiveUsersCount, getInactiveUsersCount, HandleCreateUser, getUserByID }