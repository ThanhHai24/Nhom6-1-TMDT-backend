import { prisma } from "config/client";

const getAllSuppliers = async () => {
    return await prisma.supplier.findMany();
}

const getSupplierCount = async () => {
    const count = await prisma.supplier.count();
    return count;
}

const getActiveSupplierCount = async () => {
    const count = await prisma.supplier.count({
        where: {
            status: "ACTIVE"
        }
    });
    return count;
}

const getInactiveSuppliersCount = async () => {
    const count = await prisma.supplier.count({
        where: {
            status: "INACTIVE"
        }
    });
    return count;
}

const HandleCreateSupplier = async (name: string, description: string, status: string) => {
    return await prisma.supplier.create({
        data: {
            name,
            description,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            status: status == "active" ? "ACTIVE" : "INACTIVE",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
}

const getSupplierById = async (id: string) => {
    return await prisma.supplier.findUnique({
        where: {
            id: +id
        }
    });
}

const HandleUpdateSupplier = async (id: string, name: string, description: string, status: string) => {
    return await prisma.supplier.update({
        where: {
            id: +id
        },
        data: {
            name,
            description,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            status: status == "active" ? "ACTIVE" : "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleLockSupplier = async (id: string) => {
    return await prisma.supplier.update({
        where: {
            id: +id
        },
        data: {
            status: "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleActiveSupplier = async (id: string) => {
    return await prisma.supplier.update({
        where: {
            id: +id
        },
        data: {
            status: "ACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleDeleteSupplier = async (id: string) => {
    return await prisma.supplier.delete({
        where: {
            id: +id
        }
    });
}

export { getAllSuppliers, getSupplierCount, getActiveSupplierCount, getInactiveSuppliersCount, HandleCreateSupplier, getSupplierById, HandleUpdateSupplier, HandleLockSupplier, HandleActiveSupplier, HandleDeleteSupplier }