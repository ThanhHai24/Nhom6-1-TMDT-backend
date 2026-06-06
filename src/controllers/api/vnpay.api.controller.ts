import { Request, Response } from "express";
import { prisma } from "config/client";

const { VNPay, ignoreLogger, ProductCode, VnpLocale } = require("vnpay");

// ─── Khởi tạo VNPay instance ──────────────────────────────────────────────────
const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE || "YY6YND1V",
    secureSecret: process.env.VNPAY_SECURE_SECRET || "QIG2ALGNX60Y6AGLHUEKPZZVV1L3D45J",
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    HashAlgorithm: "SHA512",
    loggerFn: ignoreLogger,
});

const RETURN_URL =
    process.env.VNPAY_RETURN_URL || "http://localhost:8080/api/check-payment-vnpay";

// ─── Bảng mã lỗi VNPay (vnp_ResponseCode) ────────────────────────────────────
const VNPAY_RESPONSE_CODES: Record<string, string> = {
    "00": "Giao dịch thành công",
    "02": "Mã định danh kết nối không hợp lệ (TmnCode sai)",
    "03": "Dữ liệu gửi sang không đúng định dạng",
    "04": "Khởi tạo GD không thành công do Website đang bị tạm khóa",
    "05": "Giao dịch không thành công do nhập sai mật khẩu quá số lần quy định",
    "06": "Giao dịch không thành công do nhập sai mật khẩu xác thực giao dịch (OTP)",
    "07": "Giao dịch bị nghi ngờ gian lận hoặc bất thường",
    "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking",
    "10": "Xác thực không thành công do nhập sai thẻ/tài khoản quá 3 lần",
    "11": "Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch",
    "12": "Thẻ/Tài khoản bị khóa",
    "13": "Nhập sai mật khẩu xác thực giao dịch (OTP)",
    "24": "Khách hàng hủy giao dịch",
    "51": "Tài khoản không đủ số dư để thực hiện giao dịch",
    "65": "Tài khoản vượt hạn mức giao dịch trong ngày",
    "75": "Ngân hàng thanh toán đang bảo trì",
    "79": "Nhập sai mật khẩu thanh toán quá số lần quy định",
    "91": "Không tìm thấy giao dịch yêu cầu",
    "94": "Yêu cầu trùng lặp trong thời gian giới hạn của API",
    "97": "Checksum không hợp lệ",
    "99": "Lỗi không xác định",
};

function getResponseMessage(code: string): string {
    return VNPAY_RESPONSE_CODES[code] ?? `Lỗi không xác định (mã: ${code})`;
}

// Các mã cho phép khách thử thanh toán lại (đơn vẫn PENDING)
const RETRYABLE_CODES = new Set(["24", "11"]);

// ─── Tạo URL thanh toán VNPay ─────────────────────────────────────────────────
/**
 * POST /api/create-payment-vnpay
 * Body: { orderId: string | number }
 */
const CreatePaymentUrl = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            res.status(400).json({ error: "Thiếu orderId" });
            return;
        }

        const order = await prisma.order.findUnique({
            where: { id: BigInt(orderId) },
        });

        if (!order) {
            res.status(404).json({ error: "Không tìm thấy đơn hàng" });
            return;
        }

        if (order.paymentStatus === "PAID") {
            res.status(400).json({ error: "Đơn hàng đã được thanh toán" });
            return;
        }

        const ipAddr =
            (req.headers["x-forwarded-for"] as string) ||
            req.socket.remoteAddress ||
            "127.0.0.1";

        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: order.totalAmount,
            vnp_IpAddr: ipAddr,
            vnp_ReturnUrl: RETURN_URL,
            vnp_TxnRef: order.code,
            vnp_OrderInfo: `Thanh toan don hang ${order.code}`,
            vnp_OrderType: ProductCode.Other,
            vnp_Locale: VnpLocale.VN,
        });

        return res.status(200).json({
            message: "Tạo URL thanh toán thành công",
            paymentUrl,
        });
    } catch (error) {
        console.error("[VNPay] CreatePaymentUrl error:", error);
        return res.status(500).json({ error: "Lỗi khi tạo URL thanh toán", details: error });
    }
};

// ─── Callback sau khi VNPay redirect về ──────────────────────────────────────
/**
 * GET /api/check-payment-vnpay
 *
 * Bảng xử lý theo vnp_ResponseCode:
 *   "00"        → PAID    (thành công)
 *   "24", "11"  → PENDING (khách hủy / timeout → cho phép thử lại)
 *   còn lại     → FAILED  (lỗi thực sự)
 */
const CheckPaymentVnPay = async (req: Request, res: Response) => {
    try {
        const query = req.query as Record<string, string>;

        // Xác minh chữ ký
        const verify = vnpay.verifyReturnUrl(query);

        const txnRef        = query.vnp_TxnRef;
        const transactionNo = query.vnp_TransactionNo;
        const responseCode  = query.vnp_ResponseCode ?? "99";
        const amount        = parseInt(query.vnp_Amount || "0") / 100;
        const errorMessage  = getResponseMessage(responseCode);

        // Chữ ký không hợp lệ
        if (!verify.isVerified) {
            console.warn("[VNPay] Checksum không hợp lệ:", txnRef);
            return res.render("StorePage/payment/failed", {
                orderCode:    txnRef,
                errorCode:    "97",
                errorMessage: getResponseMessage("97"),
                canRetry:     false,
            });
        }

        const order = await prisma.order.findUnique({ where: { code: txnRef } });
        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
        }

        // Tránh ghi đè nếu đã PAID
        if (order.paymentStatus === "PAID") {
            return res.render("StorePage/payment/success", {
                orderCode: order.code,
                txnRef:    transactionNo,
                note:      "Đơn hàng đã được ghi nhận trước đó.",
            });
        }

        // ── Ánh xạ responseCode → paymentStatus ─────────────────────────────
        let newPaymentStatus: "PAID" | "FAILED" | "PENDING";
        let paymentRecordStatus: "SUCCESS" | "FAILED" | "PENDING";

        if (responseCode === "00") {
            newPaymentStatus    = "PAID";
            paymentRecordStatus = "SUCCESS";
        } else if (RETRYABLE_CODES.has(responseCode)) {
            // Hủy hoặc timeout → giữ PENDING để khách thanh toán lại
            newPaymentStatus    = "PENDING";
            paymentRecordStatus = "FAILED";
        } else {
            newPaymentStatus    = "FAILED";
            paymentRecordStatus = "FAILED";
        }

        // Cập nhật đơn hàng
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: newPaymentStatus,
                paymentMethod: "VNPAY",
            },
        });

        // Ghi log giao dịch
        await prisma.payment.create({
            data: {
                orderId:         order.id,
                amount:          amount,
                status:          paymentRecordStatus,
                transactionCode: transactionNo || `ERR-${responseCode}-${Date.now()}`,
            },
        });

        console.log(
            `[VNPay] Order ${order.code} | Code: ${responseCode} | Status: ${newPaymentStatus} | ${errorMessage}`
        );

        if (responseCode === "00") {
            return res.render("StorePage/payment/success", {
                orderCode: order.code,
                txnRef:    transactionNo,
            });
        } else {
            return res.render("StorePage/payment/failed", {
                orderCode:    order.code,
                errorCode:    responseCode,
                errorMessage: errorMessage,
                canRetry:     RETRYABLE_CODES.has(responseCode),
            });
        }
    } catch (error) {
        console.error("[VNPay] CheckPaymentVnPay error:", error);
        return res.status(500).json({ error: "Lỗi xử lý callback VNPay", details: error });
    }
};

// ─── IPN (Instant Payment Notification) từ VNPay server ──────────────────────
/**
 * GET /api/vnpay-ipn
 * VNPay server gọi server-to-server để xác nhận giao dịch
 */
const VnpayIpn = async (req: Request, res: Response) => {
    try {
        const query = req.query as Record<string, string>;
        const verify = vnpay.verifyIpnCall(query);

        const txnRef        = query.vnp_TxnRef;
        const responseCode  = query.vnp_ResponseCode ?? "99";
        const transactionNo = query.vnp_TransactionNo;
        const amount        = parseInt(query.vnp_Amount || "0") / 100;

        if (!verify.isVerified) {
            return res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
        }

        const order = await prisma.order.findUnique({ where: { code: txnRef } });
        if (!order) {
            return res.status(200).json({ RspCode: "01", Message: "Order not found" });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(200).json({ RspCode: "02", Message: "Order already confirmed" });
        }

        // ── Ánh xạ responseCode → paymentStatus ─────────────────────────────
        let newPaymentStatus: "PAID" | "FAILED" | "PENDING";
        let paymentRecordStatus: "SUCCESS" | "FAILED" | "PENDING";

        if (responseCode === "00") {
            newPaymentStatus    = "PAID";
            paymentRecordStatus = "SUCCESS";
        } else if (RETRYABLE_CODES.has(responseCode)) {
            newPaymentStatus    = "PENDING";
            paymentRecordStatus = "FAILED";
        } else {
            newPaymentStatus    = "FAILED";
            paymentRecordStatus = "FAILED";
        }

        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: newPaymentStatus,
                paymentMethod: "VNPAY",
            },
        });

        await prisma.payment.create({
            data: {
                orderId:         order.id,
                amount:          amount,
                status:          paymentRecordStatus,
                transactionCode: transactionNo || `ERR-${responseCode}-${Date.now()}`,
            },
        });

        console.log(
            `[VNPay IPN] Order ${order.code} | Code: ${responseCode} | ${getResponseMessage(responseCode)}`
        );

        return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    } catch (error) {
        console.error("[VNPay] IPN error:", error);
        return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
    }
};

export { CreatePaymentUrl, CheckPaymentVnPay, VnpayIpn };