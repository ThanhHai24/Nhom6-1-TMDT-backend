import { Request, Response } from "express";
import { getAllCategories } from "services/admin/category.services";

const getCategoriesPage = async (req: Request, res: Response) => {
    const { parentCategories, childCategories } = await getAllCategories();
    res.render("admin/categories/category", { parentCategories, childCategories });
}

export { getCategoriesPage }