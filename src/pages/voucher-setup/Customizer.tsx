import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVoucherSetupStore } from '../../stores/voucherSetupStore';
import { useVoucherPreviewStore } from '../../stores/voucherPreviewStore';
import type { VoucherType, TemplateId, TemplateCustomization } from '../../types/voucherTemplate';
import { CustomizerHeader } from '../../components/voucher-setup/CustomizerHeader';
import { TemplatePicker } from '../../components/voucher-setup/TemplatePicker';
import { CustomizationControls } from '../../components/voucher-setup/CustomizationControls';
import { PreviewPanel } from '../../components/voucher-setup/PreviewPanel';
import { setupSchema } from '../../lib/validation/voucherTemplate';
import { toast } from 'sonner';
import { LayoutGrid, Sliders, Eye } from 'lucide-react';

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
  } = useVoucherSetupStore();

  const {
    previewData,
    load: loadPreview,
    setPreviewVoucherType,
  } = useVoucherPreviewStore();

  // Tab state for screen widths < 1024px
  const [mobileTab, setMobileTab] = useState<'template' | 'customize' | 'preview'>('customize');
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
          saving={saving}
        />

        {/* Mobile/Tablet Tabs (<1024px) */}
        <div className="lg:hidden flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileTab('template')}
            className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'template'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <LayoutGrid className="size-3.5" />
            <span>Template</span>
          </button>
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
            <span>Customize</span>
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
            <span>Preview</span>
          </button>
        </div>

        {/* Main Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Panel A: Template Picker (~220px on desktop) */}
          <div
            className={`lg:col-span-3 xl:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs ${
              mobileTab !== 'template' ? 'hidden lg:block' : ''
            }`}
          >
            <TemplatePicker
              voucherType={activeVoucherType}
              selectedTemplateId={currentSetup.templateId}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>

          {/* Panel B: Customization Controls (~320px on desktop) */}
          <div
            className={`lg:col-span-4 xl:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs ${
              mobileTab !== 'customize' ? 'hidden lg:block' : ''
            }`}
          >
            <CustomizationControls
              templateId={currentSetup.templateId}
              customization={currentSetup.customization}
              onChange={handleCustomizationChange}
              onResetTemplate={handleReset}
            />
          </div>

          {/* Panel C: Live Preview Paper Canvas (flexible, ≥500px) */}
          <div
            className={`lg:col-span-5 xl:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs ${
              mobileTab !== 'preview' ? 'hidden lg:block' : ''
            }`}
          >
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

