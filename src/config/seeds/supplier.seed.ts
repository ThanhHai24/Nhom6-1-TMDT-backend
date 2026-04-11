import { prisma } from "config/client";
const seedSuppliers = async () => {
    const count = await prisma.supplier.count();
    if (count > 0) {
        console.log("[Seed] Suppliers: already seeded, skipping.");
        return;
    }
    await prisma.supplier.createMany({
        data: [
            { name: "FPT Synnex", slug: "fpt-synnex", description: "FPT Synnex", status: "ACTIVE" },
            { name: "Viết Sơn JSC", slug: "viet-son", description: "Viết Sơn", status: "ACTIVE" },
            { name: "Viễn Sơn", slug: "vien-son", description: "Viễn Sơn", status: "ACTIVE" },
            { name: "Mai Hoàng", slug: "mai-hoang", description: "Mai Hoàng", status: "ACTIVE" },
        ]
    })
}

export default seedSuppliers;