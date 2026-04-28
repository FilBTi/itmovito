/*
  Warnings:

  - The primary key for the `Item` table will be changed.
  - The `id` column is cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey";
ALTER TABLE "Item" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "id" SET DATA TYPE INTEGER;
ALTER TABLE "Item" ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- Recreate sequence for autoincrement
DROP SEQUENCE IF EXISTS "Item_id_seq";
CREATE SEQUENCE "Item_id_seq" OWNED BY "Item"."id";
ALTER TABLE "Item" ALTER COLUMN "id" SET DEFAULT nextval('"Item_id_seq"');
SELECT setval('"Item_id_seq"', COALESCE((SELECT MAX("id") FROM "Item"), 1));
