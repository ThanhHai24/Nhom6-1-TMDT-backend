import { prisma } from "config/client";

const seedProduct = async () => {
    const count = await prisma.product.count();
    if (count > 0) {
        console.log("[Seed] Products: already seeded, skipping.");
        return;
    }

    await prisma.product.createMany({
        data: [
            {
                name: "Product 1",
                slug: "product-1",
                shortDescription: "Short description 1",
                description: "Description 1",
                price: 100,
                stock: 10,
                image: "https://example.com/product1.jpg",
                categoryId: 1,
                brandId: 1,
                sku: "SKU1",
                cost: 100,  
                supplierId: 1,
            },
            {
                name: "Product 2",
                slug: "product-2",
                shortDescription: "Short description 2",
                description: "Description 2",
                price: 200,
                stock: 20,
                image: "https://example.com/product2.jpg",
                categoryId: 2,
                brandId: 2,
                sku: "SKU2",
                cost: 200,
                supplierId: 2,
            },
        ],
    });

    console.log("[Seed] Products: seeded successfully.");
};

export default seedProduct;