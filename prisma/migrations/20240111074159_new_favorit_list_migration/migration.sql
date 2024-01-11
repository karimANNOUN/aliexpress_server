-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "likeProduct" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Favoritlist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productfavoritId" INTEGER NOT NULL,

    CONSTRAINT "Favoritlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favoritlist" ADD CONSTRAINT "Favoritlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoritlist" ADD CONSTRAINT "Favoritlist_productfavoritId_fkey" FOREIGN KEY ("productfavoritId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
