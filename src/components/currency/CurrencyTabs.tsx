import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Sliders } from 'lucide-react';

export const CurrencyTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSetupForm = location.pathname.includes('/currency-setup/new') || location.pathname.includes('/edit');

  return (
    <div className="inline-flex p-1 bg-slate-100 dark:bg-muted/50 rounded-xl border border-border/80 shadow-2xs">
      <button
        type="button"
        onClick={() => navigate('/currency-setup')}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          !isSetupForm
            ? 'bg-white dark:bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
        }`}
      >
        <TrendingUp className="size-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Exchange Rates</span>
      </button>

      <button
        type="button"
        onClick={() => navigate('/currency-setup/new')}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          isSetupForm
            ? 'bg-white dark:bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
        }`}
      >
        <Sliders className="size-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Currency Setup</span>
      </button>
    </div>
  );
};
