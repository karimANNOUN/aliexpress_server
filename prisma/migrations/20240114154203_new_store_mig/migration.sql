/*
  Warnings:

  - You are about to drop the column `productStoreId` on the `Storeuser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Storeuser" DROP COLUMN "productStoreId",
ADD COLUMN     "productUserStoreId" INTEGER;
