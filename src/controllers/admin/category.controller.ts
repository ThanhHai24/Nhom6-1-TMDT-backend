import { Request, Response } from "express";
import { getAllCategories, HandleCreateCategory, HandleUpdateCategory } from "services/admin/category.services";
import { prisma } from "config/client";

const getCategoriesPage = async (req: Request, res: Response) => {
    const { parentCategories, childCategories } = await getAllCategories();
    res.render("admin/categories/category", { parentCategories, childCategories });
}

const getCreateParentCategoryPage = async (req: Request, res: Response) => {
    res.render("admin/categories/create", { isChild: false, parentCategories: [] });
}

const getCreateChildCategoryPage = async (req: Request, res: Response) => {
    const parentCategories = await prisma.category.findMany({
        where: {
            parentId: null,
            status: "ACTIVE"
        }
    });
    res.render("admin/categories/create", { isChild: true, parentCategories });
}

const PostCreateCategory = async (req: Request, res: Response) => {
    const { name, description, icon, status, parentId } = req.body;
    await HandleCreateCategory(name, description, icon, status, parentId);
    res.redirect("/admin/categories");
}

const PostUpdateCategory = async (req: Request, res: Response) => {
    const { id, name, description, icon, status, parentId } = req.body;
    await HandleUpdateCategory(id, name, description, icon, status, parentId);
    res.redirect("/admin/categories");
}

const getCategoryDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
        where: { id: +id },
        include: { parent: true, children: true }
    });

    if (!category) {
        return res.redirect("/admin/categories");
    }

    const parentCategories = await prisma.category.findMany({
        where: {
            parentId: null,
            status: "ACTIVE"
        }
    });

    res.render("admin/categories/detail", { category, parentCategories });
}

export { getCategoriesPage, getCreateParentCategoryPage, getCreateChildCategoryPage, PostCreateCategory, getCategoryDetailPage, PostUpdateCategory }