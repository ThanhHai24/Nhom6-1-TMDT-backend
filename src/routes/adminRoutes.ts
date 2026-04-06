import { getDashboardPage, getHistoryPage, getNotificationPage, getOrdersPage, getProductsPage, getPromotionPage, getShippingPage, getWarehousePage } from 'controllers/admin/dashboard.controller';
import { getCreateUserPage, getUsersPage } from 'controllers/admin/user.controller';
import express from 'express';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    // Dashboard
    router.get('/dashboard', getDashboardPage);
    // Users
    router.get('/users', getUsersPage);
    router.get('/users/create', getCreateUserPage)
    // Product
    router.get('/products', getProductsPage);
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