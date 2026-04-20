import authController from 'controllers/auth/auth.controller';
import { getCartPage, addToCart, removeFromCart, checkout, updateCart } from 'controllers/client/cart.controller';
import { getHomePage, getProductPage } from 'controllers/client/home.controller';
import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
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
    router.get('/', getHomePage )
    router.get('/product/:slug', getProductPage)
    
    // Protected routes (example)
    // We will allow cart adding to anyone, but checkout could require isAuthenticated if we want.
    // The plan said we wouldn't stricten checkout to log in, but the existing cart page requires isAuthenticated!
    // I will remove `isAuthenticated` from getCartPage so guests can view cart, and add POST routes.
    router.get('/cart', getCartPage);
    router.post('/cart/add', addToCart);
    router.post('/cart/remove', removeFromCart);
    router.post('/cart/update', updateCart);
    router.post('/cart/checkout', checkout);
    
    app.use("/", router);
}

export default userRoutes;