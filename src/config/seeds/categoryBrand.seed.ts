import { prisma } from "config/client";

const seedCategoryBrands = async () => {
    const count = await prisma.categoryBrand.count();
    if (count > 0) {
        console.log("[Seed] categoryBrand: already seeded, skipping.");
        return;
    }

    await prisma.categoryBrand.createMany({
        data: [
        {
            categoryId: BigInt("7"),
            brandId: BigInt("1")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("1")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("1")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("1")
        },
        {
            categoryId: BigInt("7"),
            brandId: BigInt("2")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("2")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("2")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("2")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("2")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("3")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("3")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("3")
        },
        {
            categoryId: BigInt("6"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("11"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("12"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("15"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("17"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("20"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("21"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("4")
        },
        {
            categoryId: BigInt("4"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("5"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("6"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("11"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("12"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("17"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("21"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("5")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("6")
        },
        {
            categoryId: BigInt("20"),
            brandId: BigInt("6")
        },
        {
            categoryId: BigInt("21"),
            brandId: BigInt("6")
        },
        {
            categoryId: BigInt("6"),
            brandId: BigInt("7")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("7")
        },
        {
            categoryId: BigInt("20"),
            brandId: BigInt("7")
        },
        {
            categoryId: BigInt("6"),
            brandId: BigInt("8")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("8")
        },
        {
            categoryId: BigInt("20"),
            brandId: BigInt("8")
        },
        {
            categoryId: BigInt("21"),
            brandId: BigInt("8")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("9")
        },
        {
            categoryId: BigInt("20"),
            brandId: BigInt("9")
        },
        {
            categoryId: BigInt("21"),
            brandId: BigInt("9")
        },
        {
            categoryId: BigInt("6"),
            brandId: BigInt("10")
        },
        {
            categoryId: BigInt("9"),
            brandId: BigInt("10")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("10")
        },
        {
            categoryId: BigInt("6"),
            brandId: BigInt("11")
        },
        {
            categoryId: BigInt("9"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("12"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("15"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("18"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("12")
        },
        {
            categoryId: BigInt("9"),
            brandId: BigInt("13")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("13")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("13")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("13")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("13")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("14")
        },
        {
            categoryId: BigInt("17"),
            brandId: BigInt("14")
        },
        {
            categoryId: BigInt("18"),
            brandId: BigInt("14")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("15")
        },
        {
            categoryId: BigInt("17"),
            brandId: BigInt("15")
        },
        {
            categoryId: BigInt("18"),
            brandId: BigInt("15")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("16")
        },
        {
            categoryId: BigInt("17"),
            brandId: BigInt("16")
        },
        {
            categoryId: BigInt("18"),
            brandId: BigInt("16")
        },
        {
            categoryId: BigInt("9"),
            brandId: BigInt("17")
        },
        {
            categoryId: BigInt("16"),
            brandId: BigInt("17")
        },
        {
            categoryId: BigInt("18"),
            brandId: BigInt("17")
        },
        {
            categoryId: BigInt("12"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("15"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("18")
        },
        {
            categoryId: BigInt("12"),
            brandId: BigInt("19")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("19")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("19")
        },
        {
            categoryId: BigInt("15"),
            brandId: BigInt("19")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("19")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("20")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("20")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("20")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("20")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("21")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("21")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("21")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("21")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("22")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("23")
        },
        {
            categoryId: BigInt("9"),
            brandId: BigInt("24")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("24")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("24")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("24")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("24")
        },
        {
            categoryId: BigInt("9"),
            brandId: BigInt("25")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("25")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("25")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("26")
        },
        {
            categoryId: BigInt("5"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("10"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("11"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("19"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("21"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("27")
        },
        {
            categoryId: BigInt("11"),
            brandId: BigInt("28")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("28")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("28")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("28")
        },
        {
            categoryId: BigInt("11"),
            brandId: BigInt("29")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("32")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("32")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("33")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("33")
        },
        {
            categoryId: BigInt("15"),
            brandId: BigInt("33")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("33")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("33")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("34")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("34")
        },
        {
            categoryId: BigInt("13"),
            brandId: BigInt("35")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("35")
        },
        {
            categoryId: BigInt("8"),
            brandId: BigInt("36")
        },
        {
            categoryId: BigInt("14"),
            brandId: BigInt("37")
        },
        {
            categoryId: BigInt("2"),
            brandId: BigInt("38")
        },
        {
            categoryId: BigInt("22"),
            brandId: BigInt("38")
        },
        {
            categoryId: BigInt("23"),
            brandId: BigInt("38")
        },
        {
            categoryId: BigInt("24"),
            brandId: BigInt("38")
        }
        ],
    });

    console.log("[Seed] categoryBrand: seeded successfully.");
};

export default seedCategoryBrands;
