-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Banned');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Customer', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "role" "UserRole" NOT NULL DEFAULT 'Customer',
    "pictureId" TEXT,
    "picture" TEXT,
    "address" TEXT,
    "tel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
