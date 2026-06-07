import { Request, Response } from "express";
import {
    getWarehouseStats,
    getInventoryList,
    adjustStock,
    setStock,
    getCategoriesForFilter,
    getBrandsForFilter,
    getCriticalStockProducts,
} from "services/admin/warehouse.services";

// Helper: chuyển BigInt → string trong object trước khi JSON
function serializeBigInt<T>(obj: T): T {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );
}

// ── Page render ──
export const getWarehousePage = async (req: Request, res: Response) => {
    try {
        const [stats, categories, brands, criticalProducts] = await Promise.all([
            getWarehouseStats(),
            getCategoriesForFilter(),
            getBrandsForFilter(),
            getCriticalStockProducts(8),
        ]);

        res.render("admin/warehouse/warehouse", {
            layout: "admin/layout/main",
            title: "Quản lý kho",
            stats,
            categories: serializeBigInt(categories),
            brands: serializeBigInt(brands),
            criticalProducts: serializeBigInt(criticalProducts),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

// ── API: Lấy danh sách tồn kho (AJAX/JSON) ──
export const getInventoryAPI = async (req: Request, res: Response) => {
    try {
        const {
            page = '1', limit = '20', search = '', filter = 'all',
            categoryId, brandId, sort = 'stock_asc',
        } = req.query as Record<string, string>;

        const data = await getInventoryList({
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            filter: filter as any,
            categoryId,
            brandId,
            sort: sort as any,
        });

        // Serialize BigInt trước khi trả JSON
        const safe = serializeBigInt(data);
        return res.json({ success: true, ...safe });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Lỗi server' });
    }
};

// ── API: Nhập kho (tăng stock) ──
export const importStockAPI = async (req: Request, res: Response) => {
    try {
        const { productId, quantity, note } = req.body;
        if (!productId || !quantity || parseInt(quantity) <= 0) {
            return res.status(400).json({ success: false, error: 'Dữ liệu không hợp lệ' });
        }
        const result = await adjustStock(BigInt(productId), parseInt(quantity), note);
        return res.json({
            success: true,
            message: `Đã nhập ${quantity} sản phẩm vào kho`,
            product: serializeBigInt(result),
        });
    } catch (err: any) {
        return res.status(400).json({ success: false, error: err.message });
    }
};

// ── API: Xuất kho (giảm stock) ──
export const exportStockAPI = async (req: Request, res: Response) => {
    try {
        const { productId, quantity, note } = req.body;
        if (!productId || !quantity || parseInt(quantity) <= 0) {
            return res.status(400).json({ success: false, error: 'Dữ liệu không hợp lệ' });
        }
        const result = await adjustStock(BigInt(productId), -parseInt(quantity), note);
        return res.json({
            success: true,
            message: `Đã xuất ${quantity} sản phẩm khỏi kho`,
            product: serializeBigInt(result),
        });
    } catch (err: any) {
        return res.status(400).json({ success: false, error: err.message });
    }
};

// ── API: Cập nhật stock trực tiếp ──
export const setStockAPI = async (req: Request, res: Response) => {
    try {
        const { productId, stock } = req.body;
        if (!productId || stock === undefined || parseInt(stock) < 0) {
            return res.status(400).json({ success: false, error: 'Dữ liệu không hợp lệ' });
        }
        const result = await setStock(BigInt(productId), parseInt(stock));
        return res.json({
            success: true,
            message: 'Đã cập nhật tồn kho',
            product: serializeBigInt(result),
        });
    } catch (err: any) {
        return res.status(400).json({ success: false, error: err.message });
    }
};
