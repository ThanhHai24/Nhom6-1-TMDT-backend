import authController from 'controllers/auth/auth.controller';
import { getHomePage, getProductPage } from 'controllers/client/home.controller';
import express from 'express';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    router.get('/', getHomePage)
    router.get('/product', getProductPage)

    // Auth
    router.get('/login', authController.getLoginPage)
    // router.post('/login', PostLogin)
    router.get('/register', authController.getRegisterPage)
    // router.post('/register', PostRegister)
    // router.get('/logout', PostLogout)
    app.use("/", router);
}

export default userRoutes;