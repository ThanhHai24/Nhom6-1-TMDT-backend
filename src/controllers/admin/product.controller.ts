import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllCategories, getCategories } from "services/admin/category.services";
import { getAllBrands } from "services/admin/brand.services";
import { getAllSuppliers } from "services/admin/supplier.services";
import { autoGenerateSlug, generateSKUWithDB, getAllProducts, getProductById, HandleActiveProduct, HandleCreateProduct, HandleLockProduct, HandleUpdateProduct } from "services/admin/product.services";

const getProductsPage = async (req: Request, res: Response) => {
    const products = await getAllProducts();
    res.render("admin/products/product", {
        products: products,
    });
}

const getCreateProductPage = async (req: Request, res: Response) => {
    const brands = await getAllBrands();
    const suppliers = await getAllSuppliers();
    const categories = await getCategories();
    res.render("admin/products/create", {
        brands: brands,
        suppliers: suppliers,
        categories: categories,
    });
}

const PostCreateProduct = async (req: Request, res: Response) => {
    const {
        name, category, cost, price, stock, lowStockThreshold,
        brand, supplier, shortDescription, description,
        isHot, isNew, isFeatured
    } = req.body;

    const sku = await generateSKUWithDB(prisma, category);
    const slug = autoGenerateSlug(name);

    // Khi dùng multer .fields(), req.files là object { fieldname: File[] }
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImage = uploadedFiles?.['image']?.[0];
    const productImages = uploadedFiles?.['images'] ?? [];

    await HandleCreateProduct(name, slug, sku, shortDescription, description, cost, price, stock, lowStockThreshold, coverImage?.filename, productImages.map((img) => img.filename), isHot, isNew, isFeatured, category, brand, supplier);
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
    res.render("admin/products/detail", {
        product: product,
        brands: brands,
        suppliers: suppliers,
        categories: categories,
    });
}

const PostUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, category, cost, price, stock, lowStockThreshold, brand, supplier, shortDescription, description, isHot, isNew, isFeatured, existingCover, existingImages } = req.body;
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

    await HandleUpdateProduct(id, name, slug, shortDescription, description, cost, price, stock, lowStockThreshold, finalCover, finalImages, isHot, isNew, isFeatured, category, brand, supplier);
    res.redirect("/admin/products");
}
export { getProductsPage, getCreateProductPage, PostCreateProduct, PostActiveProduct, PostLockProduct, getProductDetailPage, PostUpdateProduct }