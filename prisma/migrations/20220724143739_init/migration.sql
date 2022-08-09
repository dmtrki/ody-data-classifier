-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('ACCEPTED', 'WAITING', 'PROCESSING', 'COMPLETE', 'ERROR');

-- CreateEnum
CREATE TYPE "EnquiryAttemptProducedType" AS ENUM ('CREATE', 'REFRESH', 'GIVE', 'VOID');

-- CreateTable
CREATE TABLE "enquiries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "EnquiryStatus" NOT NULL DEFAULT 'ACCEPTED',
    "meta" JSONB,
    "hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiry_attempts" (
    "id" UUID NOT NULL,
    "produced" "EnquiryAttemptProducedType" NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enquiryId" UUID,

    CONSTRAINT "enquiry_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities" (
    "id" UUID NOT NULL,
    "itn" CHAR(12),
    "insurance" CHAR(11),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personal" JSONB,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rows" (
    "id" UUID NOT NULL,
    "value" TEXT,
    "rank" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "meta" JSONB,
    "enquiryId" UUID,
    "identityId" UUID,
    "typeId" INTEGER NOT NULL,
    "unionId" UUID,

    CONSTRAINT "rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "row_unuions" (
    "id" UUID NOT NULL,
    "hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rowUnionTypeId" INTEGER NOT NULL,

    CONSTRAINT "row_unuions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "row_union_types" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "isMultiple" BOOLEAN NOT NULL DEFAULT false,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "row_union_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "row_types" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "unionId" INTEGER,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "row_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_groups" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "meta" JSONB,

    CONSTRAINT "data_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_detection_cases" (
    "id" UUID NOT NULL,
    "hash" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "type_detection_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnquiryToIdentity" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "enquiries_hash_key" ON "enquiries"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "identities_itn_key" ON "identities"("itn");

-- CreateIndex
CREATE UNIQUE INDEX "identities_insurance_key" ON "identities"("insurance");

-- CreateIndex
CREATE UNIQUE INDEX "rows_hash_key" ON "rows"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "row_unuions_hash_key" ON "row_unuions"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "row_union_types_key_key" ON "row_union_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "row_types_key_key" ON "row_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "data_groups_key_key" ON "data_groups"("key");

-- CreateIndex
CREATE UNIQUE INDEX "type_detection_cases_hash_key" ON "type_detection_cases"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "_EnquiryToIdentity_AB_unique" ON "_EnquiryToIdentity"("A", "B");

-- CreateIndex
CREATE INDEX "_EnquiryToIdentity_B_index" ON "_EnquiryToIdentity"("B");

-- AddForeignKey
ALTER TABLE "enquiry_attempts" ADD CONSTRAINT "enquiry_attempts_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "row_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "row_unuions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "row_unuions" ADD CONSTRAINT "row_unuions_rowUnionTypeId_fkey" FOREIGN KEY ("rowUnionTypeId") REFERENCES "row_union_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "row_union_types" ADD CONSTRAINT "row_union_types_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "data_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "row_types" ADD CONSTRAINT "row_types_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "data_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "row_types" ADD CONSTRAINT "row_types_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "row_union_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "type_detection_cases" ADD CONSTRAINT "type_detection_cases_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "row_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnquiryToIdentity" ADD CONSTRAINT "_EnquiryToIdentity_A_fkey" FOREIGN KEY ("A") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnquiryToIdentity" ADD CONSTRAINT "_EnquiryToIdentity_B_fkey" FOREIGN KEY ("B") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
