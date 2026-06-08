import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllCategories, getCategories } from "services/admin/category.services";
import { getAllBrands } from "services/admin/brand.services";
import { getAllSuppliers } from "services/admin/supplier.services";
import { autoGenerateSlug, generateSKUWithDB, getAllProducts, getProductsPaginated, getProductById, HandleActiveProduct, HandleCreateProduct, HandleLockProduct, HandleUpdateProduct, incrementViewCount, HandleDeleteProduct } from "services/admin/product.services";
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
        layout: "admin/layout/main",
        title: "Quản lý sản phẩm"
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
        layout: "admin/layout/main",
        title: "Thêm sản phẩm"
    });
}

const PostCreateProduct = async (req: Request, res: Response) => {
    const {
        name, category, cost, price, stock, lowStockThreshold,
        brand, supplier, shortDescription, description,
        isHot, isNew, isFeatured, warranty
    } = req.body;

    try {
        if (!name || name.trim() === '') {
            throw new Error('Tên sản phẩm không được để trống');
        }
        if (name.trim().length > 150) {
            throw new Error('Tên sản phẩm không được vượt quá 150 ký tự');
        }
        if (!category) {
            throw new Error('Vui lòng chọn danh mục sản phẩm');
        }
        if (!brand) {
            throw new Error('Vui lòng chọn thương hiệu');
        }
        if (!supplier) {
            throw new Error('Vui lòng chọn nhà phân phối');
        }

        const costVal = Number(cost);
        if (cost === undefined || cost === null || cost === '' || isNaN(costVal) || costVal < 0 || !Number.isInteger(costVal)) {
            throw new Error('Giá nhập phải là số nguyên không âm');
        }

        const priceVal = Number(price);
        if (price === undefined || price === null || price === '' || isNaN(priceVal) || priceVal < 0 || !Number.isInteger(priceVal)) {
            throw new Error('Giá bán phải là số nguyên không âm');
        }
        if (priceVal < costVal) {
            throw new Error('Giá bán không được nhỏ hơn giá nhập');
        }

        const stockVal = Number(stock);
        if (stock === undefined || stock === null || stock === '' || isNaN(stockVal) || stockVal < 0 || !Number.isInteger(stockVal)) {
            throw new Error('Số lượng tồn kho phải là số nguyên không âm');
        }

        if (lowStockThreshold !== undefined && lowStockThreshold !== null && lowStockThreshold !== '') {
            const thresholdVal = Number(lowStockThreshold);
            if (isNaN(thresholdVal) || thresholdVal < 0 || !Number.isInteger(thresholdVal)) {
                throw new Error('Ngưỡng cảnh báo hết hàng phải là số nguyên không âm');
            }
        }

        if (shortDescription && shortDescription.length > 255) {
            throw new Error('Mô tả ngắn không được vượt quá 255 ký tự');
        }

        const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverImage = uploadedFiles?.['image']?.[0];
        if (!coverImage) {
            throw new Error('Vui lòng chọn ảnh bìa sản phẩm');
        }

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
        const productImages = uploadedFiles?.['images'] ?? [];

        await HandleCreateProduct(name, slug, sku, shortDescription, description, cost, price, stock, lowStockThreshold, coverImage.filename, productImages.map((img) => img.filename), isHot, isNew, isFeatured, category, brand, supplier, specifications, warranty ?? null);
        res.redirect("/admin/products");
    } catch (err: any) {
        req.session.error_msg = err.message || 'Có lỗi xảy ra khi tạo sản phẩm';
        res.redirect("/admin/products/create");
    }
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
        layout: "admin/layout/main",
        title: "Chi tiết sản phẩm"
    });
}

const PostUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, category, cost, price, stock, lowStockThreshold, brand, supplier, shortDescription, description, isHot, isNew, isFeatured, existingCover, existingImages, warranty } = req.body;

    try {
        if (!id) {
            throw new Error('Thiếu ID sản phẩm cần cập nhật');
        }
        if (!name || name.trim() === '') {
            throw new Error('Tên sản phẩm không được để trống');
        }
        if (name.trim().length > 150) {
            throw new Error('Tên sản phẩm không được vượt quá 150 ký tự');
        }
        if (!category) {
            throw new Error('Vui lòng chọn danh mục sản phẩm');
        }
        if (!brand) {
            throw new Error('Vui lòng chọn thương hiệu');
        }
        if (!supplier) {
            throw new Error('Vui lòng chọn nhà phân phối');
        }

        const costVal = Number(cost);
        if (cost === undefined || cost === null || cost === '' || isNaN(costVal) || costVal < 0 || !Number.isInteger(costVal)) {
            throw new Error('Giá nhập phải là số nguyên không âm');
        }

        const priceVal = Number(price);
        if (price === undefined || price === null || price === '' || isNaN(priceVal) || priceVal < 0 || !Number.isInteger(priceVal)) {
            throw new Error('Giá bán phải là số nguyên không âm');
        }
        if (priceVal < costVal) {
            throw new Error('Giá bán không được nhỏ hơn giá nhập');
        }

        const stockVal = Number(stock);
        if (stock === undefined || stock === null || stock === '' || isNaN(stockVal) || stockVal < 0 || !Number.isInteger(stockVal)) {
            throw new Error('Số lượng tồn kho phải là số nguyên không âm');
        }

        if (lowStockThreshold !== undefined && lowStockThreshold !== null && lowStockThreshold !== '') {
            const thresholdVal = Number(lowStockThreshold);
            if (isNaN(thresholdVal) || thresholdVal < 0 || !Number.isInteger(thresholdVal)) {
                throw new Error('Ngưỡng cảnh báo hết hàng phải là số nguyên không âm');
            }
        }

        if (shortDescription && shortDescription.length > 255) {
            throw new Error('Mô tả ngắn không được vượt quá 255 ký tự');
        }

        const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverImage = uploadedFiles?.['image']?.[0];

        const finalCover = coverImage?.filename || existingCover;
        if (!finalCover) {
            throw new Error('Vui lòng chọn ảnh bìa sản phẩm');
        }

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
        const productImages = uploadedFiles?.['images'] ?? [];

        let finalImages: string[] = [];
        if (existingImages) {
            if (Array.isArray(existingImages)) finalImages.push(...existingImages);
            else finalImages.push(existingImages);
        }
        finalImages.push(...productImages.map(img => img.filename));

        await HandleUpdateProduct(id, name, slug, shortDescription, description, cost, price, stock, lowStockThreshold, finalCover, finalImages, isHot, isNew, isFeatured, category, brand, supplier, specifications, warranty ?? null);
        res.redirect("/admin/products");
    } catch (err: any) {
        req.session.error_msg = err.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
        res.redirect(`/admin/products/${id || ''}`);
    }
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

const PostDeleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await HandleDeleteProduct(id);
        res.redirect("/admin/products");
    } catch (e) {
        console.error("Error deleting product:", e);
        res.redirect("/admin/products");
    }
};

export { getProductsPage, getCreateProductPage, PostCreateProduct, PostActiveProduct, PostLockProduct, getProductDetailPage, PostUpdateProduct, PostIncrementView, PostDeleteProduct }