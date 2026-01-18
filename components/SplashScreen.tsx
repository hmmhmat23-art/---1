
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="flex flex-col items-center animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]">
        <div className="bg-emerald-600 text-white p-6 rounded-[2rem] shadow-2xl shadow-emerald-900/30 mb-8 transform transition-transform hover:scale-105 duration-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
           </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight text-center mb-4 font-sans">
          أذكار المسلم
        </h1>
        <p className="text-emerald-600 dark:text-emerald-400 text-xl font-medium text-center amiri-font opacity-90">
          "أَلا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
        </p>
      </div>
      
      <div className="absolute bottom-12 w-full flex justify-center opacity-50">
         <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
