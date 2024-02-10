-- DropForeignKey
ALTER TABLE "Storepayer" DROP CONSTRAINT "Storepayer_userId_fkey";

-- AlterTable
ALTER TABLE "Storepayer" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
