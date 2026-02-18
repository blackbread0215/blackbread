
import React from 'react';
import { Department, Employee } from '../types.ts';
import EmployeeCard from './EmployeeCard.tsx';

interface DepartmentGroupProps {
  department: Department;
  employees: Employee[];
  onExit: (id: string) => void;
  currentUserId: string | null;
}

const DepartmentGroup: React.FC<DepartmentGroupProps> = ({ department, employees, onExit, currentUserId }) => {
  const leftCount = employees.filter(e => e.isLeft).length;
  const totalCount = employees.length;
  const progress = (leftCount / totalCount) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
            {department}
          </h2>
          <p className="text-sm text-slate-500">{totalCount}명 중 {leftCount}명 퇴근</p>
        </div>
        <div className="text-right w-1/3">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{Math.round(progress)}% 완료</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map(emp => (
          <EmployeeCard 
            key={emp.id} 
            employee={emp} 
            onExit={onExit} 
            isCurrentUser={emp.id === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentGroup;
