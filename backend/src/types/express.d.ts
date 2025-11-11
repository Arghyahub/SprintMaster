declare namespace Express {
  export interface Request {
    user: {
      id: any;
      user_type?: any;
    };
    columnFilters?: {
      id: string;
      value: any;
      meta: { text: boolean; eq: boolean; multi: boolean; num: boolean };
    }[];
    sorting?: { id: string; desc: boolean }[];
    pagination?: { pageIndex: number; pageSize: number };
  }
}
