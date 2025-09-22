/*
  Warnings:

  - A unique constraint covering the columns `[name,departmentId]` on the table `Division` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `device` ADD COLUMN `notes` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Division_name_departmentId_key` ON `Division`(`name`, `departmentId`);
