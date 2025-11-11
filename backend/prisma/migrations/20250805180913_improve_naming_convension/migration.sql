/*
  Warnings:

  - You are about to drop the column `updated_by` on the `AccessRole` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessRole" DROP CONSTRAINT "AccessRole_updated_by_fkey";

-- AlterTable
ALTER TABLE "AccessRole" DROP COLUMN "updated_by",
ADD COLUMN     "updated_by_id" INTEGER,
ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AddForeignKey
ALTER TABLE "AccessRole" ADD CONSTRAINT "AccessRole_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
