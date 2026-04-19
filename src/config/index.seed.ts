import seedUsers from "config/seeds/user.seed";
import seedCategories from "config/seeds/category.seed";
import seedBrands from "./seeds/brand.seed";
import seedSuppliers from "./seeds/supplier.seed";
import seedProduct from "./seeds/product.seed";
import seedOrder from "./seeds/order.seed";

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
    await seedProduct();
    await seedOrder();
};

export default initDatabase;