import { prisma } from "config/client";

const seedOrder = async () => {
    const count = await prisma.order.count();
    if (count > 0) {
        console.log("[Seed] Orders: already seeded, skipping.");
        return;
    }

    const ordersData = [
        {
            userId: 1,
            code: "DH001",
            customerName: "Customer 1",
            customerPhone: "0123456789",
            shippingAddress: "Address 1",
            totalAmount: 300,
        },
        {
            userId: 2,
            code: "DH002",
            customerName: "Customer 2",
            customerPhone: "0987654321",
            shippingAddress: "Address 2",
            totalAmount: 300,
        },
    ];

    for (const data of ordersData) {
        await prisma.order.create({
            data: {
                userId: data.userId,
                code: data.code,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                shippingAddress: data.shippingAddress,
                totalAmount: data.totalAmount,
                status: "PENDING",
                orderItems: {
                    create: [
                        {
                            productId: 1,
                            quantity: 1,
                            price: 100, // Price of product 1
                        },
                        {
                            productId: 2,
                            quantity: 1,
                            price: 200, // Price of product 2
                        },
                    ],
                },
            },
        });
    }

    console.log("[Seed] Orders: seeded successfully.");
};

export default seedOrder;