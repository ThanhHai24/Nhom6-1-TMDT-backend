import { prisma } from "config/client";

const seedCategories = async () => {
    const count = await prisma.category.count();
    if (count > 0) {
        console.log("[Seed] Categories: already seeded, skipping.");
        return;
    }

    // ── Danh mục cha ──────────────────────────────────────────────
    const [pc, laptop, linhKien, ngoaiVi, phuKien] = await Promise.all([
        prisma.category.create({
            data: {
                name: "PC",
                slug: "pc",
                description: "PC gaming, PC văn phòng, workstation",
                icon: "🖥️",
                status: "ACTIVE",
            },
        }),
        prisma.category.create({
            data: {
                name: "Laptop",
                slug: "laptop",
                description: "Laptop gaming, văn phòng, đồ họa, ultrabook",
                icon: "💻",
                status: "ACTIVE",
            },
        }),
        prisma.category.create({
            data: {
                name: "Linh kiện máy tính",
                slug: "linh-kien-may-tinh",
                description: "CPU, GPU, RAM, mainboard, ổ cứng, nguồn, tản nhiệt",
                icon: "🔧",
                status: "ACTIVE",
            },
        }),
        prisma.category.create({
            data: {
                name: "Thiết bị ngoại vi",
                slug: "thiet-bi-ngoai-vi",
                description: "Màn hình, bàn phím, chuột, tai nghe, webcam",
                icon: "🖱️",
                status: "ACTIVE",
            },
        }),
        prisma.category.create({
            data: {
                name: "Màn hình",
                slug: "man-hinh",
                description: "Màn hình gaming, màn hình văn phòng, màn hình đồ họa",
                icon: "🖥️",
                status: "ACTIVE",
            },
        }),
        prisma.category.create({
            data: {
                name: "Phụ kiện & Cáp",
                slug: "phu-kien-cap",
                description: "Hub USB, cáp HDMI, túi laptop, đế tản nhiệt",
                icon: "🔌",
                status: "ACTIVE",
            },
        }),
    ]);

    // ── Danh mục con ──────────────────────────────────────────────
    // Con của: Linh kiện
    await prisma.category.createMany({
        data: [
            {
                name: "CPU - Bộ vi xử lý",
                slug: "cpu-bo-vi-xu-ly",
                description: "Intel Core i3–i9, AMD Ryzen 5–9",
                icon: "⚙️",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "VGA - Card đồ họa",
                slug: "vga-card-do-hoa",
                description: "NVIDIA GeForce RTX, AMD Radeon RX",
                icon: "🎮",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "RAM - Bộ nhớ trong",
                slug: "ram-bo-nho-trong",
                description: "DDR4, DDR5 cho PC và laptop",
                icon: "💾",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Ổ cứng HDD / SSD",
                slug: "o-cung-hdd-ssd",
                description: "SSD NVMe M.2, SATA, HDD 2.5\"/3.5\"",
                icon: "💿",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Mainboard - Bo mạch chủ",
                slug: "mainboard-bo-mach-chu",
                description: "Bo mạch chủ Intel, AMD các chuẩn socket",
                icon: "🔩",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "PSU - Nguồn máy tính",
                slug: "psu-nguon-may-tinh",
                description: "Nguồn máy tính Intel, AMD các chuẩn socket",
                icon: "⚡",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Case - Vỏ máy tính",
                slug: "case-vo-may-tinh",
                description: "Vỏ máy tính case mini ITX, case mid ATX, case full tower",
                icon: "🗄️",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Tản nhiệt PC",
                slug: "tan-nhiet-pc",
                description: "Tản nhiệt CPU, tản nhiệt RAM, tản nhiệt GPU, tản nhiệt case",
                icon: "🎛️",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Quạt tản nhiệt",
                slug: "quat-tan-nhiet",
                description: "Quạt tản nhiệt case",
                icon: "🎛️",
                status: "ACTIVE",
                parentId: linhKien.id,
            }
        ],
    });

    // Con của: Thiết bị ngoại vi
    await prisma.category.createMany({
        data: [
            {
                name: "Bàn phím",
                slug: "ban-phim",
                description: "Bàn phím cơ, membrane, gaming, không dây",
                icon: "⌨️",
                status: "ACTIVE",
                parentId: ngoaiVi.id,
            },
            {
                name: "Chuột",
                slug: "chuot",
                description: "Chuột gaming, văn phòng, không dây",
                icon: "🖱️",
                status: "ACTIVE",
                parentId: ngoaiVi.id,
            },
            {
                name: "Tai nghe",
                slug: "tai-nghe",
                description: "Gaming, studio, TWS, có micro",
                icon: "🎧",
                status: "ACTIVE",
                parentId: ngoaiVi.id,
            },
        ],
    });

    // Con của: Laptop
    await prisma.category.createMany({
        data: [
            {
                name: "Laptop Gaming",
                slug: "laptop-gaming",
                description: "ASUS ROG, MSI, Lenovo Legion, Acer Nitro",
                icon: "🎯",
                status: "ACTIVE",
                parentId: laptop.id,
            },
            {
                name: "Laptop Văn phòng",
                slug: "laptop-van-phong",
                description: "Dell, HP, Lenovo ThinkPad, Acer Aspire",
                icon: "💼",
                status: "ACTIVE",
                parentId: laptop.id,
            },
            {
                name: "Laptop Đồ họa",
                slug: "laptop-do-hoa",
                description: "MacBook Pro, Dell XPS, ASUS ProArt",
                icon: "🎨",
                status: "ACTIVE",
                parentId: laptop.id,
            },
        ],
    });

    await prisma.category.createMany({
        data: [
            {
                name: "PC Gaming",
                slug: "pc-gaming",
                description: "PC Gaming với linh kiện hàng đầu cho trải nghiệm game đỉnh cao",
                icon: "🎯",
                status: "ACTIVE",
                parentId: pc.id,
            },
            {
                name: "PC Văn phòng",
                slug: "pc-van-phong",
                description: "PC Văn phòng cấu hình tối ưu cho công việc văn phòng",
                icon: "💼",
                status: "ACTIVE",
                parentId: pc.id,
            },
            {
                name: "PC Đồ họa",
                slug: "pc-do-hoa",
                description: "PC Đồ họa cấu hình tối ưu cho công việc đồ họa",
                icon: "🎨",
                status: "ACTIVE",
                parentId: pc.id,
            },
        ],
    });

    // Suppress unused variable warnings
    void pc;
    void phuKien;

    console.log("[Seed] Categories: seeded successfully.");
};

export default seedCategories;
