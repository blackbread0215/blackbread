
import { Department, Employee } from './types.ts';

export const INITIAL_EMPLOYEES: Employee[] = [
  // 경영지원
  { id: 'm1', name: '김철수', department: Department.MANAGEMENT, leftAt: null, isLeft: false },
  { id: 'm2', name: '이영희', department: Department.MANAGEMENT, leftAt: null, isLeft: false },
  // 개발
  { id: 'd1', name: '박지성', department: Department.DEVELOPMENT, leftAt: null, isLeft: false },
  { id: 'd2', name: '최강개발', department: Department.DEVELOPMENT, leftAt: null, isLeft: false },
  { id: 'd3', name: '이코드', department: Department.DEVELOPMENT, leftAt: null, isLeft: false },
  // 디자인
  { id: 'ds1', name: '정아트', department: Department.DESIGN, leftAt: null, isLeft: false },
  { id: 'ds2', name: '한픽셀', department: Department.DESIGN, leftAt: null, isLeft: false },
  // 마케팅
  { id: 'mk1', name: '조광고', department: Department.MARKETING, leftAt: null, isLeft: false },
  { id: 'mk2', name: '유홍보', department: Department.MARKETING, leftAt: null, isLeft: false },
  // 영업
  { id: 's1', name: '차판매', department: Department.SALES, leftAt: null, isLeft: false },
  { id: 's2', name: '임딜러', department: Department.SALES, leftAt: null, isLeft: false },
  // 인사
  { id: 'h1', name: '송인재', department: Department.HR, leftAt: null, isLeft: false },
  // 고객지원
  { id: 'sup1', name: '나친절', department: Department.SUPPORT, leftAt: null, isLeft: false },
  { id: 'sup2', name: '오케어', department: Department.SUPPORT, leftAt: null, isLeft: false },
];

export const DEPARTMENTS = Object.values(Department);
