
import React from 'react';
import { Thikr } from '../types';

interface ThikrCardProps {
  thikr: Thikr;
  currentCount: number;
  onIncrement: (id: string) => void;
  onResetThikr: (id: string) => void;
  fontSize: 'small' | 'medium' | 'large';
}

const ThikrCard: React.FC<ThikrCardProps> = ({ thikr, currentCount, onIncrement, onResetThikr, fontSize }) => {
  const isCompleted = currentCount >= thikr.count;

  const getFontSizeClass = () => {
    switch(fontSize) {
      case 'small': return 'text-lg';
      case 'large': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  return (
    <div 
      className={`relative p-6 mb-4 rounded-3xl transition-all duration-300 border-2 ${
        isCompleted 
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 shadow-sm opacity-90' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {thikr.reference || 'ذكر'}
        </span>
      </div>

      <p className={`amiri-font leading-relaxed mb-6 text-slate-800 dark:text-slate-100 ${getFontSizeClass()} text-center`}>
        {thikr.text}
      </p>

      {thikr.description && (
        <p className="text-center text-emerald-600/80 dark:text-emerald-400/60 text-sm mb-4 italic">
          {thikr.description}
        </p>
      )}

      <div className="flex flex-col items-center gap-4">
        <div className="w-full relative">
          <button
            onClick={() => !isCompleted && onIncrement(thikr.id)}
            disabled={isCompleted}
            className={`w-full py-5 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-[0.98] ${
              isCompleted 
                ? 'bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-900/20' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="text-sm font-medium mb-1 opacity-70">
              {isCompleted ? 'تم بحمد الله' : 'اضغط للتسبيح'}
            </div>
            <div className="text-4xl font-black">
              {isCompleted ? thikr.count : currentCount} / {thikr.count}
            </div>
          </button>

          {/* Reset button inside the counter button area - placed on the right for easier access */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResetThikr(thikr.id);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all hover:bg-slate-200/60 dark:hover:bg-slate-900/60 z-10 active:scale-90"
            aria-label="تصفير هذا الذكر"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            style={{ width: `${(currentCount / thikr.count) * 100}%` }}
          />
        </div>
      </div>

      {isCompleted && (
        <div className="absolute top-2 left-2 text-emerald-500 dark:text-emerald-400 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ThikrCard;
