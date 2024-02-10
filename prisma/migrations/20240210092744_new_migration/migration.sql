-- CreateTable
CREATE TABLE "Storepayer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER,
    "priceProduct" INTEGER,
    "priceLivraison" INTEGER,
    "productstoreId" INTEGER NOT NULL,
    "productUserStoreId" INTEGER,

    CONSTRAINT "Storepayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storepayer" ADD CONSTRAINT "Storepayer_productstoreId_fkey" FOREIGN KEY ("productstoreId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
