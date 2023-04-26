-- AlterTable
ALTER TABLE `User` ADD COLUMN `activateAccountToken` TEXT NULL,
    ADD COLUMN `birthdate` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` TEXT NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;
