import { VoucherType, VOUCHER_TYPES } from '../../types/presetJournal';

interface PresetTabsProps {
  selectedTab: 'All' | VoucherType;
  onSelectTab: (tab: 'All' | VoucherType) => void;
  counts: Record<string, number>;
}

export function PresetTabs({
  selectedTab,
  onSelectTab,
  counts,
}: PresetTabsProps) {
  const tabs: Array<'All' | VoucherType> = ['All', ...VOUCHER_TYPES];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/50 sidebar-scroll">
      {tabs.map((tab) => {
        const count = tab === 'All' ? counts.all || 0 : counts[tab] || 0;
        const isActive = selectedTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelectTab(tab)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <span>{tab === 'All' ? 'All Presets' : `${tab} Voucher`}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
