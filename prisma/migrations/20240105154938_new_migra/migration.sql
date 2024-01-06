-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "properties" DROP NOT NULL,
ALTER COLUMN "solde" DROP NOT NULL,
ALTER COLUMN "prixlivraison" DROP NOT NULL,
ALTER COLUMN "templivraison" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "category" SET DATA TYPE TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "descriptiontitle1" DROP NOT NULL,
ALTER COLUMN "descriptiontitle2" DROP NOT NULL,
ALTER COLUMN "descriptiontitle3" DROP NOT NULL,
ALTER COLUMN "descriptiondetail1" DROP NOT NULL,
ALTER COLUMN "descriptiondetail2" DROP NOT NULL,
ALTER COLUMN "descriptiondetail3" DROP NOT NULL;
