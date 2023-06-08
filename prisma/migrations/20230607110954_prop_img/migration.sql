-- CreateTable
CREATE TABLE `PropertyImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyPicUrl` VARCHAR(191) NOT NULL,
    `propertyId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PropertyImages` ADD CONSTRAINT `PropertyImages_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Properties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
