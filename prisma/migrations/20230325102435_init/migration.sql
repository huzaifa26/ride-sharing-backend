/*
  Warnings:

  - You are about to drop the column `isActive` on the `ride` table. All the data in the column will be lost.
  - Added the required column `isAccepted` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ride` DROP COLUMN `isActive`,
    ADD COLUMN `isAccepted` BOOLEAN NOT NULL;
