-- CreateTable
CREATE TABLE "Storeuser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "colorProduct" TEXT,
    "propertyType" TEXT,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Storeuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToStoreuser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Storeuser_userId_key" ON "Storeuser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToStoreuser_AB_unique" ON "_ProductToStoreuser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToStoreuser_B_index" ON "_ProductToStoreuser"("B");

-- AddForeignKey
ALTER TABLE "Storeuser" ADD CONSTRAINT "Storeuser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStoreuser" ADD CONSTRAINT "_ProductToStoreuser_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStoreuser" ADD CONSTRAINT "_ProductToStoreuser_B_fkey" FOREIGN KEY ("B") REFERENCES "Storeuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
