import { Request, Response } from "express";
import { prisma } from "config/client";
import {
    getBannerCount,
    getActiveBannersCount,
    getInactiveBannersCount,
    getBannerById,
    HandleCreateBanner,
    HandleUpdateBanner,
    HandleLockBanner,
    HandleActiveBanner,
    HandleDeleteBanner
} from "services/admin/banner.services";

const getBannersPage = async (req: Request, res: Response) => {
    try {
        const bannerCount = await getBannerCount();
        const activeBannersCount = await getActiveBannersCount();
        const inactiveBannersCount = await getInactiveBannersCount();

        const page = parseInt(req.query.page as string) || 1;
        const q = (req.query.q as string) || "";
        const type = (req.query.type as string) || "";
        const position = (req.query.position as string) || "";
        const status = (req.query.status as string) || "";

        const limit = 8;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (q) {
            where.OR = [
                { title: { contains: q } },
                { link: { contains: q } },
            ];
        }
        if (type) {
            where.type = type;
        }
        if (position) {
            where.position = position;
        }
        if (status) {
            where.status = status;
        }

        const [banners, total] = await Promise.all([
            prisma.banner.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { type: "asc" },
                    { order: "asc" },
                    { id: "desc" }
                ]
            }),
            prisma.banner.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        res.render("admin/banner/banner", {
            banners,
            currentPage: page,
            totalPages,
            q,
            type,
            position,
            status,
            bannerCount,
            activeBannersCount,
            inactiveBannersCount,
            layout: "admin/layout/main",
            title: "Quản lý Banner & Slideshow"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const getCreateBannerPage = async (req: Request, res: Response) => {
    try {
        res.render("admin/banner/create", {
            layout: "admin/layout/main",
            title: "Thêm Banner / Slide mới"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostCreateBanner = async (req: Request, res: Response) => {
    try {
        const { title, link, type, position, order, status } = req.body;
        const file = req.file;

        if (!file) {
            req.session.error_msg = "Vui lòng tải lên một hình ảnh.";
            return res.redirect("/admin/banners/create");
        }

        await HandleCreateBanner({
            title,
            image: file.filename,
            link,
            type,
            position,
            order: order ? parseInt(order) : 0,
            status
        });

        res.redirect("/admin/banners");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const getBannerDetailPage = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const banner = await getBannerById(id);
        if (!banner) {
            return res.status(404).send("Banner not found");
        }
        res.render("admin/banner/detail", {
            banner,
            layout: "admin/layout/main",
            title: "Chi tiết Banner / Slide"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostUpdateBanner = async (req: Request, res: Response) => {
    try {
        const { id, title, link, type, position, order, status } = req.body;
        const file = req.file;

        const banner = await getBannerById(id as string);
        if (!banner) {
            return res.status(404).send("Banner not found");
        }

        const data: any = {
            title,
            link,
            type,
            position,
            order: order ? parseInt(order) : 0,
            status
        };

        if (file) {
            data.image = file.filename;
        }

        await HandleUpdateBanner(id as string, data);
        res.redirect("/admin/banners");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostLockBanner = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await HandleLockBanner(id);
        res.redirect("/admin/banners");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostActiveBanner = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await HandleActiveBanner(id);
        res.redirect("/admin/banners");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostDeleteBanner = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await HandleDeleteBanner(id);
        res.redirect("/admin/banners");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

export {
    getBannersPage,
    getCreateBannerPage,
    PostCreateBanner,
    getBannerDetailPage,
    PostUpdateBanner,
    PostLockBanner,
    PostActiveBanner,
    PostDeleteBanner
};
