import { prisma } from "config/client";

const seedCategories = async () => {
    const count = await prisma.category.count();
    if (count > 0) {
        console.log("[Seed] Categories: already seeded, skipping.");
        return;
    }

    // Seed root categories first
    await prisma.category.createMany({
        data: [
            {
                id: BigInt("1"),
                name: "Linh kiện máy tính",
                slug: "linh-kien-may-tinh",
                description: "CPU, GPU, RAM, mainboard, ổ cứng, nguồn, tản nhiệt",
                icon: "🔧",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.321Z"),
                updatedAt: new Date("2026-06-06T21:45:48.321Z"),
                parentId: null
            },
            {
                id: BigInt("2"),
                name: "PC",
                slug: "pc",
                description: "PC gaming, PC văn phòng, workstation",
                icon: "🖥️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.321Z"),
                updatedAt: new Date("2026-06-06T21:45:48.321Z"),
                parentId: null
            },
            {
                id: BigInt("3"),
                name: "Phụ kiện & Cáp",
                slug: "phu-kien-cap",
                description: "Hub USB, cáp HDMI, túi laptop, đế tản nhiệt",
                icon: "🔌",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.321Z"),
                updatedAt: new Date("2026-06-06T21:45:48.321Z"),
                parentId: null
            },
            {
                id: BigInt("4"),
                name: "Thiết bị ngoại vi",
                slug: "thiet-bi-ngoai-vi",
                description: "Màn hình, bàn phím, chuột, tai nghe, webcam",
                icon: "🖱️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.321Z"),
                updatedAt: new Date("2026-06-06T21:45:48.321Z"),
                parentId: null
            },
            {
                id: BigInt("5"),
                name: "Laptop",
                slug: "laptop",
                description: "Laptop gaming, văn phòng, đồ họa, ultrabook",
                icon: "💻",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.321Z"),
                updatedAt: new Date("2026-06-06T21:45:48.321Z"),
                parentId: null
            },
            {
                id: BigInt("6"),
                name: "Màn hình",
                slug: "man-hinh",
                description: "Màn hình gaming, màn hình văn phòng, màn hình đồ họa",
                icon: "🖥️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.321Z"),
                updatedAt: new Date("2026-06-06T21:45:48.321Z"),
                parentId: null
            }
        ],
    });

    // Seed child categories
    await prisma.category.createMany({
        data: [
            {
                id: BigInt("7"),
                name: "CPU - Bộ vi xử lý",
                slug: "cpu-bo-vi-xu-ly",
                description: "Intel Core i3–i9, AMD Ryzen 5–9",
                icon: "⚙️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("8"),
                name: "VGA - Card đồ họa",
                slug: "vga-card-do-hoa",
                description: "NVIDIA GeForce RTX, AMD Radeon RX",
                icon: "🎮",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("9"),
                name: "RAM - Bộ nhớ trong",
                slug: "ram-bo-nho-trong",
                description: "DDR4, DDR5 cho PC và laptop",
                icon: "💾",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("10"),
                name: "Ổ cứng HDD / SSD",
                slug: "o-cung-hdd-ssd",
                description: "SSD NVMe M.2, SATA, HDD 2.5\"/3.5\"",
                icon: "💿",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("11"),
                name: "Mainboard - Bo mạch chủ",
                slug: "mainboard-bo-mach-chu",
                description: "Bo mạch chủ Intel, AMD các chuẩn socket",
                icon: "🔩",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("12"),
                name: "PSU - Nguồn máy tính",
                slug: "psu-nguon-may-tinh",
                description: "Nguồn máy tính Intel, AMD các chuẩn socket",
                icon: "⚡",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("13"),
                name: "Case - Vỏ máy tính",
                slug: "case-vo-may-tinh",
                description: "Vỏ máy tính case mini ITX, case mid ATX, case full tower",
                icon: "🗄️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("14"),
                name: "Tản nhiệt CPU",
                slug: "tan-nhiet-cpu",
                description: "Tản nhiệt CPU, tản nhiệt RAM, tản nhiệt GPU, tản nhiệt case",
                icon: "🎛️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T23:20:14.345Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("15"),
                name: "Quạt tản nhiệt",
                slug: "quat-tan-nhiet",
                description: "Quạt tản nhiệt case",
                icon: "🎛️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.326Z"),
                updatedAt: new Date("2026-06-06T21:45:48.326Z"),
                parentId: BigInt("1")
            },
            {
                id: BigInt("16"),
                name: "Bàn phím",
                slug: "ban-phim",
                description: "Bàn phím cơ, membrane, gaming, không dây",
                icon: "⌨️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.328Z"),
                updatedAt: new Date("2026-06-06T21:45:48.328Z"),
                parentId: BigInt("4")
            },
            {
                id: BigInt("17"),
                name: "Chuột",
                slug: "chuot",
                description: "Chuột gaming, văn phòng, không dây",
                icon: "🖱️",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.328Z"),
                updatedAt: new Date("2026-06-06T21:45:48.328Z"),
                parentId: BigInt("4")
            },
            {
                id: BigInt("18"),
                name: "Tai nghe",
                slug: "tai-nghe",
                description: "Gaming, studio, TWS, có micro",
                icon: "🎧",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.328Z"),
                updatedAt: new Date("2026-06-06T21:45:48.328Z"),
                parentId: BigInt("4")
            },
            {
                id: BigInt("19"),
                name: "Laptop Gaming",
                slug: "laptop-gaming",
                description: "ASUS ROG, MSI, Lenovo Legion, Acer Nitro",
                icon: "🎯",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.330Z"),
                updatedAt: new Date("2026-06-06T21:45:48.330Z"),
                parentId: BigInt("5")
            },
            {
                id: BigInt("20"),
                name: "Laptop Văn phòng",
                slug: "laptop-van-phong",
                description: "Dell, HP, Lenovo ThinkPad, Acer Aspire",
                icon: "💼",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.330Z"),
                updatedAt: new Date("2026-06-06T21:45:48.330Z"),
                parentId: BigInt("5")
            },
            {
                id: BigInt("21"),
                name: "Laptop Đồ họa",
                slug: "laptop-do-hoa",
                description: "MacBook Pro, Dell XPS, ASUS ProArt",
                icon: "🎨",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.330Z"),
                updatedAt: new Date("2026-06-06T21:45:48.330Z"),
                parentId: BigInt("5")
            },
            {
                id: BigInt("22"),
                name: "PC Gaming",
                slug: "pc-gaming",
                description: "PC Gaming với linh kiện hàng đầu cho trải nghiệm game đỉnh cao",
                icon: "🎯",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.332Z"),
                updatedAt: new Date("2026-06-06T21:45:48.332Z"),
                parentId: BigInt("2")
            },
            {
                id: BigInt("23"),
                name: "PC Văn phòng",
                slug: "pc-van-phong",
                description: "PC Văn phòng cấu hình tối ưu cho công việc văn phòng",
                icon: "💼",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.332Z"),
                updatedAt: new Date("2026-06-06T21:45:48.332Z"),
                parentId: BigInt("2")
            },
            {
                id: BigInt("24"),
                name: "PC Đồ họa",
                slug: "pc-do-hoa",
                description: "PC Đồ họa cấu hình tối ưu cho công việc đồ họa",
                icon: "🎨",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.332Z"),
                updatedAt: new Date("2026-06-06T21:45:48.332Z"),
                parentId: BigInt("2")
            }
        ],
    });

    console.log("[Seed] Categories: seeded successfully.");
};

export default seedCategories;
