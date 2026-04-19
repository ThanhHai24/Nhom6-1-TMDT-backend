import { prisma } from "config/client";

const getUserCount = async () => {
    const usersCount = await prisma.user.count();
    return usersCount
}

const getUserThisMonthCount = async () => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const usersThisMonth = await prisma.user.count({
    where: {
        createdAt: {
        gte: startOfThisMonth
        }
    }
    });
    return  usersThisMonth
}

const getProductsCount = async () => {
    const usersCount = await prisma.product.count();
    return usersCount
}

const getProductThisMonthCount = async () => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const productThisMonth = await prisma.product.count({
    where: {
        createdAt: {
        gte: startOfThisMonth
        }
    }
    });
    return  productThisMonth
}

export {getUserCount, getUserThisMonthCount, getProductsCount, getProductThisMonthCount}