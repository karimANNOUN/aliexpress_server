-- DropForeignKey
ALTER TABLE "Entreprise" DROP CONSTRAINT "Entreprise_userId_fkey";

-- DropForeignKey
ALTER TABLE "Favoritlist" DROP CONSTRAINT "Favoritlist_productfavoritId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "Legalrepresentative" DROP CONSTRAINT "Legalrepresentative_userlegalId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_productId_fkey";

-- DropForeignKey
ALTER TABLE "Storepayer" DROP CONSTRAINT "Storepayer_productstoreId_fkey";

-- DropForeignKey
ALTER TABLE "Storepayer" DROP CONSTRAINT "Storepayer_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Storeuser" DROP CONSTRAINT "Storeuser_productstoreId_fkey";

-- DropForeignKey
ALTER TABLE "Storeuser" DROP CONSTRAINT "Storeuser_userId_fkey";

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legalrepresentative" ADD CONSTRAINT "Legalrepresentative_userlegalId_fkey" FOREIGN KEY ("userlegalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storeuser" ADD CONSTRAINT "Storeuser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storeuser" ADD CONSTRAINT "Storeuser_productstoreId_fkey" FOREIGN KEY ("productstoreId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_productstoreId_fkey" FOREIGN KEY ("productstoreId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Storeuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoritlist" ADD CONSTRAINT "Favoritlist_productfavoritId_fkey" FOREIGN KEY ("productfavoritId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
