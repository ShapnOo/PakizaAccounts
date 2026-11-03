import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVoucherSetupStore } from '../../stores/voucherSetupStore';
import { useVoucherPreviewStore } from '../../stores/voucherPreviewStore';
import type { VoucherType, TemplateId, TemplateCustomization } from '../../types/voucherTemplate';
import { CustomizerHeader } from '../../components/voucher-setup/CustomizerHeader';
import { CustomizationControls } from '../../components/voucher-setup/CustomizationControls';
import { PreviewPanel } from '../../components/voucher-setup/PreviewPanel';
import { setupSchema } from '../../lib/validation/voucherTemplate';
import { toast } from 'sonner';
import { Sliders, Eye, CopyCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export const VoucherSetupCustomizerPage: React.FC = () => {
  const { voucherType: rawVoucherType, id: rawId } = useParams<{
    voucherType?: string;
    id?: string;
  }>();
  const navigate = useNavigate();

  // Normalize voucherType from slug / param
  const activeVoucherType: VoucherType = useMemo(() => {
    const slug = (rawVoucherType || rawId || 'journal').toLowerCase();
    if (slug.includes('pay')) return 'Payment';
    if (slug.includes('rec')) return 'Receive';
    if (slug.includes('con')) return 'Contra';
    return 'Journal';
  }, [rawVoucherType, rawId]);

  const {
    setups,
    loading: setupLoading,
    dirtyVoucherType,
    load: loadSetups,
    setTemplateId,
    updateCustomization,
    resetCustomization,
    save: saveSetup,
    applyToAll,
  } = useVoucherSetupStore();

  const {
    previewData,
    load: loadPreview,
    setPreviewVoucherType,
  } = useVoucherPreviewStore();

  // Tab state for screen widths < 1024px
  const [mobileTab, setMobileTab] = useState<'customize' | 'preview'>('customize');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSetups();
    loadPreview();
  }, []);

  useEffect(() => {
    setPreviewVoucherType(activeVoucherType);
  }, [activeVoucherType]);

  const currentSetup = setups[activeVoucherType];
  const isDirty = dirtyVoucherType === activeVoucherType;

  const handleSelectTemplate = (tid: TemplateId) => {
    setTemplateId(activeVoucherType, tid);
  };

  const handleCustomizationChange = (patch: Partial<TemplateCustomization>) => {
    updateCustomization(activeVoucherType, patch);
  };

  const handleReset = () => {
    if (window.confirm(`Reset ${activeVoucherType} voucher template and settings to default?`)) {
      resetCustomization(activeVoucherType);
      toast.info(`Reset ${activeVoucherType} template to default`);
    }
  };

  const handleSave = async () => {
    if (!currentSetup) return;

    // Validate with zod
    const result = setupSchema.safeParse(currentSetup);
    if (!result.success) {
      toast.error('Validation error in customization properties');
      return;
    }

    setSaving(true);
    try {
      await saveSetup(activeVoucherType);
      toast.success(`Template saved for ${activeVoucherType} Voucher`);
    } catch {
      toast.error('Failed to save template setup');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyToAll = async () => {
    if (!currentSetup) return;

    const result = setupSchema.safeParse(currentSetup);
    if (!result.success) {
      toast.error('Validation error in customization properties');
      return;
    }

    if (
      !window.confirm(
        `Apply current "${activeVoucherType}" template and customization to ALL voucher types (Journal, Payment, Receive, Contra)?`
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      await applyToAll(activeVoucherType);
      toast.success(
        `Applied "${activeVoucherType}" setup to all voucher types (Journal, Payment, Receive, Contra)`
      );
    } catch {
      toast.error('Failed to apply template setup to all types');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    document.body.classList.add('voucher-print-active');
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handleCancel = () => {
    navigate('/voucher-setup');
  };

  if (setupLoading && !currentSetup) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="size-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading voucher template...</span>
        </div>
      </div>
    );
  }

  if (!currentSetup) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header with Breadcrumb & Actions */}
        <CustomizerHeader
          voucherType={activeVoucherType}
          isDirty={isDirty}
          onReset={handleReset}
          onSave={handleSave}
          onApplyToAll={handleApplyToAll}
          onPrint={handlePrint}
          saving={saving}
        />

        {/* Mobile/Tablet Tabs (<1024px) */}
        <div className="lg:hidden flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileTab('customize')}
            className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'customize'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <Sliders className="size-3.5" />
            <span>Template & Styling</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'preview'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <Eye className="size-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Main Workspace Panels: 2 Unified Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Panel 1: Template & Customization Controls */}
          {!isSidebarCollapsed && (
            <div
              className={`lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs relative ${
                mobileTab !== 'customize' ? 'hidden lg:block' : ''
              }`}
            >
              <div className="hidden lg:flex justify-end pb-1.5 border-b border-slate-100 mb-2">
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(true)}
                  title="Collapse controls panel to expand preview"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition cursor-pointer"
                >
                  <PanelLeftClose className="size-3.5" />
                  <span>Hide Sidebar</span>
                </button>
              </div>
              <CustomizationControls
                templateId={currentSetup.templateId}
                customization={currentSetup.customization}
                onSelectTemplate={handleSelectTemplate}
                onChange={handleCustomizationChange}
                onResetTemplate={handleReset}
              />
            </div>
          )}

          {/* Panel 2: Live Preview Paper Canvas (flexible, Sticky Floating) */}
          <div
            className={`${
              isSidebarCollapsed
                ? 'lg:col-span-12 xl:col-span-12'
                : 'lg:col-span-7 xl:col-span-8'
            } bg-white rounded-xl border border-slate-200 p-4 shadow-2xs lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] flex flex-col ${
              mobileTab !== 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {isSidebarCollapsed && (
              <div className="hidden lg:flex justify-start pb-2 mb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(false)}
                  title="Expand controls panel"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-[11.5px] font-semibold text-indigo-700 shadow-2xs transition cursor-pointer"
                >
                  <PanelLeftOpen className="size-3.5" />
                  <span>Show Template & Controls</span>
                </button>
              </div>
            )}
            <PreviewPanel
              templateId={currentSetup.templateId}
              previewData={previewData}
              customization={currentSetup.customization}
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-medium transition cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyToAll}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[13px] font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
            >
              <CopyCheck className="size-4 text-indigo-600" />
              <span>Apply to All Types</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

