-- CreateTable
CREATE TABLE "Item" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" TEXT,
    "brandName" TEXT,
    "color" TEXT,
    "status" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
