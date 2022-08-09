/*
  Warnings:

  - You are about to drop the column `insurance` on the `identities` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "identities_insurance_key";

-- AlterTable
ALTER TABLE "identities" DROP COLUMN "insurance";
