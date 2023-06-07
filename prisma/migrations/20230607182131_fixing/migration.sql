-- DropForeignKey
ALTER TABLE `propertyimages` DROP FOREIGN KEY `PropertyImages_propertyId_fkey`;

-- AddForeignKey
ALTER TABLE `PropertyImages` ADD CONSTRAINT `PropertyImages_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Properties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
