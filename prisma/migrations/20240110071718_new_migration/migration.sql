/*
  Warnings:

  - You are about to drop the column `storeBuyerId` on the `Storeuser` table. All the data in the column will be lost.
  - You are about to drop the column `storeBuyerName` on the `Storeuser` table. All the data in the column will be lost.
  - You are about to drop the `_ProductToStoreuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToStoreuser" DROP CONSTRAINT "_ProductToStoreuser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToStoreuser" DROP CONSTRAINT "_ProductToStoreuser_B_fkey";

-- DropIndex
DROP INDEX "Storeuser_userId_key";

-- AlterTable
ALTER TABLE "Storeuser" DROP COLUMN "storeBuyerId",
DROP COLUMN "storeBuyerName";

-- DropTable
DROP TABLE "_ProductToStoreuser";

-- AddForeignKey
ALTER TABLE "Storeuser" ADD CONSTRAINT "Storeuser_productstoreId_fkey" FOREIGN KEY ("productstoreId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
