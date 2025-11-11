/*
  Warnings:

  - You are about to drop the `ProjectBoardRelation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_id` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectBoardRelation" DROP CONSTRAINT "ProjectBoardRelation_board_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectBoardRelation" DROP CONSTRAINT "ProjectBoardRelation_project_id_fkey";

-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "project_id" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- DropTable
DROP TABLE "ProjectBoardRelation";

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
