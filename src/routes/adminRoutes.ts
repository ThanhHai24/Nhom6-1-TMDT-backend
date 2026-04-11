import { getCategoriesPage } from 'controllers/admin/category.controller';
import { getDashboardPage, getHistoryPage, getNotificationPage, getOrdersPage, getPromotionPage, getShippingPage, getWarehousePage } from 'controllers/admin/dashboard.controller';
import { getCreateProductPage, getProductDetailPage, getProductsPage, PostActiveProduct, PostCreateProduct, PostLockProduct, PostUpdateProduct } from 'controllers/admin/product.controller';
import { getCreateUserPage, getUserDetailPage, getUsers, getUsersPage, PostActiveUser, PostCreateUser, PostDeleteUser, PostLockUser, PostUpdateUser } from 'controllers/admin/user.controller';
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
    // Orders
    router.get('/orders', getOrdersPage);
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