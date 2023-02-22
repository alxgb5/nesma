/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserRole_code_key` ON `UserRole`(`code`);
