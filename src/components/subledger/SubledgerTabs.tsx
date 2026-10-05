import React from 'react';
import { Building2, FileText, Truck } from 'lucide-react';
import { SubledgerType, SUBLEDGER_TABS, SUBLEDGER_CONFIG } from '../../types/subledger';
import { useSubledgerStore } from '../../stores/subledgerStore';

interface SubledgerTabsProps {
  activeTab: SubledgerType;
  onTabChange: (tab: SubledgerType) => void;
}

const TAB_ICONS: Record<SubledgerType, React.ElementType> = {
  'cost-center': Building2,
  'reference-center': FileText,
  vehicle: Truck,
};

export const SubledgerTabs: React.FC<SubledgerTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const entries = useSubledgerStore((state) => state.entries);
  const loading = useSubledgerStore((state) => state.loading);

  const getCount = (type: SubledgerType) => {
    if (loading) return '—';
    return entries.filter((e) => e.type === type).length;
  };

  return (
    <div className="w-full border-b border-slate-200">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
        {SUBLEDGER_TABS.map((tabKey) => {
          const config = SUBLEDGER_CONFIG[tabKey];
          const Icon = TAB_ICONS[tabKey];
          const isActive = activeTab === tabKey;
          const count = getCount(tabKey);

          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => onTabChange(tabKey)}
              className={[
                'relative flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
                isActive
                  ? 'text-indigo-700 bg-indigo-50/70 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
              ].join(' ')}
            >
              <Icon
                className={[
                  'size-4 shrink-0 transition-transform duration-200',
                  isActive ? 'text-indigo-600 scale-105' : 'text-slate-400',
                ].join(' ')}
              />
              <span>{config.label}</span>
              <span
                className={[
                  'px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors',
                  isActive
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                {count}
              </span>

              {/* Bottom active indicator */}
              {isActive && (
                <div className="absolute -bottom-[5px] left-2 right-2 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
