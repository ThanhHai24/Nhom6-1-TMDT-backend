import authController from 'controllers/auth/auth.controller';
import { getCartPage, addToCart, removeFromCart, checkout, updateCart } from 'controllers/client/cart.controller';
import { getHomePage, getProductPage, getListPage, getProfilePage, postUpdateProfile, getOrderPage, getOrderDetailPage, postCancelOrder, getSearchPage } from 'controllers/client/home.controller';
import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { avatarUploadMiddleware } from 'src/middleware/multer';

const router = express.Router();

const userRoutes = (app: express.Express) => {
    router.get('/product', getProductPage)

    // Auth
    router.get('/login', authController.getLoginPage)
    router.post('/login', authController.postLogin)
    router.get('/register', authController.getRegisterPage)
    router.post('/register', authController.postRegister)
    router.get('/logout', authController.getLogout)

    // Index
    router.get('/', getHomePage)
    router.get('/product/:slug', getProductPage)

    // Category list pages with filter (slugs from category.seed.ts)
    const categoryRoutes = [
        // PC
        'pc', 'pc-gaming', 'pc-van-phong', 'pc-do-hoa',
        // Laptop
        'laptop', 'laptop-gaming', 'laptop-van-phong', 'laptop-do-hoa',
        // Linh kiện
        'linh-kien', 'cpu-vi-xu-ly', 'card-do-hoa-gpu', 'ram',
        'o-cung-ssd', 'mainboard', 'nguon-may-tinh', 'vo-may-tinh',
        // Ngoại vi
        'thiet-bi-ngoai-vi', 'man-hinh', 'ban-phim', 'chuot', 'tai-nghe',
        // Tản nhiệt
        'tan-nhiet-pc', 'tan-nhiet-khi', 'tan-nhiet-nuoc', 'quat-tan-nhiet',
        // Phụ kiện
        'phu-kien-cap',
    ];
    categoryRoutes.forEach(cat => {
        router.get(`/${cat}`, (req, res) => {
            (req.params as Record<string, string>).category = cat;
            return getListPage(req, res);
        });
    });


    router.get('/cart', getCartPage);
    router.post('/cart/add', addToCart);
    router.post('/cart/remove', removeFromCart);
    router.post('/cart/update', updateCart);
    router.post('/cart/checkout', checkout);

    router.get('/profile', isAuthenticated, getProfilePage)
    router.post('/updateProfile', avatarUploadMiddleware("avatar"), postUpdateProfile)
    router.get('/orders', isAuthenticated, getOrderPage)
    router.get('/orders/:code', isAuthenticated, getOrderDetailPage)
    router.post('/orders/:code/cancel', isAuthenticated, postCancelOrder)

    router.get('/search', getSearchPage);

    app.use("/", router);
}

export default userRoutes;