import { prisma } from "config/client";

const seedCategories = async () => {
    const count = await prisma.category.count();
    if (count > 0) {
        console.log("[Seed] Categories: already seeded, skipping.");
        return;
    }

    // ── Danh mục cha ──────────────────────────────────────────────
    const [pc, laptop, linhKien, ngoaiVi, phuKien, tanNhietPC] = await Promise.all([
        prisma.category.create({
            data: {
                name: "PC - Máy tính bàn",
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
                name: "Linh kiện",
                slug: "linh-kien",
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
                name: "Phụ kiện & Cáp",
                slug: "phu-kien-cap",
                description: "Hub USB, cáp HDMI, túi laptop, đế tản nhiệt",
                icon: "🔌",
                status: "ACTIVE",
            },
        }),
        prisma.category.create({
            data: {
                name: "Tản nhiệt PC",
                slug: "tan-nhiet-pc",
                description: "Tản nhiệt PC, thiết bị làm mát.",
                icon: "🎛️",
                status: "ACTIVE",
            },
        }),
    ]);

    // ── Danh mục con ──────────────────────────────────────────────
    // Con của: Linh kiện
    await prisma.category.createMany({
        data: [
            {
                name: "CPU / Vi xử lý",
                slug: "cpu-vi-xu-ly",
                description: "Intel Core i3–i9, AMD Ryzen 5–9",
                icon: "⚙️",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Card đồ họa (GPU)",
                slug: "card-do-hoa-gpu",
                description: "NVIDIA GeForce RTX, AMD Radeon RX",
                icon: "🎮",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "RAM",
                slug: "ram",
                description: "DDR4, DDR5 cho PC và laptop",
                icon: "💾",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Ổ cứng / SSD",
                slug: "o-cung-ssd",
                description: "SSD NVMe M.2, SATA, HDD 2.5\"/3.5\"",
                icon: "💿",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Mainboard",
                slug: "mainboard",
                description: "Bo mạch chủ Intel, AMD các chuẩn socket",
                icon: "🔩",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Nguồn máy tính",
                slug: "nguon-may-tinh",
                description: "Nguồn máy tính Intel, AMD các chuẩn socket",
                icon: "⚡",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
            {
                name: "Vỏ máy tính",
                slug: "vo-may-tinh",
                description: "Vỏ máy tính Intel, AMD các chuẩn socket",
                icon: "🗄️",
                status: "ACTIVE",
                parentId: linhKien.id,
            },
        ],
    });

    // Con của: Thiết bị ngoại vi
    await prisma.category.createMany({
        data: [
            {
                name: "Màn hình",
                slug: "man-hinh",
                description: "Gaming 144Hz+, 4K IPS, ultrawide",
                icon: "🖥️",
                status: "ACTIVE",
                parentId: ngoaiVi.id,
            },
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

    // Con của: Tản nhiệt PC
    await prisma.category.createMany({
        data: [
            {
                name: "Tản nhiệt khí",
                slug: "tan-nhiet-khi",
                description: "Tản nhiệt khí",
                icon: "🎛️",
                status: "ACTIVE",
                parentId: tanNhietPC.id,
            },
            {
                name: "Tản nhiệt nước",
                slug: "tan-nhiet-nuoc",
                description: "Tản nhiệt nước",
                icon: "🎛️",
                status: "ACTIVE",
                parentId: tanNhietPC.id,
            },
            {
                name: "Quạt tản nhiệt",
                slug: "quat-tan-nhiet",
                description: "Quạt tản nhiệt",
                icon: "🎛️",
                status: "ACTIVE",
                parentId: tanNhietPC.id,
            },
        ],
    });

    // Suppress unused variable warnings
    void pc;
    void phuKien;

    console.log("[Seed] Categories: seeded successfully.");
};

export default seedCategories;
