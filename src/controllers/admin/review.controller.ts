import { Request, Response } from "express";
import { getAllReviews, getReviewStats, approveReview, rejectReview, deleteReview } from "services/admin/review.services";

const getReviewsPage = async (req: Request, res: Response) => {
    const LIMIT = 20;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const { reviews, totalCount } = await getAllReviews(page, LIMIT);
    const totalPages = Math.ceil(totalCount / LIMIT);
    const stats = await getReviewStats();

    res.render("admin/reviews/index", {
        reviews,
        stats,
        currentPage: page,
        totalPages,
        totalCount,
        limit: LIMIT,
    });
};

const PostApproveReview = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await approveReview(id);
    const referer = req.headers.referer || '/admin/reviews';
    res.redirect(referer);
};

const PostRejectReview = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await rejectReview(id);
    const referer = req.headers.referer || '/admin/reviews';
    res.redirect(referer);
};

const PostDeleteReview = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await deleteReview(id);
    const referer = req.headers.referer || '/admin/reviews';
    res.redirect(referer);
};

export { getReviewsPage, PostApproveReview, PostRejectReview, PostDeleteReview };
