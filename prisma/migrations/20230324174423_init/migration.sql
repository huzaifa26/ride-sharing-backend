/*
  Warnings:

  - You are about to alter the column `isAvailable` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `isAvailable` BOOLEAN NULL;
