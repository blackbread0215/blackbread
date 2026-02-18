
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
  }) : null;

  return (
    <div className={`group p-5 rounded-2xl border-2 transition-all duration-500 ${
      employee.isLeft 
        ? 'bg-slate-50 border-slate-100 opacity-60' 
        : isCurrentUser 
          ? 'bg-white border-blue-600 shadow-xl shadow-blue-100 ring-4 ring-blue-50 scale-[1.02]' 
          : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm ${
            employee.isLeft ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600'
          }`}>
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-lg">{employee.name}</h3>
              {isCurrentUser && <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">Me</span>}
            </div>
            <p className="text-xs text-slate-400 font-bold">{employee.department}</p>
          </div>
        </div>
        
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          employee.isLeft ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-600'
        }`}>
          {employee.isLeft ? 'Out' : 'In'}
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-300 font-black uppercase tracking-tighter mb-1">Check-out Time</span>
          <span className={`text-base font-mono font-bold ${employee.isLeft ? 'text-slate-600' : 'text-slate-200'}`}>
            {exitTime || '--:--'}
          </span>
        </div>
        
        {isCurrentUser && !employee.isLeft && (
          <button
            onClick={() => onExit(employee.id)}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            퇴근
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
