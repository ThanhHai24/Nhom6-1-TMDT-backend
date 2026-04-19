import { Role } from "@prisma/client";
import { prisma } from "config/client";
import bcrypt from 'bcrypt';
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds);
}

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
    const cleanRole = role?.trim().toUpperCase();

    if (!Object.values(Role).includes(cleanRole as Role)) {
        console.log("Role nhận được:", role); // debug
        throw new Error('Role không hợp lệ');
    }

    return cleanRole as Role;
}


const HandleCreateUser = async (fullName: string, username: string, email: string, role: string, phone: string, dob: Date, gender: string, idCard: string, password: string, avatar: string | null) => {
    await prisma.user.create({
        data: {
            fullName: fullName,
            username: username,
            email: email,
            role: parseRole(role),
            phone: phone,
            avatar: avatar,
            dob: new Date(dob),
            gender: gender,
            idCard: idCard,
            password: await hashPassword(password),
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

const updateUserById = async (id: String, fullName: string, email: string, role: string, phone: string, dob: Date, gender: string, idCard: string, avatar: string | null) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            fullName: fullName,
            email: email,
            role: parseRole(role),
            phone: phone,
            dob: new Date(dob),
            gender: gender,
            idCard: idCard,
            ...(avatar !== null && { avatar: avatar })
        }
    })
}

const HandleDeleteUser = async (id: String) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id: +id
        }
    })
}

const HandleActiveUser = async (id: String) => {
    const ativatedUser = await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            status: "ACTIVE"
        }
    }
    )
}

const HandleLockUser = async (id: String) => {
    const lockedUser = await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            status: "INACTIVE"
        }
    }
    )
}
export { getAllUsers, getUserCount, getActiveUsersCount, getInactiveUsersCount, HandleCreateUser, getUserByID, updateUserById, HandleDeleteUser, HandleActiveUser, HandleLockUser }