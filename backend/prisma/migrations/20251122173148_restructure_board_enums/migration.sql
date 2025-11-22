/*
  Warnings:

  - The values [awaiting] on the enum `BoardStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BoardStatus_new" AS ENUM ('upcoming', 'in_progress', 'complete');
ALTER TABLE "Board" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Board" ALTER COLUMN "status" TYPE "BoardStatus_new" USING ("status"::text::"BoardStatus_new");
ALTER TYPE "BoardStatus" RENAME TO "BoardStatus_old";
ALTER TYPE "BoardStatus_new" RENAME TO "BoardStatus";
DROP TYPE "BoardStatus_old";
ALTER TABLE "Board" ALTER COLUMN "status" SET DEFAULT 'upcoming';
COMMIT;

-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "status" SET DEFAULT 'upcoming',
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "BoardStage" ALTER COLUMN "is_final" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- DropEnum
DROP TYPE "BoardForType";
