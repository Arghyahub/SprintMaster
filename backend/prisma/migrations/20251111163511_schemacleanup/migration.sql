/*
  Warnings:

  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBoardRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBoardRelation" DROP CONSTRAINT "UserBoardRelation_board_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBoardRelation" DROP CONSTRAINT "UserBoardRelation_user_id_fkey";

-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- DropTable
DROP TABLE "Board";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "UserBoardRelation";

-- DropEnum
DROP TYPE "BoardTypeEnum";
