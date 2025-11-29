import CompanyEntity from "./company-entity";
import RoleEntity from "./role-entity";

export type UserTypeEntity = "admin" | "owner" | "employee" | "super_admin";

class UserEntity {
  id: number;
  name: string;
  name_error?: string;
  email: string;
  email_error?: string;
  password?: string;
  password_error?: string;
  user_type: UserTypeEntity;
  user_type_error?: string;
  access_role_id?: number;
  access_role_id_error?: string;
  access_role: RoleEntity;
  company_id?: number;
  company_id_error?: string;
  company?: CompanyEntity;

  constructor() {
    this.id = null;
    this.name = "";
    this.email = "";
    this.password = "";
    this.user_type = "employee";
    this.access_role_id = null;
    this.access_role = null;
    this.access_role_id_error = "";
  }
}

export default UserEntity;
