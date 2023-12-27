-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "status" TEXT,
    "imageStatus" TEXT,
    "entrepriseType" TEXT,
    "raisonSociale" TEXT,
    "numberSirene" TEXT,
    "certificatEntreprise" TEXT,
    "tvaNumber" TEXT,
    "pays" TEXT,
    "stateEntreprise" TEXT,
    "commune" TEXT,
    "postalCode" TEXT,
    "rueNumber" TEXT,
    "businessManager" TEXT,
    "certificatType" TEXT,
    "certificatNumber" TEXT,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Legalrepresentative" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "completeName" TEXT,
    "nationality" TEXT,
    "nativeCountry" TEXT,
    "birthday" TEXT,
    "pays" TEXT,
    "state" TEXT,
    "commune" TEXT,
    "postalCode" TEXT,
    "certificatResidence" TEXT,

    CONSTRAINT "Legalrepresentative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identity" (
    "id" SERIAL NOT NULL,
    "legalId" INTEGER NOT NULL,
    "identityType" TEXT,
    "imageone" TEXT,
    "imagetow" TEXT,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_sellerId_key" ON "Entreprise"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "Legalrepresentative_sellerId_key" ON "Legalrepresentative"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "Identity_legalId_key" ON "Identity"("legalId");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legalrepresentative" ADD CONSTRAINT "Legalrepresentative_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_legalId_fkey" FOREIGN KEY ("legalId") REFERENCES "Legalrepresentative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
