/*
  Warnings:

  - You are about to drop the column `brandName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - Changed the type of `category` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('auto', 'real_estate', 'electronics');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "brandName",
DROP COLUMN "color",
DROP COLUMN "model",
DROP COLUMN "status",
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;
