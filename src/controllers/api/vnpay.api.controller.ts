import { Request, Response } from "express";
import { prisma } from "config/client";
import { HashAlgorithm } from "vnpay";

const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require("vnpay");

const CreateQr = async (req: Request, res: Response) => {
    const vnpay = new VNPay({
        tmnCode: "YY6YND1V",
        secureSecret: "QIG2ALGNX60Y6AGLHUEKPZZVV1L3D45J",
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        HashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger
    })

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: 100000,
        vnp_IpAddr: '127.0.0.1',
        vnp_ReturnUrl: 'http://localhost:8080/api/check-payment-vnpay',
        vnp_TxnRef: '01050902004',
        vnp_OrderInfo: 'Thanh toán đơn hàng #123',
    })

    return res.status(201).json({
        message: "Tạo mã QR thành công",
        data: vnpayResponse,
    })
}

const CheckPaymentVnPay = async (req: Request, res: Response) => {
    console.log(req.query);
}

export { CreateQr, CheckPaymentVnPay }