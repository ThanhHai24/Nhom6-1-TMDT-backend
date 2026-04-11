import { prisma } from "config/client";

const seedBrands = async () => {
    const count = await prisma.brand.count();
    if (count > 0) {
        console.log("[Seed] Brands: already seeded, skipping.");
        return;
    }

    await prisma.brand.createMany({
        data: [
            { name: "Intel", slug: "intel", description: "Intel", status: "ACTIVE" },
            { name: "AMD", slug: "amd", description: "AMD", status: "ACTIVE" },
            { name: "NVIDIA", slug: "nvidia", description: "NVIDIA", status: "ACTIVE" },
            { name: "ASUS", slug: "asus", description: "ASUS", status: "ACTIVE" },
            { name: "MSI", slug: "msi", description: "MSI", status: "ACTIVE" },
            { name: "Lenovo", slug: "lenovo", description: "Lenovo", status: "ACTIVE" },
            { name: "Acer", slug: "acer", description: "Acer", status: "ACTIVE" },
            { name: "Dell", slug: "dell", description: "Dell", status: "ACTIVE" },
            { name: "HP", slug: "hp", description: "HP", status: "ACTIVE" },
            { name: "Samsung", slug: "samsung", description: "Samsung", status: "ACTIVE" },
            { name: "LG", slug: "lg", description: "LG", status: "ACTIVE" },
            { name: "Corsair", slug: "corsair", description: "Corsair", status: "ACTIVE" },
            { name: "Kingston", slug: "kingston", description: "Kingston", status: "ACTIVE" },
            { name: "Logitech", slug: "logitech", description: "Logitech", status: "ACTIVE" },
            { name: "Razer", slug: "razer", description: "Razer", status: "ACTIVE" },
            { name: "SteelSeries", slug: "steelseries", description: "SteelSeries", status: "ACTIVE" },
            { name: "HyperX", slug: "hyperx", description: "HyperX", status: "ACTIVE" },
            { name: "Cooler Master", slug: "cooler-master", description: "Cooler Master", status: "ACTIVE" },
            { name: "Thermaltake", slug: "thermaltake", description: "Thermaltake", status: "ACTIVE" },
            { name: "Seagate", slug: "seagate", description: "Seagate", status: "ACTIVE" },
            { name: "Western Digital", slug: "western-digital", description: "Western Digital", status: "ACTIVE" },
            { name: "Toshiba", slug: "toshiba", description: "Toshiba", status: "ACTIVE" },
            { name: "SanDisk", slug: "sandisk", description: "SanDisk", status: "ACTIVE" },
            { name: "Crucial", slug: "crucial", description: "Crucial", status: "ACTIVE" },
            { name: "G.Skill", slug: "gskill", description: "G.Skill", status: "ACTIVE" },
            { name: "Zotac", slug: "zotac", description: "Zotac", status: "ACTIVE" },
            { name: "Gigabyte", slug: "gigabyte", description: "Gigabyte", status: "ACTIVE" },
            { name: "ASRock", slug: "asrock", description: "ASRock", status: "ACTIVE" },
            { name: "Biostar", slug: "biostar", description: "Biostar", status: "ACTIVE" },
            { name: "ECS", slug: "ecs", description: "ECS", status: "ACTIVE" },
            { name: "Foxconn", slug: "foxconn", description: "Foxconn", status: "ACTIVE" },
            { name: "InWin", slug: "inwin", description: "InWin", status: "ACTIVE" },
            { name: "NZXT", slug: "nzxt", description: "NZXT", status: "ACTIVE" },
            { name: "Phanteks", slug: "phanteks", description: "Phanteks", status: "ACTIVE" },
            { name: "Lian Li", slug: "lian-li", description: "Lian Li", status: "ACTIVE" },
        ],
    });
};

export default seedBrands;