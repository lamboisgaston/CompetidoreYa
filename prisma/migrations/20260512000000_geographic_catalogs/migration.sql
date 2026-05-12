-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN "countryId" TEXT;

-- AlterTable
ALTER TABLE "City" ADD COLUMN "countryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- Backfill City.countryId with Argentina when missing
INSERT INTO "Country" ("id", "name", "createdAt")
SELECT 'cmgeoargentina000000000000', 'Argentina', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Country" WHERE "name" = 'Argentina');

UPDATE "City"
SET "countryId" = (SELECT "id" FROM "Country" WHERE "name" = 'Argentina')
WHERE "countryId" IS NULL;

-- Set not null for City.countryId
ALTER TABLE "City" ALTER COLUMN "countryId" SET NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "City_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "City_countryId_name_key" ON "City"("countryId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
