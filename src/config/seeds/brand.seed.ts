import { prisma } from "config/client";

const seedBrands = async () => {
    const count = await prisma.brand.count();
    if (count > 0) {
        console.log("[Seed] brand: already seeded, skipping.");
        return;
    }

    await prisma.brand.createMany({
        data: [
            {
                id: BigInt("1"),
                name: "Intel",
                slug: "intel",
                description: "Intel",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("2"),
                name: "AMD",
                slug: "amd",
                description: "AMD",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("3"),
                name: "NVIDIA",
                slug: "nvidia",
                description: "NVIDIA",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("4"),
                name: "ASUS",
                slug: "asus",
                description: "ASUS",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-08T03:41:44.080Z")
            },
            {
                id: BigInt("5"),
                name: "MSI",
                slug: "msi",
                description: "MSI",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T23:06:17.925Z")
            },
            {
                id: BigInt("6"),
                name: "Lenovo",
                slug: "lenovo",
                description: "Lenovo",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("7"),
                name: "Acer",
                slug: "acer",
                description: "Acer",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-08T03:52:43.842Z")
            },
            {
                id: BigInt("8"),
                name: "Dell",
                slug: "dell",
                description: "Dell",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("9"),
                name: "HP",
                slug: "hp",
                description: "HP",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("10"),
                name: "Samsung",
                slug: "samsung",
                description: "Samsung",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("11"),
                name: "LG",
                slug: "lg",
                description: "LG",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("12"),
                name: "Corsair",
                slug: "corsair",
                description: "Corsair",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("13"),
                name: "Kingston",
                slug: "kingston",
                description: "Kingston",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T22:56:51.531Z")
            },
            {
                id: BigInt("14"),
                name: "Logitech",
                slug: "logitech",
                description: "Logitech",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("15"),
                name: "Razer",
                slug: "razer",
                description: "Razer",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("16"),
                name: "SteelSeries",
                slug: "steelseries",
                description: "SteelSeries",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("17"),
                name: "HyperX",
                slug: "hyperx",
                description: "HyperX",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("18"),
                name: "Cooler Master",
                slug: "cooler-master",
                description: "Cooler Master",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("19"),
                name: "Thermaltake",
                slug: "thermaltake",
                description: "Thermaltake",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("20"),
                name: "Seagate",
                slug: "seagate",
                description: "Seagate",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("21"),
                name: "Western Digital",
                slug: "western-digital",
                description: "Western Digital",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("22"),
                name: "Toshiba",
                slug: "toshiba",
                description: "Toshiba",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("23"),
                name: "SanDisk",
                slug: "sandisk",
                description: "SanDisk",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("24"),
                name: "Crucial",
                slug: "crucial",
                description: "Crucial",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("25"),
                name: "G.Skill",
                slug: "gskill",
                description: "G.Skill",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("26"),
                name: "Zotac",
                slug: "zotac",
                description: "Zotac",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("27"),
                name: "Gigabyte",
                slug: "gigabyte",
                description: "Gigabyte",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-07T16:13:22.001Z")
            },
            {
                id: BigInt("28"),
                name: "ASRock",
                slug: "asrock",
                description: "ASRock",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("29"),
                name: "Biostar",
                slug: "biostar",
                description: "Biostar",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("30"),
                name: "ECS",
                slug: "ecs",
                description: "ECS",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("31"),
                name: "Foxconn",
                slug: "foxconn",
                description: "Foxconn",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("32"),
                name: "InWin",
                slug: "inwin",
                description: "InWin",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("33"),
                name: "NZXT",
                slug: "nzxt",
                description: "NZXT",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("34"),
                name: "Phanteks",
                slug: "phanteks",
                description: "Phanteks",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-06T21:45:48.336Z")
            },
            {
                id: BigInt("35"),
                name: "Lian Li",
                slug: "lian-li",
                description: "Lian Li",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.336Z"),
                updatedAt: new Date("2026-06-07T16:12:56.873Z")
            },
            {
                id: BigInt("36"),
                name: "INNO3D",
                slug: "inno3d",
                description: "INNO3D",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T22:25:54.909Z"),
                updatedAt: new Date("2026-06-06T22:25:54.909Z")
            },
            {
                id: BigInt("37"),
                name: "ID_COOLING",
                slug: "id_cooling",
                description: "ID_COOLING",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T23:11:50.361Z"),
                updatedAt: new Date("2026-06-06T23:11:50.361Z")
            },
            {
                id: BigInt("38"),
                name: "PCS",
                slug: "pcs",
                description: "",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T23:24:49.133Z"),
                updatedAt: new Date("2026-06-07T06:12:14.661Z")
            },
            {
                id: BigInt("39"),
                name: "Colorful",
                slug: "colorful",
                description: "Colorful",
                status: "ACTIVE",
                createdAt: new Date("2026-06-08T02:51:44.598Z"),
                updatedAt: new Date("2026-06-08T02:51:54.006Z")
            },
            {
                id: BigInt("40"),
                name: "Lexar",
                slug: "lexar",
                description: "Lexar",
                status: "ACTIVE",
                createdAt: new Date("2026-06-08T02:56:33.647Z"),
                updatedAt: new Date("2026-06-08T02:56:33.647Z")
            },
            {
                id: BigInt("41"),
                name: "Gamdias",
                slug: "gamdias",
                description: "",
                status: "ACTIVE",
                createdAt: new Date("2026-06-08T03:03:00.021Z"),
                updatedAt: new Date("2026-06-08T03:03:00.021Z")
            },
            {
                id: BigInt("42"),
                name: "Vitra",
                slug: "vitra",
                description: "",
                status: "ACTIVE",
                createdAt: new Date("2026-06-08T03:06:09.365Z"),
                updatedAt: new Date("2026-06-08T03:06:09.365Z")
            }
        ],
    });

    console.log("[Seed] brand: seeded successfully.");
};

export default seedBrands;
