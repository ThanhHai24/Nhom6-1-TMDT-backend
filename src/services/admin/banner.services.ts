import { prisma } from "config/client";
import { Status } from "@prisma/client";

const getBannerCount = async () => {
    const count = await prisma.banner.count();
    return count;
}

const getActiveBannersCount = async () => {
    const count = await prisma.banner.count({
        where: {
            status: "ACTIVE"
        }
    });
    return count;
}

const getInactiveBannersCount = async () => {
    const count = await prisma.banner.count({
        where: {
            status: "INACTIVE"
        }
    });
    return count;
}

const getBannerById = async (id: string) => {
    const banner = await prisma.banner.findUnique({
        where: {
            id: BigInt(id)
        }
    });
    return banner;
}

const HandleCreateBanner = async (data: {
    title?: string;
    image: string;
    link?: string;
    type: string;
    position?: string;
    order?: number;
    status?: string;
}) => {
    return await prisma.banner.create({
        data: {
            title: data.title || null,
            image: data.image,
            link: data.link || null,
            type: data.type,
            position: data.position || null,
            order: data.order !== undefined ? Number(data.order) : 0,
            status: data.status === "INACTIVE" ? Status.INACTIVE : Status.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
}

const HandleUpdateBanner = async (
    id: string,
    data: {
        title?: string;
        image?: string;
        link?: string;
        type: string;
        position?: string;
        order?: number;
        status?: string;
    }
) => {
    const updateData: any = {
        title: data.title || null,
        link: data.link || null,
        type: data.type,
        position: data.position || null,
        order: data.order !== undefined ? Number(data.order) : 0,
        status: data.status === "INACTIVE" ? Status.INACTIVE : Status.ACTIVE,
        updatedAt: new Date()
    };

    if (data.image) {
        updateData.image = data.image;
    }

    return await prisma.banner.update({
        where: {
            id: BigInt(id)
        },
        data: updateData
    });
}

const HandleLockBanner = async (id: string) => {
    return await prisma.banner.update({
        where: {
            id: BigInt(id)
        },
        data: {
            status: "INACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleActiveBanner = async (id: string) => {
    return await prisma.banner.update({
        where: {
            id: BigInt(id)
        },
        data: {
            status: "ACTIVE",
            updatedAt: new Date()
        }
    });
}

const HandleDeleteBanner = async (id: string) => {
    return await prisma.banner.delete({
        where: {
            id: BigInt(id)
        }
    });
}

export {
    getBannerCount,
    getActiveBannersCount,
    getInactiveBannersCount,
    getBannerById,
    HandleCreateBanner,
    HandleUpdateBanner,
    HandleLockBanner,
    HandleActiveBanner,
    HandleDeleteBanner
};
