import { Request, Response } from "express";
import { prisma } from "config/client";

// Simple Vietnamese slug generator helper
const toSlug = (str: string): string => {
    str = str.toLowerCase();
    // Remove Vietnamese accents
    str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
    str = str.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
    str = str.replace(/[íìỉĩị]/g, 'i');
    str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
    str = str.replace(/[úùủũụưứừửữự]/g, 'u');
    str = str.replace(/[ýỳỷỹỵ]/g, 'y');
    str = str.replace(/đ/g, 'd');
    // Remove special characters, keep letters, numbers, spaces, and hyphens
    str = str.replace(/[^a-z0-9\s-]/g, '');
    // Replace multiple spaces or hyphens with a single hyphen
    str = str.replace(/[\s-]+/g, '-');
    // Trim leading/trailing hyphens
    return str.replace(/^-+|-+$/g, '');
};

// JSON stringify helper for BigInt
const serialize = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) => 
            typeof value === "bigint" ? value.toString() : value
        )
    );
};

// GET /api/categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                children: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json(serialize(categories));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách danh mục", details: error });
    }
};

// GET /api/categories/:id
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id: BigInt(id as string) },
            include: {
                parent: true,
                children: true
            }
        });
        if (!category) {
            return res.status(404).json({ error: "Không tìm thấy danh mục" });
        }
        res.status(200).json(serialize(category));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy chi tiết danh mục", details: error });
    }
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, icon, status, parentId } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Tên danh mục là bắt buộc" });
        }

        const generatedSlug = slug ? toSlug(slug) : toSlug(name);

        // Check unique slug
        const existingCategory = await prisma.category.findUnique({
            where: { slug: generatedSlug }
        });
        if (existingCategory) {
            return res.status(400).json({ error: `Slug "${generatedSlug}" đã tồn tại` });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug: generatedSlug,
                description,
                icon,
                status: status || "ACTIVE",
                parentId: parentId ? BigInt(parentId) : null
            }
        });

        res.status(201).json(serialize(category));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo danh mục", details: error });
    }
};

// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, description, icon, status, parentId } = req.body;

        const categoryId = BigInt(id as string);
        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!existingCategory) {
            return res.status(404).json({ error: "Không tìm thấy danh mục để cập nhật" });
        }

        const data: any = {};
        if (name !== undefined) data.name = name;
        if (description !== undefined) data.description = description;
        if (icon !== undefined) data.icon = icon;
        if (status !== undefined) data.status = status;
        
        if (parentId !== undefined) {
            data.parentId = parentId ? BigInt(parentId) : null;
        }

        if (slug !== undefined) {
            data.slug = toSlug(slug);
        } else if (name !== undefined) {
            data.slug = toSlug(name);
        }

        // If slug is changing, verify uniqueness
        if (data.slug && data.slug !== existingCategory.slug) {
            const slugConflict = await prisma.category.findUnique({
                where: { slug: data.slug }
            });
            if (slugConflict) {
                return res.status(400).json({ error: `Slug "${data.slug}" đã tồn tại` });
            }
        }

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data
        });

        res.status(200).json(serialize(updatedCategory));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật danh mục", details: error });
    }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryId = BigInt(id as string);

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { children: true, products: true }
        });

        if (!existingCategory) {
            return res.status(404).json({ error: "Không tìm thấy danh mục" });
        }

        if (existingCategory.children.length > 0) {
            return res.status(400).json({ error: "Không thể xóa danh mục vì vẫn còn danh mục con" });
        }

        if (existingCategory.products.length > 0) {
            return res.status(400).json({ error: "Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này" });
        }

        await prisma.category.delete({
            where: { id: categoryId }
        });

        res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa danh mục", details: error });
    }
};
