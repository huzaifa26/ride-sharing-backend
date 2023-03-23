/*
  Warnings:

  - Added the required column `isProfileCompleted` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `isProfileCompleted` BOOLEAN NOT NULL,
    ADD COLUMN `userType` VARCHAR(191) NOT NULL;
