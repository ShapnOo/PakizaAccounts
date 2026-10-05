import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useJournalEntryStore,
  selectFilteredEntries,
} from '../../stores/journalEntryStore';
import { ViewType, VoucherType } from '../../types/journalEntry';
import { ListHeader } from '../../components/journal-entries/ListHeader';
import { Toolbar } from '../../components/journal-entries/Toolbar';
import { AdvancedFilterPanel } from '../../components/journal-entries/AdvancedFilterPanel';
import { ListView } from '../../components/journal-entries/ListView';
import { KanbanView } from '../../components/journal-entries/KanbanView';
import { BarChartView } from '../../components/journal-entries/BarChartView';
import { AttachmentDrawer } from '../../components/journal-entries/AttachmentDrawer';
import { VoucherEntryForm } from '../../components/journal-entries/VoucherEntryForm';

export const JournalEntriesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalVoucherType, setModalVoucherType] = React.useState<VoucherType | null>(null);

  const {
    entries,
    loading,
    viewType,
    setViewType,
    filterRange,
    setFilterRange,
    customFromDate,
    customToDate,
    setCustomDateRange,
    searchQuery,
    setSearchQuery,
    advancedOpen,
    toggleAdvanced,
    advancedFilters,
    setAdvancedFilters,
    resetAdvancedFilters,
    selectedAttachmentVoucher,
    setSelectedAttachmentVoucher,
    loadEntries,
    toggleVoid,
    uploadAttachment,
    deleteAttachment,
  } = useJournalEntryStore();

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Sync URL view param with store
  useEffect(() => {
    const urlView = searchParams.get('view') as ViewType | null;
    if (urlView && ['list', 'kanban', 'bar'].includes(urlView) && urlView !== viewType) {
      setViewType(urlView);
    }
  }, [searchParams, setViewType, viewType]);

  const handleViewTypeChange = (v: ViewType) => {
    setViewType(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v === 'list') {
        next.delete('view');
      } else {
        next.set('view', v);
      }
      return next;
    });
  };

  const filteredEntries = selectFilteredEntries({
    entries,
    loading,
    searchQuery,
    viewType,
    filterRange,
    customFromDate,
    customToDate,
    advancedOpen,
    advancedFilters,
    selectedAttachmentVoucher,
    loadEntries,
    setViewType,
    setFilterRange,
    setCustomDateRange,
    setSearchQuery,
    toggleAdvanced,
    setAdvancedFilters,
    resetAdvancedFilters,
    setSelectedAttachmentVoucher,
    addEntry: useJournalEntryStore.getState().addEntry,
    editEntry: useJournalEntryStore.getState().editEntry,
    toggleVoid: useJournalEntryStore.getState().toggleVoid,
    removeEntry: useJournalEntryStore.getState().removeEntry,
    uploadAttachment: useJournalEntryStore.getState().uploadAttachment,
    deleteAttachment: useJournalEntryStore.getState().deleteAttachment,
  });

  // Compute active filter count
  let activeFilterCount = 0;
  if (advancedFilters.types.length > 0) activeFilterCount++;
  if (advancedFilters.sources.length > 0) activeFilterCount++;
  if (advancedFilters.minAmount || advancedFilters.maxAmount) activeFilterCount++;
  if (advancedFilters.hasAttachmentsOnly) activeFilterCount++;
  if (advancedFilters.voidFilter !== 'all') activeFilterCount++;

  // Export CSV Handler
  const handleExportCsv = () => {
    if (filteredEntries.length === 0) {
      toast.error('No entries to export.');
      return;
    }

    const headers = ['Voucher No', 'Voucher Type', 'Source', 'Date', 'Narration', 'Amount (BDT)', 'Status'];
    const rows = filteredEntries.map((e) => [
      `"${e.voucherNo}"`,
      `"${e.voucherType}"`,
      `"${e.source}"`,
      `"${e.voucherDate}"`,
      `"${(e.narration || '').replace(/"/g, '""')}"`,
      e.amount.toFixed(2),
      `"${e.voided ? 'VOID' : 'ACTIVE'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Journal_Entries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredEntries.length} vouchers to CSV.`);
  };

  const handleToggleVoidConfirm = async (id: string) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    const actionName = target.voided ? 'Restore' : 'Void';
    if (window.confirm(`Are you sure you want to ${actionName} voucher ${target.voucherNo}?`)) {
      await toggleVoid(id);
      toast.success(`Voucher ${target.voucherNo} marked as ${target.voided ? 'active' : 'voided'}.`);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header with modal type trigger */}
      <ListHeader
        totalCount={entries.length}
        onSelectNewType={(type) => setModalVoucherType(type)}
      />

      {/* 2. Toolbar */}
      <Toolbar
        viewType={viewType}
        onViewTypeChange={handleViewTypeChange}
        filterRange={filterRange}
        onFilterRangeChange={setFilterRange}
        customFromDate={customFromDate}
        customToDate={customToDate}
        onCustomDateChange={setCustomDateRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        advancedOpen={advancedOpen}
        onToggleAdvanced={toggleAdvanced}
        activeFilterCount={activeFilterCount}
        onExportCsv={handleExportCsv}
      />

      {/* 3. Advanced Filter Collapsible Panel */}
      {advancedOpen && (
        <AdvancedFilterPanel
          filters={advancedFilters}
          onChange={setAdvancedFilters}
          onReset={resetAdvancedFilters}
        />
      )}

      {/* 4. Active View Switcher */}
      {viewType === 'list' && (
        <ListView
          entries={filteredEntries}
          onOpenAttachment={(v) => setSelectedAttachmentVoucher(v)}
          onToggleVoid={handleToggleVoidConfirm}
        />
      )}

      {viewType === 'kanban' && (
        <KanbanView
          entries={filteredEntries}
          onOpenAttachment={(v) => setSelectedAttachmentVoucher(v)}
          onToggleVoid={handleToggleVoidConfirm}
        />
      )}

      {viewType === 'bar' && (
        <BarChartView
          entries={filteredEntries}
          onSelectType={(type) => {
            setAdvancedFilters({ types: [type] });
            if (!advancedOpen) toggleAdvanced();
            handleViewTypeChange('list');
          }}
        />
      )}

      {/* 5. Attachment Drawer */}
      <AttachmentDrawer
        voucher={selectedAttachmentVoucher}
        onClose={() => setSelectedAttachmentVoucher(null)}
        onUpload={uploadAttachment}
        onDelete={deleteAttachment}
      />

      {/* 6. New Voucher Interactive Modal Dialog */}
      {modalVoucherType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalVoucherType(null);
            }
          }}
        >
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-background border border-border shadow-2xl p-4 sm:p-6 relative animate-in zoom-in-95 duration-200">
            <VoucherEntryForm
              voucherType={modalVoucherType}
              isModal={true}
              onClose={() => setModalVoucherType(null)}
              onSuccess={() => {
                setModalVoucherType(null);
                loadEntries();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
