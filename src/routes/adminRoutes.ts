import { getBrandDetailPage, getBrandsPage, getCreateBrandPage, PostActiveBrand, PostCreateBrand, PostDeleteBrand, PostLockBrand, PostUpdateBrand } from 'controllers/admin/brand.controller';
import { getCategoriesPage } from 'controllers/admin/category.controller';
import { getDashboardPage, getHistoryPage, getNotificationPage, getPromotionPage, getWarehousePage } from 'controllers/admin/dashboard.controller';
import { getOrderDetailPage, getOrders, PostUpdateOrderStatus } from 'controllers/admin/order.controller';
import { getCreateProductPage, getProductDetailPage, getProductsPage, PostActiveProduct, PostCreateProduct, PostLockProduct, PostUpdateProduct } from 'controllers/admin/product.controller';
import { getShippingPage } from 'controllers/admin/shipping.controller';
import { getCreateShippingProviderPage, getShippingProviderDetailPage, getShippingProvidersPage, PostActiveShippingProvider, PostCreateShippingProvider, PostDeleteShippingProvider, PostLockShippingProvider, PostUpdateShippingProvider } from 'controllers/admin/shippingProvider.controller';
import { getCreateSupplierPage, getSupplierDetailPage, getSuppliersPage, PostActiveSupplier, PostCreateSupplier, PostDeleteSupplier, PostLockSupplier, PostUpdateSupplier } from 'controllers/admin/supplier.controller';
import { getCreateUserPage, getUserDetailPage, getUsers, PostActiveUser, PostCreateUser, PostDeleteUser, PostLockUser, PostUpdateUser } from 'controllers/admin/user.controller';
import express from 'express';
import { avatarUploadMiddleware, productUploadMiddleware } from 'src/middleware/multer';
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

    // Warehouse (Catalog roles)
    router.use('/warehouse', catalogRoles);
    router.get('/warehouse', getWarehousePage);

    // Promotion (Catalog roles)
    router.use('/promotion', catalogRoles);
    router.get('/promotion', getPromotionPage);

    // Shipping (Order roles)
    router.use('/shipping', orderRoles);
    router.get('/shipping', getShippingPage);

    // Notification (All admin roles)
    router.get('/notification', getNotificationPage);

    // History (ADMIN only)
    router.use('/history', adminOnly);
    router.get('/history', getHistoryPage);

    app.use('/admin', router);
}
export default userRoutes;