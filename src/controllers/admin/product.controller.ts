import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllCategories, getCategories } from "services/admin/category.services";
import { getAllBrands } from "services/admin/brand.services";
import { getAllSuppliers } from "services/admin/supplier.services";
import { autoGenerateSlug, generateSKUWithDB, getAllProducts, getProductsPaginated, getProductById, HandleActiveProduct, HandleCreateProduct, HandleLockProduct, HandleUpdateProduct, incrementViewCount } from "services/admin/product.services";
import { getReviewStats } from "services/admin/review.services";

const getProductsPage = async (req: Request, res: Response) => {
    const LIMIT = 10;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const { products, totalCount } = await getProductsPaginated(page, LIMIT);
    const totalPages = Math.ceil(totalCount / LIMIT);
    res.render("admin/products/product", {
        products,
        currentPage: page,
        totalPages,
        totalCount,
        limit: LIMIT,
    });
}

const getCreateProductPage = async (req: Request, res: Response) => {
    const brands = await getAllBrands();
    const suppliers = await getAllSuppliers();
    const categories = await getCategories();
    const allProducts = await getAllProducts();
    res.render("admin/products/create", {
        brands: brands,
        suppliers: suppliers,
        categories: categories,
        allProducts: allProducts,
    });
}

const PostCreateProduct = async (req: Request, res: Response) => {
    const {
        name, category, cost, price, stock, lowStockThreshold,
        brand, supplier, shortDescription, description,
        isHot, isNew, isFeatured, warranty
    } = req.body;

    const specKeys = req.body.specKey || req.body['specKey[]'] || [];
    const specValues = req.body.specValue || req.body['specValue[]'] || [];
    
    let specifications: any = null;
    if (specKeys.length > 0) {
        specifications = [];
        if (Array.isArray(specKeys)) {
            for (let i = 0; i < specKeys.length; i++) {
                if (specKeys[i] && specValues[i]) {
                    specifications.push({ key: specKeys[i], value: specValues[i] });
                }
            }
        } else if (typeof specKeys === 'string') {
            if (specKeys && specValues) {
                specifications.push({ key: specKeys, value: specValues });
            }
        }
        if (specifications.length === 0) specifications = null;
    }

    const sku = await generateSKUWithDB(prisma, category);
    const slug = autoGenerateSlug(name);

    // Khi dùng multer .fields(), req.files là object { fieldname: File[] }
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImage = uploadedFiles?.['image']?.[0];
    const productImages = uploadedFiles?.['images'] ?? [];

    await HandleCreateProduct(name, slug, sku, shortDescription, description, cost, price, stock, lowStockThreshold, coverImage?.filename, productImages.map((img) => img.filename), isHot, isNew, isFeatured, category, brand, supplier, specifications, warranty ?? null);
    res.redirect("/admin/products");
}

const PostActiveProduct = async (req: Request, res: Response) => {
    const productId = req.params.id as String;
    await HandleActiveProduct(productId);
    res.redirect("/admin/products");
}

const PostLockProduct = async (req: Request, res: Response) => {
    const productId = req.params.id as String;
    await HandleLockProduct(productId);
    res.redirect("/admin/products");
}

const getProductDetailPage = async (req: Request, res: Response) => {
    const productId = req.params.id as String;
    const product = await getProductById(productId);
    const brands = await getAllBrands();
    const suppliers = await getAllSuppliers();
    const categories = await getCategories();
    const allProducts = await getAllProducts();
    const reviewStats = await getReviewStats(productId as string);
    res.render("admin/products/detail", {
        product: product,
        brands: brands,
        suppliers: suppliers,
        categories: categories,
        allProducts: allProducts,
        reviewStats,
    });
}

const PostUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, category, cost, price, stock, lowStockThreshold, brand, supplier, shortDescription, description, isHot, isNew, isFeatured, existingCover, existingImages, warranty } = req.body;
    
    const specKeys = req.body.specKey || req.body['specKey[]'] || [];
    const specValues = req.body.specValue || req.body['specValue[]'] || [];
    
    let specifications: any = null;
    if (specKeys.length > 0) {
        specifications = [];
        if (Array.isArray(specKeys)) {
            for (let i = 0; i < specKeys.length; i++) {
                if (specKeys[i] && specValues[i]) {
                    specifications.push({ key: specKeys[i], value: specValues[i] });
                }
            }
        } else if (typeof specKeys === 'string') {
            if (specKeys && specValues) {
                specifications.push({ key: specKeys, value: specValues });
            }
        }
        if (specifications.length === 0) specifications = null;
    }
    const slug = autoGenerateSlug(name);
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImage = uploadedFiles?.['image']?.[0];
    const productImages = uploadedFiles?.['images'] ?? [];

    const finalCover = coverImage?.filename || existingCover;

    let finalImages: string[] = [];
    if (existingImages) {
        if (Array.isArray(existingImages)) finalImages.push(...existingImages);
        else finalImages.push(existingImages);
    }
    finalImages.push(...productImages.map(img => img.filename));

    await HandleUpdateProduct(id, name, slug, shortDescription, description, cost, price, stock, lowStockThreshold, finalCover, finalImages, isHot, isNew, isFeatured, category, brand, supplier, specifications, warranty ?? null);
    res.redirect("/admin/products");
}
const PostIncrementView = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await incrementViewCount(id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
};

export { getProductsPage, getCreateProductPage, PostCreateProduct, PostActiveProduct, PostLockProduct, getProductDetailPage, PostUpdateProduct, PostIncrementView }