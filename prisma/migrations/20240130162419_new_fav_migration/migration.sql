/*
  Warnings:

  - You are about to drop the column `colorProduct` on the `Favoritlist` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Favoritlist` table. All the data in the column will be lost.
  - You are about to drop the column `productStoreName` on the `Favoritlist` table. All the data in the column will be lost.
  - You are about to drop the column `productstoreId` on the `Favoritlist` table. All the data in the column will be lost.
  - You are about to drop the column `propertyType` on the `Favoritlist` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Favoritlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favoritlist" DROP COLUMN "colorProduct",
DROP COLUMN "imageUrl",
DROP COLUMN "productStoreName",
DROP COLUMN "productstoreId",
DROP COLUMN "propertyType",
DROP COLUMN "quantity";
