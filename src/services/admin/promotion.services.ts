import { prisma } from "config/client";
import { PromotionType } from "@prisma/client";

const getPromotionCount = async (where: any = {}) => {
    return await prisma.promotion.count({ where });
};

const getPromotions = async (where: any = {}, skip?: number, take?: number) => {
    return await prisma.promotion.findMany({
        where,
        skip,
        take,
        include: {
            coupons: true,
        },
        orderBy: {
            id: "desc",
        },
    });
};

const getPromotionById = async (id: string) => {
    return await prisma.promotion.findUnique({
        where: {
            id: BigInt(id),
        },
        include: {
            coupons: true,
        },
    });
};

const HandleCreatePromotion = async (
    promoData: {
        name: string;
        type: PromotionType;
        discountValue: number;
        maxDiscount?: number;
        startDate?: Date | null;
        endDate?: Date | null;
    },
    couponData?: {
        code: string;
        discountValue?: number;
        usageLimit?: number;
        status?: boolean;
    }
) => {
    return await prisma.$transaction(async (tx) => {
        const promotion = await tx.promotion.create({
            data: {
                name: promoData.name,
                type: promoData.type,
                discountValue: promoData.discountValue,
                maxDiscount: promoData.maxDiscount ?? null,
                startDate: promoData.startDate ?? null,
                endDate: promoData.endDate ?? null,
            },
        });

        if (couponData && couponData.code) {
            await tx.coupon.create({
                data: {
                    code: couponData.code.trim().toUpperCase(),
                    discountValue: couponData.discountValue ?? promoData.discountValue,
                    usageLimit: couponData.usageLimit ?? null,
                    status: couponData.status !== undefined ? couponData.status : true,
                    promotionId: promotion.id,
                },
            });
        }

        return promotion;
    });
};

const HandleUpdatePromotion = async (
    id: string,
    promoData: {
        name?: string;
        type?: PromotionType;
        discountValue?: number;
        maxDiscount?: number | null;
        startDate?: Date | null;
        endDate?: Date | null;
    }
) => {
    return await prisma.promotion.update({
        where: {
            id: BigInt(id),
        },
        data: {
            name: promoData.name,
            type: promoData.type,
            discountValue: promoData.discountValue,
            maxDiscount: promoData.maxDiscount,
            startDate: promoData.startDate,
            endDate: promoData.endDate,
        },
    });
};

const HandleDeletePromotion = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
        // Delete related coupons first due to FK constraint
        await tx.coupon.deleteMany({
            where: {
                promotionId: BigInt(id),
            },
        });

        return await tx.promotion.delete({
            where: {
                id: BigInt(id),
            },
        });
    });
};

const HandleCreateCoupon = async (
    promotionId: string,
    couponData: {
        code: string;
        discountValue?: number;
        usageLimit?: number;
        status?: boolean;
    }
) => {
    // Check if coupon code already exists
    const existing = await prisma.coupon.findUnique({
        where: { code: couponData.code.trim().toUpperCase() }
    });
    if (existing) {
        throw new Error(`Mã giảm giá "${couponData.code}" đã tồn tại trên hệ thống.`);
    }

    return await prisma.coupon.create({
        data: {
            code: couponData.code.trim().toUpperCase(),
            discountValue: couponData.discountValue ?? null,
            usageLimit: couponData.usageLimit ?? null,
            status: couponData.status !== undefined ? couponData.status : true,
            promotionId: BigInt(promotionId),
        },
    });
};

const HandleDeleteCoupon = async (couponId: string) => {
    return await prisma.coupon.delete({
        where: {
            id: BigInt(couponId),
        },
    });
};

const HandleToggleCouponStatus = async (couponId: string, status: boolean) => {
    return await prisma.coupon.update({
        where: {
            id: BigInt(couponId),
        },
        data: {
            status,
        },
    });
};

export {
    getPromotionCount,
    getPromotions,
    getPromotionById,
    HandleCreatePromotion,
    HandleUpdatePromotion,
    HandleDeletePromotion,
    HandleCreateCoupon,
    HandleDeleteCoupon,
    HandleToggleCouponStatus,
};
