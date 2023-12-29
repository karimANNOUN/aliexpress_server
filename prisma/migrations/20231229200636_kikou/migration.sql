/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Legalrepresentative` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sellerlegalId]` on the table `Legalrepresentative` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sellerlegalId` to the `Legalrepresentative` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Legalrepresentative" DROP CONSTRAINT "Legalrepresentative_sellerId_fkey";

-- DropIndex
DROP INDEX "Legalrepresentative_sellerId_key";

-- AlterTable
ALTER TABLE "Legalrepresentative" DROP COLUMN "sellerId",
ADD COLUMN     "sellerlegalId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Legalrepresentative_sellerlegalId_key" ON "Legalrepresentative"("sellerlegalId");

-- AddForeignKey
ALTER TABLE "Legalrepresentative" ADD CONSTRAINT "Legalrepresentative_sellerlegalId_fkey" FOREIGN KEY ("sellerlegalId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
