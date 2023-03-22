-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phoneNumber` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `criminalRecord` BOOLEAN NULL,
    `isInsured` BOOLEAN NULL,
    `carName` VARCHAR(191) NULL,
    `carModel` VARCHAR(191) NULL,
    `carRegisteration` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
