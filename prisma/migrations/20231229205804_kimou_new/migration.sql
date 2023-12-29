/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Entreprise` table. All the data in the column will be lost.
  - You are about to drop the column `sellerlegalId` on the `Legalrepresentative` table. All the data in the column will be lost.
  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Entreprise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userlegalId]` on the table `Legalrepresentative` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Entreprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userlegalId` to the `Legalrepresentative` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entreprise" DROP CONSTRAINT "Entreprise_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Legalrepresentative" DROP CONSTRAINT "Legalrepresentative_sellerlegalId_fkey";

-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_userId_fkey";

-- DropIndex
DROP INDEX "Entreprise_sellerId_key";

-- DropIndex
DROP INDEX "Legalrepresentative_sellerlegalId_key";

-- AlterTable
ALTER TABLE "Entreprise" DROP COLUMN "sellerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Legalrepresentative" DROP COLUMN "sellerlegalId",
ADD COLUMN     "userlegalId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Seller";

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_userId_key" ON "Entreprise"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Legalrepresentative_userlegalId_key" ON "Legalrepresentative"("userlegalId");

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legalrepresentative" ADD CONSTRAINT "Legalrepresentative_userlegalId_fkey" FOREIGN KEY ("userlegalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
