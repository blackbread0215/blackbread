
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Employee, Department } from './types';
import { INITIAL_EMPLOYEES, DEPARTMENTS } from './constants';
import { getKSTDateString, formatKSTTime } from './utils/timeUtils';
import DepartmentGroup from './components/DepartmentGroup';
import { getDailyGreeting } from './services/geminiService';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentKSTTime, setCurrentKSTTime] = useState<string>('');
  const [aiGreeting, setAiGreeting] = useState<string>('오늘의 퇴근 현황을 분석 중입니다...');
  const [currentUserId, setCurrentUserId] = useState<string | null>(localStorage.getItem('kwork_user_id'));
  const [showSelector, setShowSelector] = useState<boolean>(!localStorage.getItem('kwork_user_id'));

  // 초기 데이터 로드 및 KST 리셋 로직
  useEffect(() => {
    const today = getKSTDateString();
    const storedData = localStorage.getItem('kwork_exit_data');
    const storedDate = localStorage.getItem('kwork_last_reset_date');

    if (storedDate !== today) {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('kwork_exit_data', JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem('kwork_last_reset_date', today);
    } else if (storedData) {
      setEmployees(JSON.parse(storedData));
    } else {
      setEmployees(INITIAL_EMPLOYEES);
    }

    const timer = setInterval(() => {
      setCurrentKSTTime(formatKSTTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // AI 인사이트 업데이트
  useEffect(() => {
    if (employees.length === 0) return;
    const fetchGreeting = async () => {
      const leftCount = employees.filter(e => e.isLeft).length;
      const greeting = await getDailyGreeting(leftCount, employees.length);
      setAiGreeting(greeting);
    };
    fetchGreeting();
  }, [employees.filter(e => e.isLeft).length, employees.length]);

  const handleSelectUser = (id: string) => {
    setCurrentUserId(id);
    localStorage.setItem('kwork_user_id', id);
    setShowSelector(false);
  };

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
  const currentUser = useMemo(() => employees.find(e => e.id === currentUserId), [employees, currentUserId]);

  if (showSelector) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 overflow-hidden">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">안녕하세요! 👋</h2>
          <p className="text-slate-500 mb-8">본인의 이름을 선택하여 대시보드를 시작하세요.</p>
          
          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="mb-6">
                <h3 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wider">{dept}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {employees.filter(e => e.department === dept).map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => handleSelectUser(emp.id)}
                      className="p-3 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
                    >
                      <span className="block font-semibold text-slate-700 group-hover:text-blue-700">{emp.name}</span>
                      <span className="text-[10px] text-slate-400">{emp.isLeft ? '이미 퇴근함' : '업무 중'}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">퇴근합시다</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">K-Work Life Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">KST Time</p>
              <p className="text-xl font-mono font-black text-blue-600 leading-none">{currentKSTTime}</p>
            </div>
            <button 
              onClick={() => setShowSelector(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                {currentUser?.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">{currentUser?.name}님</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 요약 카드 및 AI 인사이트 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Exit Progress</h2>
               <div className="flex h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600" style={{ width: `${(totalLeft / totalEmployees) * 100}%` }} />
               </div>
             </div>
             <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-black text-slate-800 tabular-nums">{totalLeft}</span>
                <span className="text-2xl font-bold text-slate-300">/ {totalEmployees}</span>
             </div>
             <p className="text-sm font-semibold text-slate-500 uppercase">직원 퇴근 완료</p>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-blue-700 to-indigo-900 p-8 rounded-[2rem] shadow-2xl shadow-blue-200 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">AI Coach</span>
              </div>
              <p className="text-white text-xl sm:text-2xl font-bold leading-tight mb-4">
                "{aiGreeting}"
              </p>
              <p className="text-blue-200/60 text-xs font-medium">실시간 데이터 분석을 통한 오늘의 워라밸 가이드</p>
            </div>
          </div>
        </div>

        {/* 부서별 섹션 */}
        <div className="space-y-12">
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
        </div>
      </main>

      {/* 하단 플로팅 액션 바 */}
      {currentUser && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40">
          <div className="bg-slate-900/95 backdrop-blur-2xl p-5 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center justify-between ring-1 ring-black/5">
             <div className="flex items-center gap-4 ml-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-inner">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${currentUser.isLeft ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">My Status</p>
                   <p className="text-base font-black text-white leading-none">
                     {currentUser.isLeft ? '업무 종료' : '업무 중'}
                   </p>
                </div>
             </div>
             
             {!currentUser.isLeft ? (
               <button 
                 onClick={() => handleExit(currentUser.id)}
                 className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black transition-all transform active:scale-95 shadow-xl shadow-blue-500/40 flex items-center gap-2"
               >
                 <span>퇴근하기</span>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
               </button>
             ) : (
               <div className="px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-[1.5rem] font-black text-sm">
                  오늘도 고생 많으셨어요! ✨
               </div>
             )}
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default App;
