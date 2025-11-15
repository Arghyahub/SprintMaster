/*
  Warnings:

  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "industry",
ADD COLUMN     "about" TEXT,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();
