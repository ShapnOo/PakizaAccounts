import React, { useEffect, useState } from 'react';
import { useCurrencyStore } from '../../stores/currencyStore';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { CurrencyPageHeader } from '../../components/currency/CurrencyPageHeader';
import { RateTable } from '../../components/currency/RateTable';
import { RateHistoryDrawer } from '../../components/currency/RateHistoryDrawer';
import { CurrencySetupModal } from '../../components/currency/CurrencySetupModal';
import { UpdateRateModal } from '../../components/currency/UpdateRateModal';
import { BulkRateUploadModal } from '../../components/currency/BulkRateUploadModal';

export const ExchangeRateListPage: React.FC = () => {
  const {
    setups,
    rates,
    loading,
    load,
    upsertRate,
    bulkUpsertRates,
    setBase,
    deleteSetup,
  } = useCurrencyStore();

  const [historyTarget, setHistoryTarget] = useState<CurrencySetup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencySetup | null>(null);
  const [rateModalTarget, setRateModalTarget] = useState<{
    setup: CurrencySetup;
    rate?: ExchangeRate;
  } | null>(null);

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
        onOpenBulkUpload={() => setIsBulkModalOpen(true)}
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
        onOpenRateModal={(setup, rate) => setRateModalTarget({ setup, rate })}
        onOpenBulkUpload={() => setIsBulkModalOpen(true)}
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

      {/* ── Update Exchange Rate Modal ── */}
      <UpdateRateModal
        isOpen={Boolean(rateModalTarget)}
        onClose={() => setRateModalTarget(null)}
        setup={rateModalTarget?.setup || null}
        rate={rateModalTarget?.rate}
        onSave={upsertRate}
      />

      {/* ── Bulk Rate Upload / Update Modal with Template ── */}
      <BulkRateUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        setups={setups}
        rates={rates}
        onBulkUpdate={bulkUpsertRates}
      />
    </div>
  );
};

export default ExchangeRateListPage;

