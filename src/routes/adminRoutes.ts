import { getBrandDetailPage, getBrandsPage, getCreateBrandPage, PostActiveBrand, PostCreateBrand, PostDeleteBrand, PostLockBrand, PostUpdateBrand } from 'controllers/admin/brand.controller';
import { getCategoriesPage } from 'controllers/admin/category.controller';
import { getDashboardPage, getHistoryPage, getNotificationPage, getPromotionPage, getWarehousePage } from 'controllers/admin/dashboard.controller';
import { getOrderDetailPage, getOrders } from 'controllers/admin/order.controller';
import { getCreateProductPage, getProductDetailPage, getProductsPage, PostActiveProduct, PostCreateProduct, PostLockProduct, PostUpdateProduct } from 'controllers/admin/product.controller';
import { getShippingPage } from 'controllers/admin/shipping.controller';
import { getCreateShippingProviderPage, getShippingProviderDetailPage, getShippingProvidersPage, PostActiveShippingProvider, PostCreateShippingProvider, PostDeleteShippingProvider, PostLockShippingProvider, PostUpdateShippingProvider } from 'controllers/admin/shippingProvider.controller';
import { getCreateSupplierPage, getSupplierDetailPage, getSuppliersPage, PostActiveSupplier, PostCreateSupplier, PostDeleteSupplier, PostLockSupplier, PostUpdateSupplier } from 'controllers/admin/supplier.controller';
import { getCreateUserPage, getUserDetailPage, getUsers, PostActiveUser, PostCreateUser, PostDeleteUser, PostLockUser, PostUpdateUser } from 'controllers/admin/user.controller';
import express from 'express';
import { avatarUploadMiddleware, productUploadMiddleware } from 'src/middleware/multer';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    // Dashboard
    router.get('/dashboard', getDashboardPage);
    // Users
    router.get('/users', getUsers);
    router.get('/users/create', getCreateUserPage);
    router.post('/users/handlecreate', avatarUploadMiddleware("avatar"), PostCreateUser);
    router.get('/users/:id', getUserDetailPage);
    router.post("/users/updateUser", avatarUploadMiddleware("avatar"), PostUpdateUser);
    router.post("/users/delete/:id", PostDeleteUser);
    router.post("/users/lock/:id", PostLockUser);
    router.post("/users/active/:id", PostActiveUser);


    // Category
    router.get('/categories', getCategoriesPage);
    // Product
    router.get('/products', getProductsPage);
    router.get('/products/create', getCreateProductPage);
    router.post('/product/handlecreate', productUploadMiddleware(), PostCreateProduct)
    router.get('/products/:id', getProductDetailPage);
    router.post('/product/handleupdate', productUploadMiddleware(), PostUpdateProduct);
    router.post("/products/lock/:id", PostLockProduct);
    router.post("/products/active/:id", PostActiveProduct);
    // Brand
    router.get('/brands', getBrandsPage);
    router.get('/brands/create', getCreateBrandPage);
    router.post('/brands/handlecreate', PostCreateBrand);
    router.get('/brands/:id', getBrandDetailPage);
    router.post('/brands/handleupdate', PostUpdateBrand);
    router.post("/brands/lock/:id", PostLockBrand);
    router.post("/brands/active/:id", PostActiveBrand);
    router.post("/brands/delete/:id", PostDeleteBrand);
    // Supplier
    router.get('/suppliers', getSuppliersPage);
    router.get('/suppliers/create', getCreateSupplierPage);
    router.post('/suppliers/handlecreate', PostCreateSupplier);
    router.get('/suppliers/:id', getSupplierDetailPage);
    router.post('/suppliers/handleupdate', PostUpdateSupplier);
    router.post("/suppliers/lock/:id", PostLockSupplier);
    router.post("/suppliers/active/:id", PostActiveSupplier);
    router.post("/suppliers/delete/:id", PostDeleteSupplier);
    // Shipping Providers
    router.get('/shipping-providers', getShippingProvidersPage);
    router.get('/shipping-providers/create', getCreateShippingProviderPage);
    router.post('/shipping-providers/handlecreate', PostCreateShippingProvider);
    router.get('/shipping-providers/:id', getShippingProviderDetailPage);
    router.post('/shipping-providers/handleupdate', PostUpdateShippingProvider);
    router.post("/shipping-providers/lock/:id", PostLockShippingProvider);
    router.post("/shipping-providers/active/:id", PostActiveShippingProvider);
    router.post("/shipping-providers/delete/:id", PostDeleteShippingProvider);
    // Orders
    router.get('/orders', getOrders);
    router.get('/order/:id', getOrderDetailPage);
    // Warehouse
    router.get('/warehouse', getWarehousePage);
    // Promotion
    router.get('/promotion', getPromotionPage);
    // Shipping
    router.get('/shipping', getShippingPage);

    // Notification
    router.get('/notification', getNotificationPage);
    // History
    router.get('/history', getHistoryPage);

    app.use('/admin', router);
}
export default userRoutes;