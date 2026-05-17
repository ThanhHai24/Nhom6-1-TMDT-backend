import express from "express";
import * as productApiController from "../controllers/api/product.api.controller";
import * as authApiController from "../controllers/api/auth.api.controller";
import * as orderApiController from "../controllers/api/order.api.controller";
import * as ghnApiController from "../controllers/api/ghn.api.controller";

const router = express.Router();

const apiRoutes = (app: express.Express) => {
    // === Product APIs ===
    router.get('/products', productApiController.getProducts);
    router.post('/products', productApiController.createProduct);
    router.put('/products/:id', productApiController.updateProduct);
    router.delete('/products/:id', productApiController.deleteProduct);

    // === Auth APIs ===
    router.post('/auth/login', authApiController.login);
    router.post('/auth/register', authApiController.register);

    // === Order APIs ===
    router.get('/orders', orderApiController.getOrders);
    router.post('/orders', orderApiController.createOrder);

    // === Location APIs ===
    router.get('/locations/provinces', ghnApiController.getProvinces);
    router.get('/locations/districts', ghnApiController.getDistricts);
    router.post('/locations/districts', ghnApiController.getDistricts);
    router.get('/locations/wards', ghnApiController.getWards);
    router.post('/locations/wards', ghnApiController.getWards);

    // === Shipping APIs ===
    router.post('/shipping/fee', ghnApiController.getShippingFee);
    router.post('/shipping/order/create', ghnApiController.createShippingOrder);
    app.use("/api", router);
};

export default apiRoutes;
