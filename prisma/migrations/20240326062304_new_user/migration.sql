/*
  Warnings:

  - You are about to drop the column `userId` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userlocationId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userlocationId` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- DropIndex
DROP INDEX "Location_userId_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "userId",
ADD COLUMN     "userlocationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_userlocationId_key" ON "Location"("userlocationId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userlocationId_fkey" FOREIGN KEY ("userlocationId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
