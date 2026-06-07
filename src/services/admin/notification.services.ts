import { prisma } from "config/client";

export interface NotificationItem {
    id: string;
    type: 'ORDER' | 'STOCK' | 'PAYMENT' | 'USER' | 'PROMOTION';
    icon: string;
    title: string;
    desc: string;
    time: Date;
    unread: boolean;
}

const getSystemNotifications = async (): Promise<NotificationItem[]> => {
    const notifications: NotificationItem[] = [];
    const now = new Date();

    try {
        // 1. Pending orders
        const pendingOrders = await prisma.order.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
        });

        if (pendingOrders.length > 0) {
            notifications.push({
                id: `pending_orders_${pendingOrders.length}`,
                type: 'ORDER',
                icon: '🛒',
                title: `${pendingOrders.length} đơn hàng mới cần phê duyệt`,
                desc: `Có ${pendingOrders.length} đơn hàng đang chờ xác nhận từ hệ thống`,
                time: pendingOrders[0].createdAt,
                unread: true,
            });
        }

        // 2. Low stock products (stock <= 10)
        const lowStockProducts = await prisma.product.findMany({
            where: { status: 'ACTIVE', stock: { lte: 10 } },
            orderBy: { stock: 'asc' },
            take: 5,
        });

        lowStockProducts.forEach(product => {
            notifications.push({
                id: `low_stock_${product.id}`,
                type: 'STOCK',
                icon: '⚠️',
                title: `Cảnh báo tồn kho thấp`,
                desc: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm — Cần nhập thêm hàng`,
                time: product.updatedAt,
                unread: true,
            });
        });

        // 3. Recent paid orders (paymentStatus = PAID)
        const paidOrders = await prisma.order.findMany({
            where: { paymentStatus: 'PAID' },
            orderBy: { updatedAt: 'desc' },
            take: 5,
        });

        paidOrders.forEach(order => {
            notifications.push({
                id: `paid_order_${order.id}`,
                type: 'PAYMENT',
                icon: '💰',
                title: `Thanh toán thành công`,
                desc: `Đơn #${order.code} — ${order.totalAmount.toLocaleString('vi-VN')} ₫ đã được thanh toán thành công`,
                time: order.updatedAt,
                unread: true,
            });
        });

        // 4. New user registrations (past 7 days)
        const past7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = await prisma.user.findMany({
            where: {
                role: 'CUSTOMER',
                createdAt: { gte: past7Days }
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        recentUsers.forEach(user => {
            notifications.push({
                id: `new_user_${user.id}`,
                type: 'USER',
                icon: '👤',
                title: `Người dùng mới đăng ký`,
                desc: `Khách hàng "${user.fullName || user.username}" vừa tạo tài khoản mới`,
                time: user.createdAt,
                unread: false,
            });
        });

        // 5. Expiring promotions (ending in the next 3 days)
        const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const expiringPromotions = await prisma.promotion.findMany({
            where: {
                endDate: {
                    gte: now,
                    lte: threeDaysLater
                }
            },
            take: 5,
        });

        expiringPromotions.forEach(promo => {
            notifications.push({
                id: `expiring_promo_${promo.id}`,
                type: 'PROMOTION',
                icon: '🎁',
                title: `Khuyến mãi sắp hết hạn`,
                desc: `Chương trình "${promo.name}" sẽ kết thúc vào ngày ${new Date(promo.endDate!).toLocaleDateString('vi-VN')}`,
                time: promo.endDate!,
                unread: false,
            });
        });

        // Sort notifications by time descending
        notifications.sort((a, b) => b.time.getTime() - a.time.getTime());

    } catch (error) {
        console.error("Error gathering system notifications:", error);
    }

    return notifications;
};

export { getSystemNotifications };
