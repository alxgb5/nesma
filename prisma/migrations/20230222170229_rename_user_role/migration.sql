/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserToRole` DROP FOREIGN KEY `_UserToRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserToRole` DROP FOREIGN KEY `_UserToRole_B_fkey`;

-- DropTable
DROP TABLE `Role`;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserToRole` ADD CONSTRAINT `_UserToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToRole` ADD CONSTRAINT `_UserToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserRole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
