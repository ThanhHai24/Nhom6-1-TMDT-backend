import { prisma } from "config/client";

const seedPromotions = async () => {
    const count = await prisma.promotion.count();
    if (count > 0) {
        console.log("[Seed] Promotions: already seeded, skipping.");
        return;
    }

    await prisma.promotion.createMany({
        data: [
        {
            id: BigInt("1"),
            name: "Flashsale Hè 2026",
            type: "FIXED",
            discountValue: "10000000",
            maxDiscount: null,
            startDate: new Date("2026-06-07T03:00:00.000Z"),
            endDate: new Date("2026-06-29T17:00:00.000Z")
        }
        ],
    });

    await prisma.coupon.createMany({
        data: [
        {
            id: BigInt("1"),
            code: "FLASHSALE100K",
            discountValue: "10000000",
            usageLimit: 100,
            status: true,
            promotionId: BigInt("1")
        }
        ],
    });

    console.log("[Seed] Promotions and Coupons: seeded successfully.");
};

export default seedPromotions;
