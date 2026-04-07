/*
  Warnings:

  - The values [banned] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
