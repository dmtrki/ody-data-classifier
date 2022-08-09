/*
  Warnings:

  - You are about to drop the column `isMultiple` on the `row_union_types` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `rows` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `rows` table. All the data in the column will be lost.
  - You are about to drop the `type_detection_cases` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `value` on table `rows` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "type_detection_cases" DROP CONSTRAINT "type_detection_cases_typeId_fkey";

-- AlterTable
ALTER TABLE "enquiries" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "row_union_types" DROP COLUMN "isMultiple";

-- AlterTable
ALTER TABLE "rows" DROP COLUMN "active",
DROP COLUMN "rank",
ALTER COLUMN "value" SET NOT NULL;

-- DropTable
DROP TABLE "type_detection_cases";
