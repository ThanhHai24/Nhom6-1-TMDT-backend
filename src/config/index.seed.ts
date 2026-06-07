import seedUsers from "config/seeds/user.seed";
import seedCategories from "config/seeds/category.seed";
import seedBrands from "./seeds/brand.seed";
import seedCategoryBrands from "./seeds/categoryBrand.seed";
import seedSuppliers from "./seeds/supplier.seed";
import seedProduct from "./seeds/product.seed";
import seedPromotions from "./seeds/promotion.seed";
import seedShipping from "./seeds/shipping.seed";
import seedOrder from "./seeds/order.seed";

/**
 * Chạy toàn bộ seed theo thứ tự đúng (FK dependency)
 */
const initDatabase = async () => {
    await seedUsers();
    await seedCategories();
    await seedBrands();
    await seedCategoryBrands();
    await seedSuppliers();
    await seedProduct();
    await seedPromotions();
    await seedShipping();
    await seedOrder();
};

export default initDatabase;