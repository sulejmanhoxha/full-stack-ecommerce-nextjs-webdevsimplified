-- AlterTable
ALTER TABLE "DiscountCode" ADD COLUMN     "limit" INTEGER,
ALTER COLUMN "expiresAt" DROP NOT NULL;
