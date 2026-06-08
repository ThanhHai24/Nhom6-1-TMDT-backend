import { prisma } from "config/client";

const seedOrder = async () => {
    const count = await prisma.order.count();
    if (count > 0) {
        console.log("[Seed] Orders: already seeded, skipping.");
        return;
    }

    // 1. Orders
    await prisma.order.createMany({
        data: [
            {
                id: BigInt("1"),
                code: "DH001",
                userId: BigInt("1"),
                customerName: "Customer 1",
                customerPhone: "0123456789",
                shippingAddress: "Address 1",
                shippingFee: 0,
                totalAmount: 9190000,
                status: "CANCELLED",
                paymentMethod: "COD",
                paymentStatus: "PENDING",
                notes: null,
                createdAt: new Date("2026-06-06T21:45:48.351Z"),
                updatedAt: new Date("2026-06-07T02:02:54.444Z")
            },
            {
                id: BigInt("2"),
                code: "DH002",
                userId: BigInt("2"),
                customerName: "Customer 2",
                customerPhone: "0987654321",
                shippingAddress: "Address 2",
                shippingFee: 0,
                totalAmount: 9190000,
                status: "PENDING",
                paymentMethod: "COD",
                paymentStatus: "PENDING",
                notes: null,
                createdAt: new Date("2026-06-06T21:45:48.354Z"),
                updatedAt: new Date("2026-06-06T21:45:48.354Z")
            },
            {
                id: BigInt("3"),
                code: "PCS-20260607-C27C8Q",
                userId: BigInt("1"),
                customerName: "Admin",
                customerPhone: "0123332221",
                shippingAddress: "123, Xã Ea Trang, Huyện M Đrắk, Đắk Lắk",
                shippingFee: 225500,
                totalAmount: 56225500,
                status: "DELIVERED",
                paymentMethod: "VNPAY",
                paymentStatus: "PAID",
                notes: "",
                createdAt: new Date("2026-06-07T05:51:34.175Z"),
                updatedAt: new Date("2026-06-07T08:04:07.719Z")
            },
            {
                id: BigInt("4"),
                code: "PCS-20260607-MD8EVQ",
                userId: BigInt("1"),
                customerName: "Admin",
                customerPhone: "0123332221",
                shippingAddress: "123, Xã Krông Jing, Huyện M Đrắk, Đắk Lắk",
                shippingFee: 225500,
                totalAmount: 112225500,
                status: "PENDING",
                paymentMethod: "COD",
                paymentStatus: "PENDING",
                notes: "",
                createdAt: new Date("2026-06-07T15:50:45.272Z"),
                updatedAt: new Date("2026-06-07T15:50:45.272Z")
            },
            {
                id: BigInt("5"),
                code: "PCS-20260607-OHF2G3",
                userId: BigInt("1"),
                customerName: "Admin",
                customerPhone: "0123332221",
                shippingAddress: "123, Xã Trúc Sơn, Huyện Cư Jút, Đắk Nông",
                shippingFee: 225500,
                totalAmount: 28225500,
                status: "SHIPPED",
                paymentMethod: "COD",
                paymentStatus: "PENDING",
                notes: "",
                createdAt: new Date("2026-06-07T15:52:28.078Z"),
                updatedAt: new Date("2026-06-07T15:53:21.832Z")
            },
            {
                id: BigInt("6"),
                code: "PCS-20260608-VPN9AN",
                userId: BigInt("1"),
                customerName: "Admin",
                customerPhone: "0123332221",
                shippingAddress: "12312, Xã Ea Trang, Huyện M Đrắk, Đắk Lắk",
                shippingFee: 225500,
                totalAmount: 85085500,
                status: "PENDING",
                paymentMethod: "VNPAY",
                paymentStatus: "PAID",
                notes: "",
                createdAt: new Date("2026-06-08T04:00:12.250Z"),
                updatedAt: new Date("2026-06-08T04:01:13.823Z")
            }
        ],
    });

    // 2. Order Items
    await prisma.orderItem.createMany({
        data: [
            {
                id: BigInt("1"),
                orderId: BigInt("1"),
                productId: BigInt("3"),
                quantity: 1,
                price: 6100000,
                specifications: null,
                createdAt: new Date("2026-06-06T21:45:48.351Z"),
                updatedAt: new Date("2026-06-06T21:45:48.351Z")
            },
            {
                id: BigInt("2"),
                orderId: BigInt("1"),
                productId: BigInt("4"),
                quantity: 1,
                price: 3090000,
                specifications: null,
                createdAt: new Date("2026-06-06T21:45:48.351Z"),
                updatedAt: new Date("2026-06-06T21:45:48.351Z")
            },
            {
                id: BigInt("3"),
                orderId: BigInt("2"),
                productId: BigInt("3"),
                quantity: 1,
                price: 6100000,
                specifications: null,
                createdAt: new Date("2026-06-06T21:45:48.354Z"),
                updatedAt: new Date("2026-06-06T21:45:48.354Z")
            },
            {
                id: BigInt("4"),
                orderId: BigInt("2"),
                productId: BigInt("4"),
                quantity: 1,
                price: 3090000,
                specifications: null,
                createdAt: new Date("2026-06-06T21:45:48.354Z"),
                updatedAt: new Date("2026-06-06T21:45:48.354Z")
            },
            {
                id: BigInt("5"),
                orderId: BigInt("3"),
                productId: BigInt("11"),
                quantity: 2,
                price: 28000000,
                specifications: null,
                createdAt: new Date("2026-06-07T05:51:34.175Z"),
                updatedAt: new Date("2026-06-07T05:51:34.175Z")
            },
            {
                id: BigInt("6"),
                orderId: BigInt("4"),
                productId: BigInt("11"),
                quantity: 4,
                price: 28000000,
                specifications: null,
                createdAt: new Date("2026-06-07T15:50:45.272Z"),
                updatedAt: new Date("2026-06-07T15:50:45.272Z")
            },
            {
                id: BigInt("7"),
                orderId: BigInt("5"),
                productId: BigInt("11"),
                quantity: 1,
                price: 28000000,
                specifications: null,
                createdAt: new Date("2026-06-07T15:52:28.078Z"),
                updatedAt: new Date("2026-06-07T15:52:28.078Z")
            },
            {
                id: BigInt("8"),
                orderId: BigInt("6"),
                productId: BigInt("15"),
                quantity: 1,
                price: 40900000,
                specifications: null,
                createdAt: new Date("2026-06-08T04:00:12.250Z"),
                updatedAt: new Date("2026-06-08T04:00:12.250Z")
            },
            {
                id: BigInt("9"),
                orderId: BigInt("6"),
                productId: BigInt("5"),
                quantity: 4,
                price: 10990000,
                specifications: null,
                createdAt: new Date("2026-06-08T04:00:12.250Z"),
                updatedAt: new Date("2026-06-08T04:00:12.250Z")
            }
        ],
    });

    // 3. Order Status Histories
    await prisma.orderStatusHistory.createMany({
        data: [
            {
                id: BigInt("1"),
                orderId: BigInt("1"),
                status: "CANCELLED",
                notes: "Khách hàng hủy đơn hàng",
                changedById: null,
                createdAt: new Date("2026-06-07T02:02:54.444Z")
            },
            {
                id: BigInt("2"),
                orderId: BigInt("3"),
                status: "PENDING",
                notes: "Đơn hàng được tạo",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T05:51:34.175Z")
            },
            {
                id: BigInt("3"),
                orderId: BigInt("3"),
                status: "CONFIRMED",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T08:04:02.107Z")
            },
            {
                id: BigInt("4"),
                orderId: BigInt("3"),
                status: "PROCESSING",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T08:04:05.314Z")
            },
            {
                id: BigInt("5"),
                orderId: BigInt("3"),
                status: "SHIPPED",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T08:04:06.492Z")
            },
            {
                id: BigInt("6"),
                orderId: BigInt("3"),
                status: "DELIVERED",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T08:04:07.719Z")
            },
            {
                id: BigInt("7"),
                orderId: BigInt("4"),
                status: "PENDING",
                notes: "Đơn hàng được tạo",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T15:50:45.272Z")
            },
            {
                id: BigInt("8"),
                orderId: BigInt("5"),
                status: "PENDING",
                notes: "Đơn hàng được tạo",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-07T15:52:28.078Z")
            },
            {
                id: BigInt("9"),
                orderId: BigInt("5"),
                status: "CONFIRMED",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("4"),
                createdAt: new Date("2026-06-07T15:52:50.001Z")
            },
            {
                id: BigInt("10"),
                orderId: BigInt("5"),
                status: "PROCESSING",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("5"),
                createdAt: new Date("2026-06-07T15:53:20.468Z")
            },
            {
                id: BigInt("11"),
                orderId: BigInt("5"),
                status: "SHIPPED",
                notes: "Trạng thái được cập nhật",
                changedById: BigInt("5"),
                createdAt: new Date("2026-06-07T15:53:21.832Z")
            },
            {
                id: BigInt("12"),
                orderId: BigInt("6"),
                status: "PENDING",
                notes: "Đơn hàng được tạo",
                changedById: BigInt("1"),
                createdAt: new Date("2026-06-08T04:00:12.250Z")
            }
        ],
    });

    // 4. Shipping Orders
    await prisma.shippingOrder.createMany({
        data: [
            {
                id: BigInt("1"),
                orderId: BigInt("3"),
                providerId: BigInt("1"),
                trackingNumber: "MOCK-1780819446488",
                shippingCost: 225500,
                estimatedDeliveryDate: new Date("2026-06-10T08:04:06.488Z"),
                actualDeliveryDate: null,
                status: "IN_TRANSIT",
                createdAt: new Date("2026-06-07T08:04:06.489Z"),
                updatedAt: new Date("2026-06-07T08:04:06.489Z")
            },
            {
                id: BigInt("2"),
                orderId: BigInt("5"),
                providerId: BigInt("1"),
                trackingNumber: "MOCK-1780847601827",
                shippingCost: 225500,
                estimatedDeliveryDate: new Date("2026-06-10T15:53:21.827Z"),
                actualDeliveryDate: null,
                status: "IN_TRANSIT",
                createdAt: new Date("2026-06-07T15:53:21.829Z"),
                updatedAt: new Date("2026-06-07T15:53:21.829Z")
            }
        ],
    });

    // 5. Payments
    await prisma.payment.createMany({
        data: [
            {
                id: BigInt("1"),
                orderId: BigInt("3"),
                paymentMethodId: null,
                amount: "56225500",
                status: "SUCCESS",
                transactionCode: "15572644",
                createdAt: new Date("2026-06-07T05:52:00.633Z")
            },
            {
                id: BigInt("2"),
                orderId: BigInt("6"),
                paymentMethodId: null,
                amount: "85085500",
                status: "SUCCESS",
                transactionCode: "15573772",
                createdAt: new Date("2026-06-08T04:01:13.827Z")
            }
        ],
    });

    console.log("[Seed] Orders, Items, Statuses, Shipping, Payments: seeded successfully.");
};

export default seedOrder;
