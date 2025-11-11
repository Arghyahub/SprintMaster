class CompanyEntity {
  id?: number;
  name: string;
  name_error?: string;
  company_size?: string;
  company_size_error?: string;
  industry?: string;
  industry_error?: string;
  created_at: string;
  updated_at: string;
  users: string;

  constructor() {
    this.id = null;
    this.name = "";
    this.company_size = "";
    this.industry = "";
    this.created_at = "";
    this.updated_at = "";
    this.users = "";
  }
}
