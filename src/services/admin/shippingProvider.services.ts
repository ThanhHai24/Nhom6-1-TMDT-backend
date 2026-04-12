import { prisma } from "config/client";

const getAllShippingProviders = async () => {
    return await prisma.shippingProvider.findMany();
}

const getShippingProviderCount = async () => {
    const count = await prisma.shippingProvider.count();
    return count;
}

const getActiveShippingProviderCount = async () => {
    const count = await prisma.shippingProvider.count({
        where: {
            status: "ACTIVE"
        }
    });
    return count;
}

const getInactiveShippingProvidersCount = async () => {
    const count = await prisma.shippingProvider.count({
        where: {
            status: "INACTIVE"
        }
    });
    return count;
}

const HandleCreateShippingProvider = async (name: string, code: string, apiKey: string, status: string) => {
    return await prisma.shippingProvider.create({
        data: {
            name,
            code,
            apiKey,
            status: status == "active" ? "ACTIVE" : "INACTIVE",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
}

const getShippingProviderById = async (id: string) => {
    return await prisma.shippingProvider.findUnique({
        where: {
            id: +id
        }
    });
}

const HandleUpdateShippingProvider = async (id: string, name: string, code: string, apiKey: string, status: string) => {
    return await prisma.shippingProvider.update({
        where: {
            id: +id
        },
        data: {
            name: name,
            code: code,
            apiKey: apiKey,
            status: status == "active" ? "ACTIVE" : "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleLockShippingProvider = async (id: string) => {
    return await prisma.shippingProvider.update({
        where: {
            id: +id
        },
        data: {
            status: "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleActiveShippingProvider = async (id: string) => {
    return await prisma.shippingProvider.update({
        where: {
            id: +id
        },
        data: {
            status: "ACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleDeleteShippingProvider = async (id: string) => {
    return await prisma.shippingProvider.delete({
        where: {
            id: +id
        }
    });
}

export { getAllShippingProviders, getShippingProviderCount, getActiveShippingProviderCount, getInactiveShippingProvidersCount, HandleCreateShippingProvider, getShippingProviderById, HandleUpdateShippingProvider, HandleLockShippingProvider, HandleActiveShippingProvider, HandleDeleteShippingProvider }