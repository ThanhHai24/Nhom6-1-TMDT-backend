import { getHomePage, getProductPage } from 'controllers/client/home.controller';
import express from 'express';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    router.get('/', getHomePage)
    router.get('/product', getProductPage)
    app.use("/", router);
}

export default userRoutes;