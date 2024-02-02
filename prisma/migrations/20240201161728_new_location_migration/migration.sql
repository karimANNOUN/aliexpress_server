-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "country" TEXT,
    "rueAdress" TEXT,
    "postalCode" TEXT,
    "phoneNumber" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_userId_key" ON "Location"("userId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
