import { prisma } from "config/client";
import { Request, Response } from "express";
import { getActiveShippingProviderCount, getInactiveShippingProvidersCount, getShippingProviderById, getShippingProviderCount, HandleActiveShippingProvider, HandleCreateShippingProvider, HandleDeleteShippingProvider, HandleLockShippingProvider, HandleUpdateShippingProvider } from "services/admin/shippingProvider.services";

const getShippingProvidersPage = async (req: Request, res: Response) => {
    const shippingProviderCount = await getShippingProviderCount();
    const activeShippingProvidersCount = await getActiveShippingProviderCount();
    const inactiveShippingProvidersCount = await getInactiveShippingProvidersCount();

    const page = parseInt(req.query.page as string) || 1;
    const q = (req.query.q as string) || "";
    const status = (req.query.status as string) || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q } },
            { code: { contains: q } },
            { apiKey: { contains: q } },
        ];
    }
    if (status) {
        where.status = status;
    }

    const [shippingProviders, total] = await Promise.all([
        prisma.shippingProvider.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" }
        }),
        prisma.shippingProvider.count({ where })
    ])

    const totalPages = Math.ceil(total / limit);

    res.render("admin/shippingProvider/shippingprovider", {
        shippingProviders: shippingProviders,
        currentPage: page,
        totalPages: totalPages,
        q: q,
        status: status,
        shippingProviderCount: shippingProviderCount,
        activeShippingProvidersCount: activeShippingProvidersCount,
        inactiveShippingProvidersCount: inactiveShippingProvidersCount
    });
}
const getCreateShippingProviderPage = async (req: Request, res: Response) => {
    res.render("admin/shippingProvider/create");
}

const PostCreateShippingProvider = async (req: Request, res: Response) => {
    const { name, code, apiKey, status } = req.body
    const shippingProvider = await HandleCreateShippingProvider(name, code, apiKey, status);
    res.redirect("/admin/shipping-providers");
}
const getShippingProviderDetailPage = async (req: Request, res: Response) => {
    const shippingProviderId = req.params.id as string;
    const shippingProvider = await getShippingProviderById(shippingProviderId);
    res.render("admin/shippingProvider/detail", {
        shippingProvider: shippingProvider
    });
}
const PostUpdateShippingProvider = async (req: Request, res: Response) => {
    const { id, name, code, apiKey, status } = req.body
    const shippingProvider = await HandleUpdateShippingProvider(id, name, code, apiKey, status);
    res.redirect("/admin/shipping-providers");
}
const PostLockShippingProvider = async (req: Request, res: Response) => {
    const shippingProviderId = req.params.id as string;
    const supplier = await HandleLockShippingProvider(shippingProviderId);
    res.redirect("/admin/shipping-providers");
}
const PostActiveShippingProvider = async (req: Request, res: Response) => {
    const shippingProviderId = req.params.id as string;
    const supplier = await HandleActiveShippingProvider(shippingProviderId);
    res.redirect("/admin/shipping-providers");
}
const PostDeleteShippingProvider = async (req: Request, res: Response) => {
    const shippingProviderId = req.params.id as string;
    const supplier = await HandleDeleteShippingProvider(shippingProviderId);
    res.redirect("/admin/shipping-providers");
}

export { getShippingProvidersPage, getCreateShippingProviderPage, PostCreateShippingProvider, getShippingProviderDetailPage, PostUpdateShippingProvider, PostLockShippingProvider, PostActiveShippingProvider, PostDeleteShippingProvider }