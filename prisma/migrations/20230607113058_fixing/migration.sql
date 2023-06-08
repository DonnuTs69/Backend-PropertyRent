-- AlterTable
ALTER TABLE `properties` ADD COLUMN `cityId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Properties` ADD CONSTRAINT `Properties_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `Cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
