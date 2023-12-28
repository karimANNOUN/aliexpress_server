/*
  Warnings:

  - You are about to drop the column `status` on the `Entreprise` table. All the data in the column will be lost.
  - You are about to drop the `Identity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Identity" DROP CONSTRAINT "Identity_legalId_fkey";

-- AlterTable
ALTER TABLE "Entreprise" DROP COLUMN "status",
ADD COLUMN     "entreprisePhoneNumber" TEXT,
ADD COLUMN     "industryType" TEXT;

-- AlterTable
ALTER TABLE "Legalrepresentative" ADD COLUMN     "expireIdentity" TEXT,
ADD COLUMN     "identityImages" TEXT[],
ADD COLUMN     "identityType" TEXT,
ADD COLUMN     "identityTypeNumber" TEXT,
ADD COLUMN     "legalPhoneNumber" TEXT;

-- DropTable
DROP TABLE "Identity";
