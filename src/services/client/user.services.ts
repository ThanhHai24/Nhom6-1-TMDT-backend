import { prisma } from "config/client";

const updateProfile = async (id: string, fullName: string, email: string, phone: string, dob: string, gender: string, idCard: string, avatar: string) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            fullName: fullName,
            email: email,
            phone: phone,
            dob: new Date(dob),
            gender: gender,
            idCard: idCard,
            ...(avatar !== null && { avatar: avatar })
        }
    })
}

const getUserOrders = async (userId: string | number, page: number = 1, limit: number = 5, status?: string) => {
    const where: any = { userId: BigInt(userId) };
    if (status && status !== 'ALL') where.status = status;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        }),
        prisma.order.count({ where })
    ]);

    return { orders, total };
};

const getOrderByCode = async (code: string, userId: number) => {
    return await prisma.order.findFirst({
        where: { code, userId: BigInt(userId) },
        include: {
            orderItems: {
                include: { product: true }
            },
            statusHistory: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });
};

const cancelOrderByCode = async (code: string, userId: number) => {
    // Verify ownership and that order is still PENDING
    const order = await prisma.order.findFirst({
        where: { code, userId: BigInt(userId), status: 'PENDING' }
    });
    if (!order) return null;

    return await prisma.order.update({
        where: { id: order.id },
        data: {
            status: 'CANCELLED',
            statusHistory: {
                create: {
                    status: 'CANCELLED',
                    notes: 'Khách hàng hủy đơn hàng'
                }
            }
        }
    });
};

export { updateProfile, getUserOrders, getOrderByCode, cancelOrderByCode }