-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "userlocationId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Location_userlocationId_idx" ON "Location"("userlocationId");
