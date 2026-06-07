import { getBrandDetailPage, getBrandsPage, getCreateBrandPage, PostActiveBrand, PostCreateBrand, PostDeleteBrand, PostLockBrand, PostUpdateBrand } from 'controllers/admin/brand.controller';
import { getBrandsByCategoryId } from 'services/admin/brand.services';
import { getCategoriesPage, getCreateParentCategoryPage, getCreateChildCategoryPage, PostCreateCategory, getCategoryDetailPage, PostUpdateCategory } from 'controllers/admin/category.controller';
import { getDashboardPage, getHistoryPage } from 'controllers/admin/dashboard.controller';
import { getNotificationsPage } from 'controllers/admin/notification.controller';
import { getDashboardStatsByPeriod } from 'services/admin/dashboard.services';
import { getOrderDetailPage, getOrders, PostUpdateOrderStatus } from 'controllers/admin/order.controller';
import { getCreateProductPage, getProductDetailPage, getProductsPage, PostActiveProduct, PostCreateProduct, PostDeleteProduct, PostIncrementView, PostLockProduct, PostUpdateProduct } from 'controllers/admin/product.controller';
import { getReviewsPage, PostApproveReview, PostDeleteReview, PostRejectReview } from 'controllers/admin/review.controller';
import { getShippingPage } from 'controllers/admin/shipping.controller';
import { getWarehousePage, getInventoryAPI, importStockAPI, exportStockAPI, setStockAPI } from 'controllers/admin/warehouse.controller';
import { getCreateShippingProviderPage, getShippingProviderDetailPage, getShippingProvidersPage, PostActiveShippingProvider, PostCreateShippingProvider, PostDeleteShippingProvider, PostLockShippingProvider, PostUpdateShippingProvider } from 'controllers/admin/shippingProvider.controller';
import { getCreateSupplierPage, getSupplierDetailPage, getSuppliersPage, PostActiveSupplier, PostCreateSupplier, PostDeleteSupplier, PostLockSupplier, PostUpdateSupplier } from 'controllers/admin/supplier.controller';
import { getCreateUserPage, getUserDetailPage, getUsers, PostActiveUser, PostCreateUser, PostDeleteUser, PostLockUser, PostUpdateUser } from 'controllers/admin/user.controller';
import { getBannersPage, getCreateBannerPage, PostCreateBanner, getBannerDetailPage, PostUpdateBanner, PostLockBanner, PostActiveBanner, PostDeleteBanner } from 'controllers/admin/banner.controller';
import {
    getPromotionsPage,
    getCreatePromotionPage,
    PostCreatePromotion,
    getPromotionDetailPage,
    PostUpdatePromotion,
    PostDeletePromotion,
    PostCreateCoupon,
    PostDeleteCoupon,
    PostToggleCouponStatus
} from 'controllers/admin/promotion.controller';
import express from 'express';
import fileUploadMiddleware, { avatarUploadMiddleware, productUploadMiddleware } from 'src/middleware/multer';
import { isAuthenticated, requireRole } from 'src/middleware/auth.middleware';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    // Apply base authentication and authorization for all admin routes
    router.use(isAuthenticated);
    router.use(requireRole(['ADMIN', 'MANAGER', 'RECEPTIONIST', 'WAREHOUSE']));

    // Role specific middlewares
    const adminOnly = requireRole(['ADMIN']);
    const catalogRoles = requireRole(['ADMIN', 'MANAGER']);
    const orderRoles = requireRole(['ADMIN', 'MANAGER', 'RECEPTIONIST', 'WAREHOUSE']);
    const warehouseRoles = requireRole(['ADMIN', 'MANAGER', 'WAREHOUSE']);

    // Dashboard (all admin roles — already covered by router.use above)
    router.get('/dashboard', getDashboardPage);

    // Users (ADMIN only)
    router.use('/users', adminOnly);
    router.get('/users', getUsers);
    router.get('/users/create', getCreateUserPage);
    router.post('/users/handlecreate', avatarUploadMiddleware("avatar"), PostCreateUser);
    router.get('/users/:id', getUserDetailPage);
    router.post("/users/updateUser", avatarUploadMiddleware("avatar"), PostUpdateUser);
    router.post("/users/delete/:id", PostDeleteUser);
    router.post("/users/lock/:id", PostLockUser);
    router.post("/users/active/:id", PostActiveUser);


    // Category (Catalog roles)
    router.use('/categories', catalogRoles);
    router.get('/categories', getCategoriesPage);
    router.get('/categories/parent/create', getCreateParentCategoryPage);
    router.get('/categories/child/create', getCreateChildCategoryPage);
    router.post('/categories/handlecreate', PostCreateCategory);
    router.get('/categories/:id', getCategoryDetailPage);
    router.post('/categories/handleupdate', PostUpdateCategory);

    // Product (Catalog roles)
    router.use('/products', catalogRoles);
    router.use('/product', catalogRoles);
    router.get('/products', getProductsPage);
    router.get('/products/create', getCreateProductPage);
    router.post('/product/handlecreate', productUploadMiddleware(), PostCreateProduct)
    router.get('/products/:id', getProductDetailPage);
    router.post('/product/handleupdate', productUploadMiddleware(), PostUpdateProduct);
    router.post("/products/lock/:id", PostLockProduct);
    router.post("/products/active/:id", PostActiveProduct);
    router.post("/products/view/:id", PostIncrementView);
    router.post("/products/delete/:id", PostDeleteProduct);

    // Reviews (Catalog roles)
    router.use('/reviews', catalogRoles);
    router.get('/reviews', getReviewsPage);
    router.post('/reviews/approve/:id', PostApproveReview);
    router.post('/reviews/reject/:id', PostRejectReview);
    router.post('/reviews/delete/:id', PostDeleteReview);

    // Brand (Catalog roles)
    router.use('/brands', catalogRoles);
    router.get('/brands', getBrandsPage);
    router.get('/brands/create', getCreateBrandPage);
    router.post('/brands/handlecreate', PostCreateBrand);
    router.get('/brands/:id', getBrandDetailPage);
    router.post('/brands/handleupdate', PostUpdateBrand);
    router.post("/brands/lock/:id", PostLockBrand);
    router.post("/brands/active/:id", PostActiveBrand);
    router.post("/brands/delete/:id", PostDeleteBrand);

    // Supplier (Catalog roles)
    router.use('/suppliers', catalogRoles);
    router.get('/suppliers', getSuppliersPage);
    router.get('/suppliers/create', getCreateSupplierPage);
    router.post('/suppliers/handlecreate', PostCreateSupplier);
    router.get('/suppliers/:id', getSupplierDetailPage);
    router.post('/suppliers/handleupdate', PostUpdateSupplier);
    router.post("/suppliers/lock/:id", PostLockSupplier);
    router.post("/suppliers/active/:id", PostActiveSupplier);
    router.post("/suppliers/delete/:id", PostDeleteSupplier);

    // Shipping Providers (Catalog roles)
    router.use('/shipping-providers', catalogRoles);
    router.get('/shipping-providers', getShippingProvidersPage);
    router.get('/shipping-providers/create', getCreateShippingProviderPage);
    router.post('/shipping-providers/handlecreate', PostCreateShippingProvider);
    router.get('/shipping-providers/:id', getShippingProviderDetailPage);
    router.post('/shipping-providers/handleupdate', PostUpdateShippingProvider);
    router.post("/shipping-providers/lock/:id", PostLockShippingProvider);
    router.post("/shipping-providers/active/:id", PostActiveShippingProvider);
    router.post("/shipping-providers/delete/:id", PostDeleteShippingProvider);

    // Orders (Order roles)
    router.use('/orders', orderRoles);
    router.use('/order', orderRoles);
    router.get('/orders', getOrders);
    router.get('/order/:id', getOrderDetailPage);
    router.post('/order/:id/updateStatus', PostUpdateOrderStatus);

    // Warehouse (Catalog roles & Warehouse staff)
    router.use('/warehouse', warehouseRoles);
    router.get('/warehouse', getWarehousePage);
    // Warehouse API
    router.use('/api/warehouse', warehouseRoles);
    router.get('/api/warehouse/inventory', getInventoryAPI);
    router.post('/api/warehouse/import', importStockAPI);
    router.post('/api/warehouse/export', exportStockAPI);
    router.post('/api/warehouse/set-stock', setStockAPI);

    // Promotion (Catalog roles)
    router.use('/promotion', catalogRoles);
    router.get('/promotion', getPromotionsPage);
    router.get('/promotion/create', getCreatePromotionPage);
    router.post('/promotion/handlecreate', PostCreatePromotion);
    router.get('/promotion/:id', getPromotionDetailPage);
    router.post('/promotion/handleupdate/:id', PostUpdatePromotion);
    router.post('/promotion/delete/:id', PostDeletePromotion);
    router.post('/promotion/:id/coupons/create', PostCreateCoupon);
    router.post('/promotion/coupons/delete/:id', PostDeleteCoupon);
    router.post('/promotion/coupons/toggle/:id', PostToggleCouponStatus);

    // Banners (Catalog roles)
    router.use('/banners', catalogRoles);
    router.get('/banners', getBannersPage);
    router.get('/banners/create', getCreateBannerPage);
    router.post('/banners/handlecreate', fileUploadMiddleware("image", "admin/bannerImages"), PostCreateBanner);
    router.get('/banners/:id', getBannerDetailPage);
    router.post('/banners/handleupdate', fileUploadMiddleware("image", "admin/bannerImages"), PostUpdateBanner);
    router.post("/banners/lock/:id", PostLockBanner);
    router.post("/banners/active/:id", PostActiveBanner);
    router.post("/banners/delete/:id", PostDeleteBanner);


    // Shipping (Warehouse roles)
    router.use('/shipping', warehouseRoles);
    router.get('/shipping', getShippingPage);

    // Notification (All admin roles)
    router.get('/notification', getNotificationsPage);

    // History (ADMIN only)
    router.use('/history', adminOnly);
    router.get('/history', getHistoryPage);

    // Internal AJAX APIs for admin UI
    router.get('/api/brands', async (req, res) => {
        try {
            const categoryId = req.query.categoryId as string;
            if (!categoryId) {
                // Không có categoryId -> trả về tất cả brands
                const { getAllBrands } = await import('services/admin/brand.services');
                const brands = await getAllBrands();
                return res.json(brands.map(b => ({ id: Number(b.id), name: b.name, slug: b.slug })));
            }
            const brands = await getBrandsByCategoryId(categoryId);
            return res.json(brands.map(b => ({ id: Number(b.id), name: b.name, slug: b.slug })));
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Dashboard stats API (filter by month/year)
    router.get('/api/dashboard-stats', async (req, res) => {
        try {
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const monthParam = req.query.month as string;
            const month = monthParam && monthParam !== '' ? parseInt(monthParam) : null;
            const stats = await getDashboardStatsByPeriod(month, year);
            return res.json({ success: true, ...stats });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    });

    app.use('/admin', router);
}
export default userRoutes;