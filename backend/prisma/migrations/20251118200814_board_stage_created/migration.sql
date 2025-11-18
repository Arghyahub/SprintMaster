/*
  Warnings:

  - You are about to drop the column `stages` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `stage_idx` on the `Task` table. All the data in the column will be lost.
  - Added the required column `stage_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "stages",
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "stage_idx",
ADD COLUMN     "stage_id" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- CreateTable
CREATE TABLE "BoardStage" (
    "id" SERIAL NOT NULL,
    "board_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BoardStage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardStage_board_id_order_key" ON "BoardStage"("board_id", "order");

-- AddForeignKey
ALTER TABLE "BoardStage" ADD CONSTRAINT "BoardStage_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "BoardStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
