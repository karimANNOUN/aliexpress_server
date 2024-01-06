/*
  Warnings:

  - You are about to drop the column `details` on the `Property` table. All the data in the column will be lost.
  - Added the required column `detailsName` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "details",
ADD COLUMN     "detailsName" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
