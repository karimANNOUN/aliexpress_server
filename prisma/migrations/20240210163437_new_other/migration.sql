/*
  Warnings:

  - You are about to drop the column `userpayerId` on the `Storepayer` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Storepayer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Storepayer" DROP CONSTRAINT "Storepayer_userpayerId_fkey";

-- AlterTable
ALTER TABLE "Storepayer" DROP COLUMN "userpayerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
