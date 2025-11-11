import RoleEntity from "./role-entity";

export type UserTypeEntity = "admin" | "owner" | "employee";

class UserEntity {
  id: number;
  name: string;
  email: string;
  password?: string;
  user_type: UserTypeEntity;
  access_role_id: string;
  access_role: RoleEntity;

  constructor() {
    this.id = null;
    this.name = "";
    this.email = "";
    this.password = "";
    this.user_type = "employee";
    this.access_role_id = "";
    this.access_role = null;
  }
}

export default UserEntity;
