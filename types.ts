
export enum Department {
  MANAGEMENT = '경영지원',
  DEVELOPMENT = '개발',
  DESIGN = '디자인',
  MARKETING = '마케팅',
  SALES = '영업',
  HR = '인사',
  SUPPORT = '고객지원'
}

export interface Employee {
  id: string;
  name: string;
  department: Department;
  leftAt: string | null; // ISO string
  isLeft: boolean;
}

export interface DashboardState {
  employees: Employee[];
  lastResetDate: string; // YYYY-MM-DD in KST
}
