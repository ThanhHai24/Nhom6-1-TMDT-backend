import { prisma } from "config/client";
import { Request, Response } from "express";
import { getActiveSupplierCount, getInactiveSuppliersCount, getSupplierById, getSupplierCount, HandleActiveSupplier, HandleCreateSupplier, HandleDeleteSupplier, HandleLockSupplier, HandleUpdateSupplier } from "services/admin/supplier.services";

const getSuppliersPage = async (req: Request, res: Response) => {
    const supplierCount = await getSupplierCount();
    const activeSuppliersCount = await getActiveSupplierCount();
    const inactiveSuppliersCount = await getInactiveSuppliersCount();

    const page = parseInt(req.query.page as string) || 1;
    const q = (req.query.q as string) || "";
    const status = (req.query.status as string) || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q } },
            { slug: { contains: q } },
            { description: { contains: q } },
        ];
    }
    if (status) {
        where.status = status;
    }

    const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" }
        }),
        prisma.supplier.count({ where })
    ])

    const totalPages = Math.ceil(total / limit);

    res.render("admin/supplier/supplier", {
        suppliers: suppliers,
        currentPage: page,
        totalPages: totalPages,
        q: q,
        status: status,
        supplierCount: supplierCount,
        activeSuppliersCount: activeSuppliersCount,
        inactiveSuppliersCount: inactiveSuppliersCount
    });
}
const getCreateSupplierPage = async (req: Request, res: Response) => {
    res.render("admin/supplier/create");
}

const PostCreateSupplier = async (req: Request, res: Response) => {
    const { name, description, status } = req.body
    const supplier = await HandleCreateSupplier(name, description, status);
    res.redirect("/admin/suppliers");
}
const getSupplierDetailPage = async (req: Request, res: Response) => {
    const supplierId = req.params.id as string;
    const supplier = await getSupplierById(supplierId);
    res.render("admin/supplier/detail", {
        supplier: supplier
    });
}
const PostUpdateSupplier = async (req: Request, res: Response) => {
    const { id, name, description, status } = req.body
    const supplier = await HandleUpdateSupplier(id, name, description, status);
    res.redirect("/admin/suppliers");
}
const PostLockSupplier = async (req: Request, res: Response) => {
    const supplierId = req.params.id as string;
    const supplier = await HandleLockSupplier(supplierId);
    res.redirect("/admin/suppliers");
}
const PostActiveSupplier = async (req: Request, res: Response) => {
    const supplierId = req.params.id as string;
    const supplier = await HandleActiveSupplier(supplierId);
    res.redirect("/admin/suppliers");
}
const PostDeleteSupplier = async (req: Request, res: Response) => {
    const supplierId = req.params.id as string;
    const supplier = await HandleDeleteSupplier(supplierId);
    res.redirect("/admin/suppliers");
}

export { getSuppliersPage, getCreateSupplierPage, PostCreateSupplier, getSupplierDetailPage, PostUpdateSupplier, PostLockSupplier, PostActiveSupplier, PostDeleteSupplier }