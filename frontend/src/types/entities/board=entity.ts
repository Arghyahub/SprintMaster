import CompanyEntity from "./company-entity";
import TaskEntity from "./task-entity";
import UserEntity from "./user-entity";

type BoardStatus = "awaiting" | "in_progress" | "complete";

export class BoardStageEntity {
  id: number;
  board_id: number;
  order: number;
  is_final: boolean;
  name: string;
  board?: BoardEntity;
  tasks: TaskEntity[];
}

class BoardEntity {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  status: BoardStatus;
  company_id: number;
  company: CompanyEntity;
  created_at: Date;
  updated_by_id: number;
  updated_by_user?: UserEntity;
  updated_at: Date;
  tasks: TaskEntity[];
  relationUserBoards?: {
    id: number;
    user_id: number;
    board_id: number;
    user: UserEntity;
  }[];
  boardStages?: BoardStageEntity[];
  total_tasks?: number;
  pending_tasks?: number;
  completed_tasks?: number;
}

export default BoardEntity;
