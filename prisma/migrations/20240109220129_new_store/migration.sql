/*
  Warnings:

  - Added the required column `productstoreId` to the `Storeuser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeBuyerId` to the `Storeuser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Storeuser" ADD COLUMN     "productstoreId" INTEGER NOT NULL,
ADD COLUMN     "storeBuyerId" INTEGER NOT NULL;
