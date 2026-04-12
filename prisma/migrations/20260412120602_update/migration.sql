/*
  Warnings:

  - The values [PICKED_UP,FAILED] on the enum `shipping_orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shipping_orders` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PACKED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'PENDING';
