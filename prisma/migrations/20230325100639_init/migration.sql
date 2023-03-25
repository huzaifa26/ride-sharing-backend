/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ride` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCompleted` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ride` DROP COLUMN `updatedAt`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL,
    ADD COLUMN `isCompleted` BOOLEAN NOT NULL;
