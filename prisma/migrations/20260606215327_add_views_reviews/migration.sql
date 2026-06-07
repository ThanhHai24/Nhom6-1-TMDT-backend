/*
  Warnings:

  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `viewCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `title` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
