import { Request, Response } from "express";
import { prisma } from "config/client";

// Lấy danh sách sản phẩm
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                brand: true,
                supplier: true,
            }
        });
        
        // Convert BigInt to string for JSON serialization
        const serialized = JSON.stringify(products, (key, value) => 
            typeof value === "bigint" ? value.toString() : value
        );
        res.status(200).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm", details: error });
    }
};

// Thêm mới sản phẩm
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { 
            name, slug, sku, shortDescription, description, 
            cost, price, stock, lowStockThreshold, 
            image, isHot, isNew, isFeatured, 
            categoryId, brandId, supplierId 
        } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                sku,
                shortDescription,
                description,
                cost,
                price,
                stock,
                lowStockThreshold,
                image,
                isHot,
                isNew,
                isFeatured,
                categoryId: BigInt(categoryId),
                brandId: BigInt(brandId),
                supplierId: BigInt(supplierId),
            }
        });

        const serialized = JSON.stringify(product, (key, value) => typeof value === "bigint" ? value.toString() : value);
        res.status(201).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi thêm sản phẩm", details: error });
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Xử lý chuyển ID sang BigInt nếu có
        if (data.categoryId) data.categoryId = BigInt(data.categoryId);
        if (data.brandId) data.brandId = BigInt(data.brandId);
        if (data.supplierId) data.supplierId = BigInt(data.supplierId);

        const product = await prisma.product.update({
            where: { id: BigInt(id as string) },
            data
        });

        const serialized = JSON.stringify(product, (key, value) => typeof value === "bigint" ? value.toString() : value);
        res.status(200).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm", details: error });
    }
};

// Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: BigInt(id as string) }
        });
        res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa sản phẩm", details: error });
    }
};

// Lấy sản phẩm theo category slug (dùng cho Build PC)
export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { category, search, sort, page = '1', limit = '12' } = req.query;

        const where: any = { status: 'ACTIVE' };

        if (category) {
            where.category = { slug: category as string };
        }
        if (search) {
            where.name = { contains: (search as string).trim() };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        if (sort === 'price_desc') orderBy = { price: 'desc' };
        if (sort === 'name_asc') orderBy = { name: 'asc' };

        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 12;
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limitNum,
                include: { brand: true },
            }),
            prisma.product.count({ where }),
        ]);

        const serialized = JSON.stringify(
            { products, total, totalPages: Math.ceil(total / limitNum), currentPage: pageNum },
            (key, value) => typeof value === 'bigint' ? value.toString() : value
        );
        res.status(200).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm', details: error });
    }
};
