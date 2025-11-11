/*
  Warnings:

  - Added the required column `for_type` to the `AccessRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessRole" ADD COLUMN     "for_type" "UserTypeEnum" NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();
