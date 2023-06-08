/*
  Warnings:

  - A unique constraint covering the columns `[provincy]` on the table `Provincies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Provincies_provincy_key` ON `Provincies`(`provincy`);
