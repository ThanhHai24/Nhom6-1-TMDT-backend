-- CreateTable
CREATE TABLE `category_brands` (
    `categoryId` BIGINT NOT NULL,
    `brandId` BIGINT NOT NULL,

    PRIMARY KEY (`categoryId`, `brandId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `category_brands` ADD CONSTRAINT `category_brands_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_brands` ADD CONSTRAINT `category_brands_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
