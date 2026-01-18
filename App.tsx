
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AthkarType, Thikr, UserProgress, Settings } from './types';
import { MORNING_ATHKAR, EVENING_ATHKAR } from './constants';
import ThikrCard from './components/ThikrCard';
import SettingsModal from './components/SettingsModal';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<AthkarType>(AthkarType.MORNING);
  const [progress, setProgress] = useState<UserProgress>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Initialize settings from localStorage immediately to prevent theme flicker
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof localStorage !== 'undefined') {
        const savedSettings = localStorage.getItem('athkar_settings_v6');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        // Migration logic for older versions
        const oldSettings = localStorage.getItem('athkar_settings_v5');
        if (oldSettings) {
            const parsed = JSON.parse(oldSettings);
            return {
                fontSize: parsed.fontSize || 'medium',
                hapticFeedback: parsed.hapticFeedback ?? false,
                theme: 'dark'
            };
        }
    }
    return {
        fontSize: 'medium',
        hapticFeedback: false,
        theme: 'dark'
    };
  });
  
  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 2500); // Show splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Apply theme class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Load progress (we keep this in useEffect as it doesn't affect initial visual layout much)
  useEffect(() => {
    const savedProgress = localStorage.getItem('athkar_progress_v6');
    if (!savedProgress) {
        const oldProgress = localStorage.getItem('athkar_progress_v5');
        if (oldProgress) setProgress(JSON.parse(oldProgress));
    } else {
        setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress and settings whenever they change
  useEffect(() => {
    localStorage.setItem('athkar_progress_v6', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('athkar_settings_v6', JSON.stringify(settings));
  }, [settings]);

  const activeAthkar = useMemo(() => {
    return activeTab === AthkarType.MORNING ? MORNING_ATHKAR : EVENING_ATHKAR;
  }, [activeTab]);

  const triggerHaptic = useCallback(() => {
    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        // Use an array and slightly longer duration (70ms) to ensure it registers on more devices
        navigator.vibrate([70]);
      } catch (e) {
        console.error('Haptic feedback failed:', e);
      }
    }
  }, [settings.hapticFeedback]);

  const handleIncrement = useCallback((id: string) => {
    triggerHaptic();
    
    setProgress(prev => {
      const current = prev[id] || 0;
      const thikr = activeAthkar.find(a => a.id === id);
      if (thikr && current < thikr.count) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  }, [activeAthkar, triggerHaptic]);

  const handleResetThikr = useCallback((id: string) => {
    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
       navigator.vibrate([30]);
    }
    setProgress(prev => ({
      ...prev,
      [id]: 0
    }));
  }, [settings.hapticFeedback]);

  const handleResetAll = useCallback(() => {
    const targetList = activeTab === AthkarType.MORNING ? MORNING_ATHKAR : EVENING_ATHKAR;
    
    setProgress(prev => {
      const next = { ...prev };
      targetList.forEach(thikr => {
        delete next[thikr.id];
      });
      return next;
    });

    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
       navigator.vibrate([50, 50, 50]);
    }
  }, [activeTab, settings.hapticFeedback]);

  const totalProgress = useMemo(() => {
    // Calculate progress based on completed items rather than total counts
    const completedCount = activeAthkar.filter(thikr => (progress[thikr.id] || 0) >= thikr.count).length;
    const totalCount = activeAthkar.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  }, [activeAthkar, progress]);

  if (showSplash) {
      return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 transition-colors duration-300">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-2xl shadow-lg shadow-emerald-900/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">أذكار المسلم</h1>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 max-w-xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 text-slate-900 dark:text-white shadow-xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">السلام عليكم</h2>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-6">"ألا بذكر الله تطمئن القلوب"</p>
            
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>إنجازك اليومي</span>
                <span className="text-emerald-600 dark:text-emerald-400">{totalProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-xl mx-auto px-4 mb-6 sticky top-[73px] z-30">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-lg flex gap-1 transition-colors duration-300">
          <button 
            onClick={() => setActiveTab(AthkarType.MORNING)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === AthkarType.MORNING 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            أذكار الصباح
          </button>
          <button 
            onClick={() => setActiveTab(AthkarType.EVENING)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === AthkarType.EVENING 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            أذكار المساء
          </button>
        </div>
      </div>

      {/* Athkar List */}
      <main className="max-w-xl mx-auto px-4 space-y-4">
        {activeAthkar.map((thikr) => (
          <ThikrCard 
            key={thikr.id}
            thikr={thikr}
            currentCount={progress[thikr.id] || 0}
            onIncrement={handleIncrement}
            onResetThikr={handleResetThikr}
            fontSize={settings.fontSize}
          />
        ))}

        <div className="pt-8 mb-12">
           <button 
            onClick={handleResetAll}
            className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            تصفير أذكار {activeTab === AthkarType.MORNING ? 'الصباح' : 'المساء'}
          </button>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Sticky Quick Access */}
      <nav className="fixed bottom-6 left-4 right-4 z-40 max-w-xl mx-auto flex justify-center pointer-events-none">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 rounded-full shadow-2xl flex gap-2 pointer-events-auto ring-1 ring-slate-200 dark:ring-slate-800 transition-colors duration-300">
              <button 
                onClick={() => setActiveTab(AthkarType.MORNING)}
                className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AthkarType.MORNING ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </button>
              <button 
                onClick={() => setActiveTab(AthkarType.EVENING)}
                className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AthkarType.EVENING ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
          </div>
      </nav>
    </div>
  );
};

export default App;
