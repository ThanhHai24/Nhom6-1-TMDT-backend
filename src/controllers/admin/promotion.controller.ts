import { Request, Response } from "express";
import { PromotionType } from "@prisma/client";
import {
    getPromotionCount,
    getPromotions,
    getPromotionById,
    HandleCreatePromotion,
    HandleUpdatePromotion,
    HandleDeletePromotion,
    HandleCreateCoupon,
    HandleDeleteCoupon,
    HandleToggleCouponStatus
} from "services/admin/promotion.services";

const getPromotionsPage = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const q = (req.query.q as string) || "";
        const status = (req.query.status as string) || ""; // 'RUNNING', 'UPCOMING', 'EXPIRED'

        const limit = 8;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (q) {
            where.name = { contains: q };
        }

        const now = new Date();
        if (status === "RUNNING") {
            where.AND = [
                { OR: [{ startDate: null }, { startDate: { lte: now } }] },
                { OR: [{ endDate: null }, { endDate: { gte: now } }] }
            ];
        } else if (status === "UPCOMING") {
            where.startDate = { gt: now };
        } else if (status === "EXPIRED") {
            where.endDate = { lt: now };
        }

        const [promotions, total] = await Promise.all([
            getPromotions(where, skip, limit),
            getPromotionCount(where)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.render("admin/promotion/promotion", {
            promotions,
            currentPage: page,
            totalPages,
            q,
            status,
            layout: "admin/layout/main",
            title: "Quản lý Khuyến mãi"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const getCreatePromotionPage = async (req: Request, res: Response) => {
    try {
        res.render("admin/promotion/create", {
            layout: "admin/layout/main",
            title: "Tạo chương trình khuyến mãi mới",
            error_msg: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostCreatePromotion = async (req: Request, res: Response) => {
    try {
        const { name, type, discountValue, maxDiscount, startDate, endDate, couponCode, usageLimit } = req.body;

        if (!name || !type || !discountValue) {
            return res.render("admin/promotion/create", {
                layout: "admin/layout/main",
                title: "Tạo chương trình khuyến mãi mới",
                error_msg: "Vui lòng nhập đầy đủ các thông tin bắt buộc."
            });
        }

        const parsedStartDate = startDate ? new Date(startDate) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;

        const promoData = {
            name,
            type: type === "FIXED" ? PromotionType.FIXED : PromotionType.PERCENT,
            discountValue: parseFloat(discountValue),
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
            startDate: parsedStartDate,
            endDate: parsedEndDate
        };

        const couponData = couponCode ? {
            code: couponCode,
            usageLimit: usageLimit ? parseInt(usageLimit) : undefined
        } : undefined;

        await HandleCreatePromotion(promoData, couponData);
        res.redirect("/admin/promotion");
    } catch (error: any) {
        console.error(error);
        res.render("admin/promotion/create", {
            layout: "admin/layout/main",
            title: "Tạo chương trình khuyến mãi mới",
            error_msg: error.message || "Đã xảy ra lỗi khi tạo chương trình khuyến mãi."
        });
    }
};

const getPromotionDetailPage = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const promotion = await getPromotionById(id);

        if (!promotion) {
            return res.status(404).send("Promotion not found");
        }

        res.render("admin/promotion/detail", {
            promotion,
            layout: "admin/layout/main",
            title: "Chi tiết Khuyến mãi",
            error_msg: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostUpdatePromotion = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const { name, type, discountValue, maxDiscount, startDate, endDate } = req.body;

        const parsedStartDate = startDate ? new Date(startDate) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;

        const promoData = {
            name,
            type: type === "FIXED" ? PromotionType.FIXED : PromotionType.PERCENT,
            discountValue: parseFloat(discountValue),
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
            startDate: parsedStartDate,
            endDate: parsedEndDate
        };

        await HandleUpdatePromotion(id, promoData);
        res.redirect("/admin/promotion");
    } catch (error: any) {
        console.error(error);
        const promotion = await getPromotionById(id);
        res.render("admin/promotion/detail", {
            promotion,
            layout: "admin/layout/main",
            title: "Chi tiết Khuyến mãi",
            error_msg: error.message || "Đã xảy ra lỗi khi cập nhật chương trình khuyến mãi."
        });
    }
};

const PostDeletePromotion = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await HandleDeletePromotion(id);
        res.redirect("/admin/promotion");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostCreateCoupon = async (req: Request, res: Response) => {
    const promotionId = req.params.id as string;
    try {
        const { code, discountValue, usageLimit } = req.body;

        if (!code) {
            throw new Error("Mã giảm giá không được để trống.");
        }

        await HandleCreateCoupon(promotionId, {
            code,
            discountValue: discountValue ? parseFloat(discountValue) : undefined,
            usageLimit: usageLimit ? parseInt(usageLimit) : undefined
        });

        res.redirect(`/admin/promotion/${promotionId}`);
    } catch (error: any) {
        console.error(error);
        const promotion = await getPromotionById(promotionId);
        res.render("admin/promotion/detail", {
            promotion,
            layout: "admin/layout/main",
            title: "Chi tiết Khuyến mãi",
            error_msg: error.message || "Đã xảy ra lỗi khi thêm mã giảm giá."
        });
    }
};

const PostDeleteCoupon = async (req: Request, res: Response) => {
    try {
        const couponId = req.params.id as string;
        const coupon = await prisma.coupon.findUnique({ where: { id: BigInt(couponId) } });
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        await HandleDeleteCoupon(couponId);
        res.redirect(`/admin/promotion/${coupon.promotionId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const PostToggleCouponStatus = async (req: Request, res: Response) => {
    try {
        const couponId = req.params.id as string;
        const { status } = req.body;
        const coupon = await prisma.coupon.findUnique({ where: { id: BigInt(couponId) } });
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        await HandleToggleCouponStatus(couponId, status === "true" || status === true);
        res.redirect(`/admin/promotion/${coupon.promotionId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

import { prisma } from "config/client";

export {
    getPromotionsPage,
    getCreatePromotionPage,
    PostCreatePromotion,
    getPromotionDetailPage,
    PostUpdatePromotion,
    PostDeletePromotion,
    PostCreateCoupon,
    PostDeleteCoupon,
    PostToggleCouponStatus
};
