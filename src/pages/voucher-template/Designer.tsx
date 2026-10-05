import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VoucherType } from '../../types/voucherTemplate';
import { useVoucherTemplateStore } from '../../stores/voucherTemplateStore';
import { DesignerTopBar } from '../../components/voucher-template/DesignerTopBar';
import { VoucherTypeSelector } from '../../components/voucher-template/VoucherTypeSelector';
import { TemplatePropertiesPanel } from '../../components/voucher-template/TemplatePropertiesPanel';
import { ChangesPreviewPanel } from '../../components/voucher-template/ChangesPreviewPanel';
import { ResetConfirmDialog } from '../../components/voucher-template/ResetConfirmDialog';
import { UnsavedChangesDialog } from '../../components/voucher-template/UnsavedChangesDialog';
import { TableSkeleton } from '../../components/custom-fields/TableSkeleton';

const VALID_TYPES: VoucherType[] = ['Journal', 'Payment', 'Receive', 'Contra'];

export const VoucherTemplateDesignerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    activeType,
    templates,
    company,
    previewLines,
    loading,
    dirty,
    livePreviewEnabled,
    zoom,
    setActiveType,
    updateActive,
    toggleColumnVisibility,
    updateColumnLabel,
    reorderColumns,
    setLivePreviewEnabled,
    setZoom,
    save,
    reset,
    load,
  } = useVoucherTemplateStore();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingType, setPendingType] = useState<VoucherType | null>(null);
  const [isVoucherTypeCollapsed, setIsVoucherTypeCollapsed] = useState(false);

  // Mobile / tablet view toggle (Properties vs Preview)
  const [activeMobileTab, setActiveMobileTab] = useState<'properties' | 'preview'>('properties');

  useEffect(() => {
    load();
  }, [load]);

  // Sync URL query param `?type=` with store
  useEffect(() => {
    const typeParam = searchParams.get('type') as VoucherType | null;
    if (typeParam && VALID_TYPES.includes(typeParam) && typeParam !== activeType) {
      setActiveType(typeParam);
    }
  }, [searchParams, activeType, setActiveType]);

  const currentTemplate = templates[activeType];

  const handleSelectType = (targetType: VoucherType) => {
    if (targetType === activeType) return;

    if (dirty) {
      setPendingType(targetType);
      setUnsavedDialogOpen(true);
      return;
    }

    setActiveType(targetType);
    setSearchParams({ type: targetType });
  };

  const handleDiscardAndSwitch = () => {
    if (pendingType) {
      setActiveType(pendingType);
      setSearchParams({ type: pendingType });
      setPendingType(null);
      setUnsavedDialogOpen(false);
    }
  };

  const handleSaveAndSwitch = async () => {
    if (pendingType) {
      await save();
      setActiveType(pendingType);
      setSearchParams({ type: pendingType });
      setPendingType(null);
      setUnsavedDialogOpen(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-20">
      {/* ── Top Bar (Spans all 3 panels) ── */}
      <DesignerTopBar
        activeType={activeType}
        dirty={dirty}
        livePreviewEnabled={livePreviewEnabled}
        onToggleLivePreview={() => setLivePreviewEnabled(!livePreviewEnabled)}
        onSave={save}
        onReset={() => setResetDialogOpen(true)}
      />

      {/* ── Mobile Tab Strip (<1024px) ── */}
      <div className="lg:hidden flex items-center justify-between gap-2 bg-card p-1.5 rounded-xl border border-border/80 shadow-2xs">
        {/* Horizontal Type Pills */}
        <div className="flex items-center gap-1 overflow-x-auto sidebar-scroll">
          {VALID_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleSelectType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeType === t
                  ? 'bg-indigo-600 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* View Switcher: Properties vs Preview */}
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMobileTab('properties')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeMobileTab === 'properties'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground'
            }`}
          >
            Properties
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeMobileTab === 'preview'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* ── 3-Panel Designer Layout Container ── */}
      <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-sm flex flex-col lg:flex-row h-[calc(100vh-210px)] min-h-[640px]">
        {loading || !currentTemplate ? (
          <div className="p-8 w-full">
            <TableSkeleton rows={6} />
          </div>
        ) : (
          <>
            {/* ── Panel A: Voucher Type Selector (Desktop ≥1024px) ── */}
            <div
              className={`hidden lg:block shrink-0 h-full overflow-y-auto sidebar-scroll transition-all duration-200 ${
                isVoucherTypeCollapsed ? 'w-14' : 'w-48 xl:w-56'
              }`}
            >
              <VoucherTypeSelector
                activeType={activeType}
                onSelectType={handleSelectType}
                dirtyTypes={dirty ? [activeType] : []}
                collapsed={isVoucherTypeCollapsed}
                onToggleCollapse={() => setIsVoucherTypeCollapsed(!isVoucherTypeCollapsed)}
              />
            </div>

            {/* ── Panel B: Template Properties Form ── */}
            <div
              className={`w-full lg:w-96 xl:w-[420px] shrink-0 h-full border-r border-border/80 bg-slate-50/50 dark:bg-card/50 ${
                activeMobileTab === 'preview' ? 'hidden lg:block' : 'block'
              }`}
            >
              <TemplatePropertiesPanel
                template={currentTemplate}
                onUpdate={updateActive}
                onToggleColumn={toggleColumnVisibility}
                onUpdateColumnLabel={updateColumnLabel}
                onReorderColumns={reorderColumns}
              />
            </div>

            {/* ── Panel C: Live Changes Preview Canvas ── */}
            <div
              className={`flex-1 h-full min-w-0 ${
                activeMobileTab === 'properties' ? 'hidden lg:block' : 'block'
              }`}
            >
              <ChangesPreviewPanel
                template={currentTemplate}
                company={company}
                previewLines={previewLines}
                zoom={zoom}
                onZoomChange={setZoom}
                livePreviewEnabled={livePreviewEnabled}
                onRefresh={() => load()}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Dialogs ── */}
      <ResetConfirmDialog
        isOpen={resetDialogOpen}
        voucherType={activeType}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={reset}
      />

      <UnsavedChangesDialog
        isOpen={unsavedDialogOpen}
        currentType={activeType}
        targetType={pendingType}
        onClose={() => {
          setUnsavedDialogOpen(false);
          setPendingType(null);
        }}
        onDiscard={handleDiscardAndSwitch}
        onSaveAndSwitch={handleSaveAndSwitch}
      />
    </div>
  );
};
