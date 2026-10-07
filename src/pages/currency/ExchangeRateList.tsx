import React, { useEffect, useState } from 'react';
import { useCurrencyStore } from '../../stores/currencyStore';
import { CurrencySetup } from '../../types/currency';
import { CurrencyPageHeader } from '../../components/currency/CurrencyPageHeader';
import { RateTable } from '../../components/currency/RateTable';
import { RateHistoryDrawer } from '../../components/currency/RateHistoryDrawer';
import { CurrencySetupModal } from '../../components/currency/CurrencySetupModal';

export const ExchangeRateListPage: React.FC = () => {
  const { setups, rates, loading, load, upsertRate, setBase, deleteSetup } = useCurrencyStore();

  const [historyTarget, setHistoryTarget] = useState<CurrencySetup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencySetup | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpenNew = () => {
    setEditingCurrency(null);
    setIsModalOpen(true);
  };

  const handleEdit = (setup: CurrencySetup) => {
    setEditingCurrency(setup);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCurrency(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-16">
      {/* ── Page Header Strip with Tabs & Action ── */}
      <CurrencyPageHeader
        showNewButton={true}
        onOpenNew={handleOpenNew}
      />

      {/* ── Rate Table ── */}
      <RateTable
        setups={setups}
        rates={rates}
        loading={loading}
        onUpdateRate={upsertRate}
        onSetBase={setBase}
        onDelete={deleteSetup}
        onOpenHistory={(setup) => setHistoryTarget(setup)}
        onEdit={handleEdit}
      />

      {/* ── Historical Rates Drawer ── */}
      <RateHistoryDrawer
        isOpen={Boolean(historyTarget)}
        onClose={() => setHistoryTarget(null)}
        currency={historyTarget}
      />

      {/* ── Currency Setup Modal (Add / Edit) ── */}
      <CurrencySetupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialCurrency={editingCurrency}
      />
    </div>
  );
};

export default ExchangeRateListPage;

