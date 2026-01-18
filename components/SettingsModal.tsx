
import React from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  
  const getFontSizeClass = (size: 'small' | 'medium' | 'large') => {
    switch(size) {
      case 'small': return 'text-lg';
      case 'large': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-xl font-bold">الإعدادات</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Theme Toggle */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">المظهر</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => onUpdate({ ...settings, theme: 'light' })}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'light'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <span>نهاري</span>
              </button>
              <button
                onClick={() => onUpdate({ ...settings, theme: 'dark' })}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>ليلي</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">حجم الخط</label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdate({ ...settings, fontSize: size })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    settings.fontSize === size 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : 'كبير'}
                </button>
              ))}
            </div>

            {/* Font Preview */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
              <p className="text-xs text-slate-500 mb-4">معاينة النص:</p>
              <p className={`amiri-font text-slate-800 dark:text-slate-200 ${getFontSizeClass(settings.fontSize)} leading-relaxed transition-all duration-300`}>
                أَلا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
              </p>
            </div>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">الاهتزاز عند التسبيح</label>
              <p className="text-xs text-slate-500">تنبيه لمسي عند الضغط على العداد</p>
            </div>
            <button
              onClick={() => onUpdate({ ...settings, hapticFeedback: !settings.hapticFeedback })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.hapticFeedback ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.hapticFeedback ? 'right-7' : 'right-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <button
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
