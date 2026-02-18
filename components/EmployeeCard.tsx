
import React from 'react';
import { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onExit: (id: string) => void;
  isCurrentUser: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onExit, isCurrentUser }) => {
  const exitTime = employee.leftAt ? new Date(employee.leftAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) : '-';

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${
      employee.isLeft 
        ? 'bg-slate-50 border-slate-200 opacity-60' 
        : 'bg-white border-blue-100 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
            employee.isLeft ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'
          }`}>
            {employee.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{employee.name}</h3>
            <p className="text-xs text-slate-500">{employee.department}</p>
          </div>
        </div>
        {isCurrentUser && !employee.isLeft && (
          <button
            onClick={() => onExit(employee.id)}
            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            퇴근하기
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Status</span>
          <span className={`text-sm font-medium ${employee.isLeft ? 'text-slate-500' : 'text-emerald-500'}`}>
            {employee.isLeft ? '퇴근완료' : '업무중'}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Exit Time</span>
          <span className="text-sm font-medium text-slate-700">{exitTime}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
