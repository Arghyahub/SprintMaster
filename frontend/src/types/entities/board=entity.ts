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

  constructor() {
    this.is_final = false;
    this.name = "";
    this.tasks = [];
  }
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

  constructor() {
    this.id = null;
    this.name = "";
    this.status = "awaiting";
    this.company_id = null;
    this.tasks = [];
    this.relationUserBoards = [];
    this.boardStages = [];
    this.total_tasks = 0;
    this.pending_tasks = 0;
    this.completed_tasks = 0;
  }
}

export default BoardEntity;
