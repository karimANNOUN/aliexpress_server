-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "properties" TEXT NOT NULL,
    "solde" INTEGER NOT NULL,
    "prixlivraison" INTEGER NOT NULL,
    "templivraison" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "descriptiontitle1" TEXT NOT NULL,
    "descriptiontitle2" TEXT NOT NULL,
    "descriptiontitle3" TEXT NOT NULL,
    "descriptiondetail1" TEXT NOT NULL,
    "descriptiondetail2" TEXT NOT NULL,
    "descriptiondetail3" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_userId_key" ON "Product"("userId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
