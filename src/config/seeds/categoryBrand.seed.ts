import { prisma } from "config/client";

const seedCategoryBrands = async () => {
    const count = await prisma.categoryBrand.count();
    if (count > 0) {
        console.log("[Seed] CategoryBrands: already seeded, skipping.");
        return;
    }

    // Lấy tất cả categories và brands theo slug
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();

    const catMap = new Map(categories.map(c => [c.slug, c.id]));
    const brandMap = new Map(brands.map(b => [b.slug, b.id]));

    // Helper: tạo link giữa 1 category và nhiều brands
    const link = (catSlug: string, brandSlugs: string[]) => {
        const categoryId = catMap.get(catSlug);
        if (!categoryId) return [];
        return brandSlugs
            .map(bs => ({ categoryId, brandId: brandMap.get(bs) }))
            .filter((row): row is { categoryId: bigint; brandId: bigint } =>
                row.brandId !== undefined
            );
    };

    const data = [
        // ── PC Gaming / Văn phòng / Đồ họa ─────────────────────────
        ...link("pc-gaming",    ["asus", "msi", "gigabyte", "asrock", "intel", "amd", "nvidia", "corsair", "kingston", "gskill", "crucial", "seagate", "western-digital", "cooler-master", "thermaltake", "nzxt", "phanteks", "lian-li", "inwin"]),
        ...link("pc-van-phong", ["asus", "msi", "gigabyte", "asrock", "intel", "amd", "kingston", "crucial", "seagate", "western-digital", "cooler-master"]),
        ...link("pc-do-hoa",    ["asus", "msi", "gigabyte", "asrock", "intel", "amd", "nvidia", "corsair", "kingston", "gskill", "crucial", "seagate", "western-digital", "cooler-master", "nzxt"]),

        // ── Laptop ──────────────────────────────────────────────────
        ...link("laptop-gaming",    ["asus", "msi", "lenovo", "acer", "dell", "hp"]),
        ...link("laptop-van-phong", ["asus", "lenovo", "acer", "dell", "hp"]),
        ...link("laptop-do-hoa",    ["asus", "dell", "hp", "lenovo", "msi"]),

        // ── Linh kiện ───────────────────────────────────────────────
        ...link("cpu-bo-vi-xu-ly",    ["intel", "amd"]),
        ...link("vga-card-do-hoa",    ["nvidia", "amd", "asus", "msi", "gigabyte", "zotac"]),
        ...link("ram-bo-nho-trong",   ["corsair", "kingston", "gskill", "crucial", "hyperx", "samsung"]),
        ...link("o-cung-hdd-ssd",     ["samsung", "seagate", "western-digital", "sandisk", "crucial", "toshiba"]),
        ...link("mainboard-bo-mach-chu", ["asus", "msi", "gigabyte", "asrock", "biostar"]),
        ...link("psu-nguon-may-tinh", ["corsair", "cooler-master", "thermaltake", "asus", "msi"]),
        ...link("case-vo-may-tinh",   ["nzxt", "phanteks", "lian-li", "inwin", "cooler-master", "thermaltake", "asus"]),
        ...link("tan-nhiet-pc",       ["cooler-master", "corsair", "nzxt", "thermaltake", "asus"]),
        ...link("quat-tan-nhiet",     ["cooler-master", "corsair", "nzxt", "thermaltake", "asus"]),

        // ── Thiết bị ngoại vi ───────────────────────────────────────
        ...link("ban-phim",  ["logitech", "razer", "steelseries", "hyperx", "corsair", "asus", "msi"]),
        ...link("chuot",     ["logitech", "razer", "steelseries", "asus", "msi"]),
        ...link("tai-nghe",  ["logitech", "razer", "steelseries", "hyperx", "corsair"]),

        // ── Màn hình ────────────────────────────────────────────────
        ...link("man-hinh",  ["asus", "msi", "lg", "samsung", "acer", "dell"]),
    ];

    if (data.length === 0) {
        console.log("[Seed] CategoryBrands: no data to insert (categories/brands not seeded yet?).");
        return;
    }

    await prisma.categoryBrand.createMany({ data, skipDuplicates: true });
    console.log(`[Seed] CategoryBrands: seeded ${data.length} links successfully.`);
};

export default seedCategoryBrands;
