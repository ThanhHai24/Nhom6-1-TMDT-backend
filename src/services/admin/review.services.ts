import { prisma } from "config/client";

const getAllReviews = async (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    const [reviews, totalCount] = await Promise.all([
        prisma.review.findMany({
            skip,
            take: limit,
            include: {
                user: { select: { id: true, fullName: true, email: true, avatar: true } },
                product: { select: { id: true, name: true, image: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count(),
    ]);
    return { reviews, totalCount };
};

const getReviewsByProductId = async (productId: string | number) => {
    return prisma.review.findMany({
        where: { productId: BigInt(productId) },
        include: {
            user: { select: { id: true, fullName: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getReviewStats = async (productId?: string | number) => {
    const where = productId ? { productId: BigInt(productId) } : {};

    const [total, approved, pending, rejected, avgRating, ratingDist] = await Promise.all([
        prisma.review.count({ where }),
        prisma.review.count({ where: { ...where, status: 'APPROVED' } }),
        prisma.review.count({ where: { ...where, status: 'PENDING' } }),
        prisma.review.count({ where: { ...where, status: 'REJECTED' } }),
        prisma.review.aggregate({ where, _avg: { rating: true } }),
        // Phân bố sao 1→5
        Promise.all([1, 2, 3, 4, 5].map(star =>
            prisma.review.count({ where: { ...where, rating: star } })
        )),
    ]);

    return {
        total,
        approved,
        pending,
        rejected,
        avgRating: Number(avgRating._avg.rating?.toFixed(1) ?? 0),
        ratingDist: { 1: ratingDist[0], 2: ratingDist[1], 3: ratingDist[2], 4: ratingDist[3], 5: ratingDist[4] },
    };
};

const approveReview = async (id: string | number) => {
    return prisma.review.update({
        where: { id: BigInt(id) },
        data: { status: 'APPROVED' },
    });
};

const rejectReview = async (id: string | number) => {
    return prisma.review.update({
        where: { id: BigInt(id) },
        data: { status: 'REJECTED' },
    });
};

const deleteReview = async (id: string | number) => {
    return prisma.review.delete({
        where: { id: BigInt(id) },
    });
};

export { getAllReviews, getReviewsByProductId, getReviewStats, approveReview, rejectReview, deleteReview };
