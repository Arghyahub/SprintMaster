import UserEntity from "./user-entity";

class CompanyEntity {
  id?: number;
  name: string;
  name_error?: string;
  company_size?: string;
  company_size_error?: string;
  about?: string;
  about_error?: string;
  created_at: string;
  updated_at: string;
  users: UserEntity[];

  constructor() {
    this.id = null;
    this.name = "";
    this.company_size = "";
    this.about = "";
    this.created_at = "";
    this.updated_at = "";
    this.users = [];
  }
}

export default CompanyEntity;
