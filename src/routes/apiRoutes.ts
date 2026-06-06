import express from "express";
import * as productApiController from "../controllers/api/product.api.controller";
import * as authApiController from "../controllers/api/auth.api.controller";
import * as orderApiController from "../controllers/api/order.api.controller";
import * as ghnApiController from "../controllers/api/ghn.api.controller";
import * as vnpayController from "../controllers/api/vnpay.api.controller";
import * as categoryApiController from "../controllers/api/category.api.controller";

const router = express.Router();

const apiRoutes = (app: express.Express) => {
    // === Product APIs ===
    router.get('/products', productApiController.getProducts);
    router.get('/products/by-category', productApiController.getProductsByCategory);
    router.post('/products', productApiController.createProduct);
    router.put('/products/:id', productApiController.updateProduct);
    router.delete('/products/:id', productApiController.deleteProduct);

    // === Category APIs ===
    router.get('/categories', categoryApiController.getCategories);
    router.get('/categories/:id', categoryApiController.getCategoryById);
    router.post('/categories', categoryApiController.createCategory);
    router.put('/categories/:id', categoryApiController.updateCategory);
    router.delete('/categories/:id', categoryApiController.deleteCategory);

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

    // === VNPay Payment APIs ===
    router.post('/payment/vnpay/create', vnpayController.CreatePaymentUrl);   // Tạo URL thanh toán
    router.get('/check-payment-vnpay', vnpayController.CheckPaymentVnPay);    // Return URL (redirect)
    router.get('/vnpay-ipn', vnpayController.VnpayIpn);                       // IPN server-to-server

    app.use("/api", router);


};

export default apiRoutes;
