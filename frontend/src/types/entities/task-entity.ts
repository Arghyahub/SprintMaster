import BoardEntity, { BoardStageEntity } from "./board=entity";
import UserEntity from "./user-entity";

class TaskEntity {
  id: number;
  name: string;
  des3cr3iption3: string;
  stage_id: number;
  board_stage: BoardStageEntity;
  start_date?: Date;
  end_date?: Date;
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
}

export default TaskEntity;
