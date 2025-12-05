import BoardEntity, { BoardStageEntity } from "./board=entity";
import UserEntity from "./user-entity";

class TaskEntity {
  id: number;
  name: string;
  name_error: string;
  description: string;
  stage_id: number;
  board_stage: BoardStageEntity;
  start_date?: Date;
  start_date_error?: string;
  end_date?: Date;
  end_date_error?: string;
  board_id: number;
  board: BoardEntity;
  assigned_to_id?: number;
  assigned_to_user?: UserEntity;
  created_at: Date;
  updated_at: Date;
  created_by_id: number;
  created_by_user?: UserEntity;
  updated_by_id: number;
  updated_by_user: UserEntity;

  constructor() {
    this.name = "";
    this.description = "";
    this.name_error = "";
    this.start_date_error = "";
    this.end_date_error = "";
  }
}

export default TaskEntity;
