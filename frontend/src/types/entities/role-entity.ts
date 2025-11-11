import UserEntity, { UserTypeEntity } from "./user-entity";

export type RoleRowType = { access: boolean } & Record<string, boolean>;

export type RoleEntity = Record<number, RoleRowType>;

class AccessRoleEntity {
  id: number;
  name: string;
  is_master: boolean;
  for_type: UserTypeEntity;
  role: RoleEntity;
  created_at?: Date;
  updated_by_id: string;
  updated_by_user?: UserEntity;
  updated_at?: Date;
  users?: string[];

  constructor() {
    this.id = null;
    this.name = "";
    this.is_master = true;
    this.for_type = "employee";
    this.role = {};
    this.created_at = null;
    this.updated_by_id = "";
    this.updated_by_user = undefined;
    this.updated_at = null;
    this.users = [];
  }
}

export default AccessRoleEntity;
