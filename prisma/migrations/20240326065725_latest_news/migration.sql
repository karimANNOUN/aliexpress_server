/*
  Warnings:

  - Made the column `userlocationId` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userlocationId_fkey";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "userlocationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userlocationId_fkey" FOREIGN KEY ("userlocationId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
