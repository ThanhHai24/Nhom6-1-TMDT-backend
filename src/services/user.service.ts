import getConnection from "config/database";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "config/client";
const handleCreateUser = async (name: string, email: string, address: string) => {
    //insert user into database

    const newUser = await prisma.user.create({
        data: {
            fullName: name,
            username: email,
            address: address,
            phone: "",
            avatar: "",
            password: "",
            accountType: "",
        }
    })
    return newUser;
}

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}

const handleDeleteUser = async (id: string) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id: +id
        }
    })
}

const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: +id
        }
    });
    return user;

}

const updateUserById = async (id: string, name: string, email: string, address: string) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            fullName: name,
            username: email,
            address: address,
            password: "",
            accountType: ""
        }
    })
}

export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById }