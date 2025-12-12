-- DropIndex
DROP INDEX "BoardStage_board_id_order_key";

-- AlterTable
ALTER TABLE "AccessRole" ALTER COLUMN "is_master" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "BoardStage" ALTER COLUMN "is_final" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();
