/*
  Warnings:

  - A unique constraint covering the columns `[storeId]` on the table `Storepayer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Storepayer" ADD COLUMN     "storeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Storepayer_storeId_key" ON "Storepayer"("storeId");

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Storeuser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
