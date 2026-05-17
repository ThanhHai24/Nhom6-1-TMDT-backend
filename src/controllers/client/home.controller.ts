import { User } from "@prisma/client";
import { Request, Response } from "express";
import { getHotProducts, getLaptopProducts, getPCProducts, getProductBySlug, getCPUProducts, getGPUProducts, getProductsByFilter, getBrandsForCategory, searchProducts } from "services/client/product.services";
import { updateProfile, getUserOrders, getOrderByCode, cancelOrderByCode } from "services/client/user.services";

// Map slug → display name (khớp với category.seed.ts)
const CATEGORY_MAP: Record<string, string> = {
    'pc': 'PC - Máy tính bàn',
    'pc-gaming': 'PC GAMING',
    'pc-van-phong': 'PC Văn phòng',
    'pc-do-hoa': 'PC Đồ họa / Làm việc',
    'laptop': 'LAPTOP',
    'laptop-gaming': 'Laptop Gaming',
    'laptop-van-phong': 'Laptop Văn phòng',
    'laptop-do-hoa': 'Laptop Đồ họa',
    'linh-kien': 'Linh kiện',
    'cpu-vi-xu-ly': 'CPU / Vi xử lý',
    'card-do-hoa-gpu': 'Card đồ họa (GPU)',
    'ram': 'RAM',
    'o-cung-ssd': 'Ổ cứng / SSD',
    'mainboard': 'Mainboard',
    'nguon-may-tinh': 'Nguồn máy tính',
    'vo-may-tinh': 'Vỏ máy tính',
    'thiet-bi-ngoai-vi': 'Thiết bị ngoại vi',
    'man-hinh': 'Màn hình',
    'ban-phim': 'Bàn phím',
    'chuot': 'Chuột',
    'tai-nghe': 'Tai nghe',
    'tan-nhiet-pc': 'Tản nhiệt PC',
    'tan-nhiet-khi': 'Tản nhiệt khí',
    'tan-nhiet-nuoc': 'Tản nhiệt nước',
    'quat-tan-nhiet': 'Quạt tản nhiệt',
    'phu-kien-cap': 'Phụ kiện & Cáp',
};


const getHomePage = async (req: Request, res: Response) => {
    const hotproducts = await getHotProducts();
    const laptops = await getLaptopProducts();
    const pcs = await getPCProducts();
    const cpus = await getCPUProducts();

    res.render("StorePage/homepage/index", {
        hotproducts,
        laptops,
        pcs,
        cpus,
    });
};

const getListPage = async (req: Request, res: Response) => {
    const categorySlug = (req.params.category as string) || '';
    const categoryName = CATEGORY_MAP[categorySlug] || categorySlug;

    // Parse query params
    const sort = (req.query.sort as string) || '';
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    const isHot = req.query.isHot === '1';
    const isNew = req.query.isNew === '1';
    const inStock = req.query.inStock === '1';
    const page = req.query.page ? parseInt(req.query.page as string) : 1;

    const rawBrands = req.query.brandId;
    const selectedBrands: string[] = Array.isArray(rawBrands)
        ? (rawBrands as string[])
        : rawBrands ? [rawBrands as string] : [];
    const brandIds = selectedBrands.map(Number).filter(Boolean);

    const { products, totalPages } = await getProductsByFilter({
        categorySlug: categorySlug || undefined,
        brandIds,
        minPrice,
        maxPrice,
        isHot: isHot || undefined,
        isNew: isNew || undefined,
        inStock: inStock || undefined,
        sort,
        page,
        limit: 16,
    });

    const brands = await getBrandsForCategory(categorySlug);

    res.render("StorePage/homepage/list", {
        categoryName,
        products,
        brands,
        selectedBrands,
        sort,
        minPrice,
        maxPrice,
        isHot,
        isNew,
        inStock,
        currentPage: page,
        totalPages,
    });
};

const getProductPage = async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const product = await getProductBySlug(slug);
    res.render("StorePage/homepage/product", { product });
};

const getProfilePage = async (req: Request, res: Response) => {
    const user = req.user as User;
    res.render("StorePage/homepage/profile", { user });
};

const postUpdateProfile = async (req: Request, res: Response) => {
    const { id, fullName, email, phone, dob, gender, idcard } = req.body
    const file = req.file;
    const avatar = file ? file.filename : null;
    if (typeof id != "string") {
        return res.status(400).json({ error: "Invalid id" });
    }
    const user = await updateProfile(id, fullName, email, phone, dob, gender, idcard, avatar);
    res.redirect("/profile");
};

const getOrderPage = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = Number(user.id);
    const LIMIT = 5;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const status = (req.query.status as string) || 'ALL';

    const { orders, total } = await getUserOrders(userId, page, LIMIT, status);
    const totalPages = Math.ceil(total / LIMIT);

    res.render("StorePage/homepage/order", {
        user,
        orders,
        currentPage: page,
        totalPages,
        totalOrders: total,
        currentStatus: status,
        limit: LIMIT
    });
};

const getOrderDetailPage = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = Number(user.id);
    const code = req.params.code as string;

    const order = await getOrderByCode(code, userId);
    if (!order) {
        return res.status(404).render('StorePage/homepage/404', { message: 'Không tìm thấy đơn hàng.' });
    }
    res.render('StorePage/homepage/order-detail', { user, order });
};

const postCancelOrder = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = Number(user.id);
    const code = req.params.code as string;

    const result = await cancelOrderByCode(code, userId);
    if (!result) {
        return res.status(400).json({ success: false, message: 'Không thể hủy đơn hàng. Đơn hàng không tồn tại hoặc đã được xác nhận.' });
    }
    return res.json({ success: true, message: 'Đơn hàng đã được hủy thành công.' });
};

const getSearchPage = async (req: Request, res: Response) => {
    const searchTerm = (req.query.searchTerm as string) || '';

    // Parse filter params (same as getListPage)
    const sort        = (req.query.sort as string) || '';
    const minPrice    = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice    = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    const isHot       = req.query.isHot   === '1';
    const isNew       = req.query.isNew   === '1';
    const inStock     = req.query.inStock === '1';
    const page        = req.query.page    ? parseInt(req.query.page as string) : 1;

    const rawBrands = req.query.brandId;
    const selectedBrands: string[] = Array.isArray(rawBrands)
        ? (rawBrands as string[])
        : rawBrands ? [rawBrands as string] : [];
    const brandIds = selectedBrands.map(Number).filter(Boolean);

    const { products, total, totalPages, brands } = await searchProducts({
        searchTerm,
        brandIds,
        minPrice,
        maxPrice,
        isHot: isHot || undefined,
        isNew: isNew || undefined,
        inStock: inStock || undefined,
        sort,
        page,
        limit: 16,
    });

    res.render("StorePage/homepage/search", {
        products,
        searchTerm,
        brands,
        selectedBrands,
        sort,
        minPrice,
        maxPrice,
        isHot,
        isNew,
        inStock,
        currentPage: page,
        totalPages,
        total,
    });
};

export { getHomePage, getProductPage, getListPage, getProfilePage, postUpdateProfile, getOrderPage, getOrderDetailPage, postCancelOrder, getSearchPage };

