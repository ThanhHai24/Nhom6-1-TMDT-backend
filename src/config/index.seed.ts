import seedUsers from "config/seeds/user.seed";
import seedCategories from "config/seeds/category.seed";
import seedBrands from "./seeds/brand.seed";
import seedSuppliers from "./seeds/supplier.seed";

/**
 * Chạy toàn bộ seed theo thứ tự đúng (FK dependency):
 *  1. Users
 *  2. Categories (cha → con)
 */
const initDatabase = async () => {
    await seedUsers();
    await seedCategories();
    await seedBrands();
    await seedSuppliers();
};

export default initDatabase;