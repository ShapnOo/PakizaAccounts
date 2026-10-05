import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubledgerType, SUBLEDGER_TABS } from '../../types/subledger';
import { useSubledgerStore } from '../../stores/subledgerStore';
import { SubledgerHeader } from '../../components/subledger/SubledgerHeader';
import { SubledgerTabs } from '../../components/subledger/SubledgerTabs';
import { SubledgerTable } from '../../components/subledger/SubledgerTable';

export const SubledgerListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const load = useSubledgerStore((state) => state.load);
  const activeTab = useSubledgerStore((state) => state.activeTab);
  const setActiveTab = useSubledgerStore((state) => state.setActiveTab);

  // Sync tab with URL query parameter ?tab=...
  useEffect(() => {
    const tabParam = searchParams.get('tab') as SubledgerType | null;
    if (tabParam && SUBLEDGER_TABS.includes(tabParam)) {
      if (tabParam !== activeTab) {
        setActiveTab(tabParam);
      }
    } else {
      // Default to cost-center if no valid tab in query
      if (!tabParam) {
        setSearchParams({ tab: activeTab }, { replace: true });
      }
    }
  }, [searchParams, activeTab, setActiveTab, setSearchParams]);

  // Load entries on initial page mount
  useEffect(() => {
    load();
  }, [load]);

  const handleTabChange = (newTab: SubledgerType) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* 1. Header */}
      <SubledgerHeader />

      {/* 2. Tabs Strip */}
      <SubledgerTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* 3. Subledger Tab Content Table */}
      <SubledgerTable type={activeTab} />
    </div>
  );
};

export default SubledgerListPage;
