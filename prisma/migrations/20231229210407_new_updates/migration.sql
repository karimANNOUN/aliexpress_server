-- AlterTable
ALTER TABLE "Legalrepresentative" ALTER COLUMN "identityImages" DROP NOT NULL,
ALTER COLUMN "identityImages" SET DATA TYPE TEXT;
