import { prisma } from "config/client";
import { Request, Response } from "express";
import { getActiveBrandsCount, getAllBrands, getBrandById, getBrandCount, getInactiveBrandsCount, HandleActiveBrand, HandleCreateBrand, HandleDeleteBrand, HandleLockBrand, HandleUpdateBrand } from "services/admin/brand.services";

const getBrandsPage = async (req: Request, res: Response) => {
    const brandCount = await getBrandCount();
    const activeBrandsCount = await getActiveBrandsCount();
    const inactiveBrandsCount = await getInactiveBrandsCount();

    const page = parseInt(req.query.page as string) || 1;
    const q = (req.query.q as string) || "";
    const status = (req.query.status as string) || "";

    const limit = 8;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q } },
            { slug: { contains: q } },
            { description: { contains: q } },
        ];
    }
    if (status) {
        where.status = status;
    }

    const [brands, total] = await Promise.all([
        prisma.brand.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" }
        }),
        prisma.brand.count({ where })
    ])

    const totalPages = Math.ceil(total / limit);

    res.render("admin/brand/brand", {
        brands: brands,
        currentPage: page,
        totalPages: totalPages,
        q: q,
        status: status,
        brandCount: brandCount,
        activeBrandsCount: activeBrandsCount,
        inactiveBrandsCount: inactiveBrandsCount
    });
}

const getCreateBrandPage = async (req: Request, res: Response) => {
    res.render("admin/brand/create");
}

const PostCreateBrand = async (req: Request, res: Response) => {
    const { name, description, status } = req.body
    const brand = await HandleCreateBrand(name, description, status);
    res.redirect("/admin/brands");
}
const getBrandDetailPage = async (req: Request, res: Response) => {
    const brandId = req.params.id as string;
    const brand = await getBrandById(brandId);
    res.render("admin/brand/detail", {
        brand: brand
    });
}
const PostUpdateBrand = async (req: Request, res: Response) => {
    const { id, name, description, status } = req.body
    const brand = await HandleUpdateBrand(id, name, description, status);
    res.redirect("/admin/brands");
}
const PostLockBrand = async (req: Request, res: Response) => {
    const brandId = req.params.id as string;
    const brand = await HandleLockBrand(brandId);
    res.redirect("/admin/brands");
}
const PostActiveBrand = async (req: Request, res: Response) => {
    const brandId = req.params.id as string;
    const brand = await HandleActiveBrand(brandId);
    res.redirect("/admin/brands");
}
const PostDeleteBrand = async (req: Request, res: Response) => {
    const brandId = req.params.id as string;
    const brand = await HandleDeleteBrand(brandId);
    res.redirect("/admin/brands");
}
export { getBrandsPage, getCreateBrandPage, PostCreateBrand, getBrandDetailPage, PostUpdateBrand, PostLockBrand, PostActiveBrand, PostDeleteBrand }