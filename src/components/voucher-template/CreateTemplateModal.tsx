import React, { useState } from 'react';
import { X, Sparkles, Plus, Copy, FileText, Check } from 'lucide-react';
import { VoucherTemplate, VoucherType, PaperSize, Orientation } from '../../types/voucherTemplate';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTemplates: VoucherTemplate[];
  onCreate: (templateData: Partial<VoucherTemplate> & { name: string; voucherType: VoucherType }) => Promise<VoucherTemplate>;
  onCreated: (created: VoucherTemplate) => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  existingTemplates,
  onCreate,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [voucherType, setVoucherType] = useState<VoucherType>('Payment');
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('Portrait');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [cloneFromId, setCloneFromId] = useState<string>('none');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      let baseConfig: Partial<VoucherTemplate> = {};
      if (cloneFromId !== 'none') {
        const found = existingTemplates.find((t) => t.id === cloneFromId);
        if (found) {
          baseConfig = {
            paper: { ...found.paper, size: paperSize, orientation },
            margin: { ...found.margin },
            font: { ...found.font },
            header: { ...found.header },
            footer: { ...found.footer },
            table: { ...found.table },
          };
        }
      } else {
        baseConfig = {
          paper: { size: paperSize, orientation },
        };
      }

      const created = await onCreate({
        name: name.trim(),
        voucherType,
        description: description.trim(),
        isDefault,
        ...baseConfig,
      });

      onCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const sameTypeTemplates = existingTemplates.filter((t) => t.voucherType === voucherType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between gap-3 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center">
              <Plus className="size-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Create Voucher Template</h3>
              <p className="text-[11px] text-muted-foreground">
                Set up a new print layout format for vouchers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Template Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vendor Payment Voucher (2-Copy)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Voucher Type */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Voucher Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Journal', 'Payment', 'Receive', 'Contra'] as VoucherType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVoucherType(t)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    voucherType === t
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Size & Orientation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Paper Size
              </label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
              >
                <option value="A4">A4 (210 × 297 mm)</option>
                <option value="A5">A5 (148 × 210 mm)</option>
                <option value="Letter">Letter (8.5 × 11 in)</option>
                <option value="Legal">Legal (8.5 × 14 in)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as Orientation)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
              >
                <option value="Portrait">Portrait</option>
                <option value="Landscape">Landscape</option>
              </select>
            </div>
          </div>

          {/* Inherit from existing */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Copy Settings From (Optional)
            </label>
            <select
              value={cloneFromId}
              onChange={(e) => setCloneFromId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
            >
              <option value="none">Default Preset for {voucherType}</option>
              {sameTypeTemplates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.paper.size} {tpl.paper.orientation})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Clean format without employee or vehicle columns for external supplier copies"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Set as default checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="size-4 rounded-md border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-medium text-foreground">
              Set as default template for <strong>{voucherType}</strong> vouchers
            </span>
          </label>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="size-3.5" />
              <span>{submitting ? 'Creating...' : 'Create & Design'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
