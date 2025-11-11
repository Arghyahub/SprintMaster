/*
  Warnings:

  - The values [owner] on the enum `UserTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserTypeEnum_new" AS ENUM ('admin', 'manager', 'employee');
ALTER TABLE "User" ALTER COLUMN "user_type" TYPE "UserTypeEnum_new" USING ("user_type"::text::"UserTypeEnum_new");
ALTER TABLE "AccessRole" ALTER COLUMN "for_type" TYPE "UserTypeEnum_new" USING ("for_type"::text::"UserTypeEnum_new");
ALTER TYPE "UserTypeEnum" RENAME TO "UserTypeEnum_old";
ALTER TYPE "UserTypeEnum_new" RENAME TO "UserTypeEnum";
DROP TYPE "UserTypeEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();
