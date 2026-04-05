import { getDashboardPage, getHistoryPage, getNotificationPage, getOrdersPage, getProductsPage, getPromotionPage, getShippingPage, getUsersPage, getWarehousePage } from 'controllers/admin/dashboard.controller';
import express from 'express';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    router.get('/dashboard', getDashboardPage);

    router.get('/users', getUsersPage);

    router.get('/products', getProductsPage);
    router.get('/orders', getOrdersPage);
    router.get('/warehouse', getWarehousePage);
    router.get('/promotion', getPromotionPage);
    router.get('/shipping', getShippingPage);
    router.get('/notification', getNotificationPage);
    router.get('/history', getHistoryPage);

    app.use('/admin', router);
}
export default userRoutes;