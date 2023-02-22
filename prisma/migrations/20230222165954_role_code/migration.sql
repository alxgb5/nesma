/*
  Warnings:

  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - Added the required column `code` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Role` DROP COLUMN `name`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL;
