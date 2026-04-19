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
