/*
  Warnings:

  - You are about to drop the column `userId` on the `Storepayer` table. All the data in the column will be lost.
  - Added the required column `userpayerId` to the `Storepayer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Storepayer" DROP CONSTRAINT "Storepayer_userId_fkey";

-- AlterTable
ALTER TABLE "Storepayer" DROP COLUMN "userId",
ADD COLUMN     "userpayerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_userpayerId_fkey" FOREIGN KEY ("userpayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
