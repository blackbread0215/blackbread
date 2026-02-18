
import React, { useState, useEffect, useCallback } from 'react';
import { Employee, Department } from './types';
import { INITIAL_EMPLOYEES, DEPARTMENTS } from './constants';
import { getKSTDateString, formatKSTTime } from './utils/timeUtils';
import DepartmentGroup from './components/DepartmentGroup';
import { getDailyGreeting } from './services/geminiService';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentKSTTime, setCurrentKSTTime] = useState<string>('');
  const [aiGreeting, setAiGreeting] = useState<string>('로딩 중...');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Initialize data and handle Daily Reset logic
  useEffect(() => {
    const today = getKSTDateString();
    const storedData = localStorage.getItem('kwork_exit_data');
    const storedDate = localStorage.getItem('kwork_last_reset_date');

    if (storedDate !== today) {
      // New day (KST) - reset all
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('kwork_exit_data', JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem('kwork_last_reset_date', today);
    } else if (storedData) {
      setEmployees(JSON.parse(storedData));
    } else {
      setEmployees(INITIAL_EMPLOYEES);
    }

    // Set a dummy current user for demo purposes (e.g., 'Park Ji-sung' in Dev)
    setCurrentUserId('d1');

    // Update clock every second
    const timer = setInterval(() => {
      setCurrentKSTTime(formatKSTTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch AI Insight when employee counts change
  useEffect(() => {
    if (employees.length === 0) return;
    
    const fetchGreeting = async () => {
      const leftCount = employees.filter(e => e.isLeft).length;
      const greeting = await getDailyGreeting(leftCount, employees.length);
      setAiGreeting(greeting);
    };

    fetchGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees.filter(e => e.isLeft).length]);

  const handleExit = useCallback((id: string) => {
    setEmployees(prev => {
      const updated = prev.map(emp => {
        if (emp.id === id) {
          return { ...emp, isLeft: true, leftAt: new Date().toISOString() };
        }
        return emp;
      });
      localStorage.setItem('kwork_exit_data', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const totalEmployees = employees.length;
  const totalLeft = employees.filter(e => e.isLeft).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-blue-200 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">K-Work Exit Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">Daily Sync: Asia/Seoul (KST)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current KST</p>
              <p className="text-lg font-mono font-bold text-blue-600 leading-none">{currentKSTTime}</p>
            </div>
            {currentUserId && (
              <div className="pl-6 border-l border-slate-200 hidden md:block">
                 <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                 <p className="text-sm font-semibold">{employees.find(e => e.id === currentUserId)?.name}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Summary & AI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Progress</h2>
               <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                 {Math.round((totalLeft / totalEmployees) * 100)}%
               </span>
             </div>
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-800">{totalLeft}</span>
                <span className="text-xl font-medium text-slate-400">/ {totalEmployees}</span>
             </div>
             <p className="text-sm text-slate-500 mt-2">퇴근한 직원 수</p>
             <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-1000" 
                  style={{ width: `${(totalLeft / totalEmployees) * 100}%` }}
                />
             </div>
          </div>

          <div className="lg:col-span-2 bg-blue-600 p-6 rounded-2xl shadow-xl shadow-blue-100 relative overflow-hidden flex flex-col justify-center">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold tracking-tight">AI Work-Life Balance Insight</h3>
              </div>
              <p className="text-blue-50 leading-relaxed text-lg font-medium italic">
                "{aiGreeting}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-blue-200 font-medium">
                <span className="px-2 py-1 bg-white/10 rounded-md">Powered by Gemini AI</span>
                <span>•</span>
                <span>실시간 퇴근 현황 기반 조언</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Sections */}
        {DEPARTMENTS.map(dept => {
          const deptEmployees = employees.filter(e => e.department === dept);
          if (deptEmployees.length === 0) return null;
          return (
            <DepartmentGroup 
              key={dept} 
              department={dept} 
              employees={deptEmployees} 
              onExit={handleExit}
              currentUserId={currentUserId}
            />
          );
        })}
      </main>

      {/* Floating Personal Action Bar (For Mobile/UX) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                 {employees.find(e => e.id === currentUserId)?.name.charAt(0)}
              </div>
              <div>
                 <p className="text-xs text-slate-400 font-medium">My Status</p>
                 <p className="text-sm font-bold text-white">
                   {employees.find(e => e.id === currentUserId)?.isLeft ? '오늘 업무 종료 ✅' : '아직 업무 중 💻'}
                 </p>
              </div>
           </div>
           {!employees.find(e => e.id === currentUserId)?.isLeft && (
             <button 
               onClick={() => handleExit(currentUserId!)}
               className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
             >
               지금 바로 퇴근
             </button>
           )}
           {employees.find(e => e.id === currentUserId)?.isLeft && (
             <div className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                수고하셨습니다!
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default App;
