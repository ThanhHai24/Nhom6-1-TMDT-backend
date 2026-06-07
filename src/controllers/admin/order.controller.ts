import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllOrders, getCancelledOrdersCount, getConfirmedOrdersCount, getDeliveredOrdersCount, getOrderById, getOrderCount, getPendingOrdersCount, getProcessingOrdersCount, getReturnedOrdersCount, getShippedOrdersCount, updateOrderStatus } from "services/admin/order.service";

const getOrders = async (req: Request, res: Response) => {
    const ordercount = await getOrderCount();
    const pendingOrdersCount = await getPendingOrdersCount();
    const confirmedOrdersCount = await getConfirmedOrdersCount();
    const processingOrdersCount = await getProcessingOrdersCount();
    const shippedOrdersCount = await getShippedOrdersCount();
    const deliveredOrdersCount = await getDeliveredOrdersCount();
    const cancelledOrdersCount = await getCancelledOrdersCount();
    const returnedOrdersCount = await getReturnedOrdersCount();

    const page = parseInt(req.query.page as string) || 1;
    const q = (req.query.q as string) || "";
    const role = (req.query.role as string) || "";
    const status = (req.query.status as string) || "";

    const limit = 5;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (q) {
        where.OR = [
            { customerName: { contains: q } },
            { customerPhone: { contains: q } },
            { shippingAddress: { contains: q } },
            { code: { contains: q } }
        ];
    }

    if (status) {
        where.status = status;
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                shippingOrders: {
                    include: {
                        provider: true
                    }
                }
            }
        }),
        prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(total / limit);

    res.render("admin/orders/order", {
        orders: orders,
        currentPage: page,
        totalPages: totalPages,
        q: q,
        status: status,
        ordercount: ordercount,
        pendingOrdersCount: pendingOrdersCount,
        confirmedOrdersCount: confirmedOrdersCount,
        processingOrdersCount: processingOrdersCount,
        shippedOrdersCount: shippedOrdersCount,
        deliveredOrdersCount: deliveredOrdersCount,
        cancelledOrdersCount: cancelledOrdersCount,
        returnedOrdersCount: returnedOrdersCount,
        layout: "admin/layout/main",
        title: "Quản lý đơn hàng"
    });
}

const getOrderDetailPage = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const order = await getOrderById(orderId);
    res.render("admin/orders/detail", {
        order,
        layout: "admin/layout/main",
        title: "Chi tiết đơn hàng"
    });
}

const PostUpdateOrderStatus = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const status = req.body.status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
    const user = req.user as any;
    
    const session = req.session as any;

    if (!user) {
        if (session) {
            session.error_msg = "Bạn chưa đăng nhập.";
        }
        return res.redirect("/admin/orders");
    }

    const order = await getOrderById(orderId);
    if (!order) {
        if (session) {
            session.error_msg = "Không tìm thấy đơn hàng.";
        }
        return res.redirect("/admin/orders");
    }

    const currentStatus = order.status;
    const role = user.role;
    let isAllowed = false;

    if (role === 'ADMIN' || role === 'MANAGER') {
        isAllowed = true;
    } else if (role === 'RECEPTIONIST') {
        // Receptionist only confirms (PENDING -> CONFIRMED)
        if (status === 'CONFIRMED' && currentStatus === 'PENDING') {
            isAllowed = true;
        }
    } else if (role === 'WAREHOUSE') {
        // Warehouse staff only packs (CONFIRMED -> PROCESSING) and ships (PROCESSING -> SHIPPED)
        if (status === 'PROCESSING' && currentStatus === 'CONFIRMED') {
            isAllowed = true;
        } else if (status === 'SHIPPED' && currentStatus === 'PROCESSING') {
            isAllowed = true;
        }
    }

    if (!isAllowed) {
        if (session) {
            session.error_msg = "Bạn không có quyền thực hiện thao tác này.";
        }
        return res.redirect(`/admin/order/${orderId}`);
    }

    const userId = user.id ? BigInt(user.id) : undefined;
    await updateOrderStatus(orderId, status, userId);
    res.redirect(`/admin/order/${orderId}`);
}

export { getOrders, getOrderDetailPage, PostUpdateOrderStatus }