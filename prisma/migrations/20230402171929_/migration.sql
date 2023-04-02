/*
  Warnings:

  - Added the required column `passengers` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ride` ADD COLUMN `passengers` INTEGER NOT NULL;
