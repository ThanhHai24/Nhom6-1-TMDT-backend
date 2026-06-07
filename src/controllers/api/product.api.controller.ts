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

// Helper functions for specifications parsing & compatibility checks
const getSpecValue = (specs: any, keyName: string): string | null => {
    if (!specs) return null;
    let arr = [];
    try {
        arr = typeof specs === 'string' ? JSON.parse(specs) : specs;
    } catch (e) {
        return null;
    }
    if (!Array.isArray(arr)) return null;
    const found = arr.find((s: any) => s && s.key && s.key.toLowerCase().trim() === keyName.toLowerCase().trim());
    return found ? found.value : null;
};

const normalizeValue = (val: string): string => {
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.includes('miniitx') || clean === 'itx') return 'itx';
    if (clean.includes('microatx') || clean.includes('matx')) return 'matx';
    if (clean === 'atx') return 'atx';
    return clean;
};

const getTokens = (str: string): string[] => {
    return str.split(/[\/,;]+/)
        .map(s => normalizeValue(s))
        .filter(Boolean);
};

const specsOverlap = (s1: string, s2: string): boolean => {
    const tokens1 = getTokens(s1);
    const tokens2 = getTokens(s2);
    return tokens1.some(t1 => tokens2.some(t2 => t1 === t2));
};

const isCompatible = (product: any, compatSocket?: string, compatRamType?: string, compatFormFactor?: string): boolean => {
    const specs = product.specifications;
    if (!specs) return true;

    // 1. Socket compatibility (for CPU, Mainboard, Cooling)
    if (compatSocket) {
        // CPU Socket
        const cpuSocket = getSpecValue(specs, "Socket");
        if (cpuSocket && !specsOverlap(cpuSocket, compatSocket)) return false;

        // Mainboard Socket
        const mainboardSocket = getSpecValue(specs, "Socket CPU");
        if (mainboardSocket && !specsOverlap(mainboardSocket, compatSocket)) return false;

        // Cooling Socket
        const coolingSocket = getSpecValue(specs, "Socket hỗ trợ");
        if (coolingSocket && !specsOverlap(coolingSocket, compatSocket)) return false;
    }

    // 2. RAM Type compatibility (for CPU, Mainboard, RAM)
    if (compatRamType) {
        // CPU RAM Type
        const cpuRam = getSpecValue(specs, "Loại RAM hỗ trợ");
        if (cpuRam && !specsOverlap(cpuRam, compatRamType)) return false;

        // Mainboard RAM Type
        const mainboardRam = getSpecValue(specs, "Loại RAM hỗ trợ");
        if (mainboardRam && !specsOverlap(mainboardRam, compatRamType)) return false;

        // RAM Type
        const ramType = getSpecValue(specs, "Loại RAM");
        if (ramType && !specsOverlap(ramType, compatRamType)) return false;
    }

    // 3. Form Factor compatibility (for Mainboard, Case)
    if (compatFormFactor) {
        // Mainboard Form Factor
        const mainboardFF = getSpecValue(specs, "Form Factor (Chuẩn kích thước)");
        if (mainboardFF && !specsOverlap(compatFormFactor, mainboardFF)) return false;

        // Case Form Factor Support
        const caseFF = getSpecValue(specs, "Form Factor Mainboard hỗ trợ");
        if (caseFF && !specsOverlap(compatFormFactor, caseFF)) return false;
    }

    return true;
};

// Lấy sản phẩm theo category slug (dùng cho Build PC)
export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { 
            category, search, sort, brand, minPrice, maxPrice, 
            compatSocket, compatRamType, compatFormFactor,
            page = '1', limit = '12' 
        } = req.query;

        const where: any = { status: 'ACTIVE' };

        if (category) {
            where.category = { slug: category as string };
        }
        if (search) {
            where.name = { contains: (search as string).trim() };
        }
        if (brand) {
            where.brand = { slug: brand as string };
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) {
                where.price.gte = parseInt(minPrice as string) || 0;
            }
            if (maxPrice) {
                where.price.lte = parseInt(maxPrice as string) || 0;
            }
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        if (sort === 'price_desc') orderBy = { price: 'desc' };
        if (sort === 'name_asc') orderBy = { name: 'asc' };

        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 12;

        // Fetch brands matching active products in this category dynamically
        let brands: any[] = [];
        if (category) {
            const productsInCategory = await prisma.product.findMany({
                where: {
                    status: 'ACTIVE',
                    category: { slug: category as string }
                },
                select: {
                    brand: true
                },
                distinct: ['brandId']
            });
            brands = productsInCategory.map(p => p.brand).filter(Boolean);
        } else {
            brands = await prisma.brand.findMany({
                where: { status: 'ACTIVE' }
            });
        }

        // Fetch all matching products from database first to filter by specifications compatibility in memory
        const allProducts = await prisma.product.findMany({
            where,
            orderBy,
            include: { brand: true },
        });

        // Filter by compatibility specifications
        const filteredProducts = allProducts.filter(p => 
            isCompatible(
                p, 
                compatSocket as string, 
                compatRamType as string, 
                compatFormFactor as string
            )
        );

        // Apply in-memory pagination
        const skip = (pageNum - 1) * limitNum;
        const products = filteredProducts.slice(skip, skip + limitNum);
        const total = filteredProducts.length;

        const serialized = JSON.stringify(
            { products, total, totalPages: Math.ceil(total / limitNum), currentPage: pageNum, brands },
            (key, value) => typeof value === 'bigint' ? value.toString() : value
        );
        res.status(200).json(JSON.parse(serialized));
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm', details: error });
    }
};
