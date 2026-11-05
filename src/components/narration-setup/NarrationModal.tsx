import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, AlertCircle, Check } from 'lucide-react';
import {
  NarrationTemplate,
  VoucherTypeOption,
  VOUCHER_TYPE_OPTIONS,
  NARRATION_CATEGORIES,
  AVAILABLE_VARIABLES,
} from '../../types/narrationSetup';

interface NarrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    code: string;
    title: string;
    voucherType: VoucherTypeOption;
    category: string;
    template: string;
    isActive: boolean;
  }) => Promise<void>;
  initialData?: NarrationTemplate | null;
}

export const NarrationModal: React.FC<NarrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [voucherType, setVoucherType] = useState<VoucherTypeOption>('All');
  const [category, setCategory] = useState(NARRATION_CATEGORIES[0]);
  const [template, setTemplate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setTitle(initialData.title);
      setVoucherType(initialData.voucherType);
      setCategory(initialData.category);
      setTemplate(initialData.template);
      setIsActive(initialData.isActive);
    } else {
      setCode(`NARR-${Math.floor(100 + Math.random() * 900)}`);
      setTitle('');
      setVoucherType('Payment');
      setCategory(NARRATION_CATEGORIES[0]);
      setTemplate('');
      setIsActive(true);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const insertVariable = (variableKey: string) => {
    if (!textareaRef.current) {
      setTemplate((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + variableKey);
      return;
    }

    const input = textareaRef.current;
    const startPos = input.selectionStart || 0;
    const endPos = input.selectionEnd || 0;
    const newText =
      template.substring(0, startPos) +
      variableKey +
      template.substring(endPos, template.length);

    setTemplate(newText);
    setTimeout(() => {
      input.focus();
      const nextPos = startPos + variableKey.length;
      input.setSelectionRange(nextPos, nextPos);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Narration code is required');
      return;
    }
    if (!title.trim()) {
      setError('Title / short description is required');
      return;
    }
    if (!template.trim()) {
      setError('Narration template text is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        voucherType,
        category,
        template: template.trim(),
        isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save narration template');
    } finally {
      setSubmitting(false);
    }
  };

  // Sample live preview
  const livePreview = template
    .replace(/\{party_name\}/g, 'Rahim Textile Mills Ltd.')
    .replace(/\{invoice_no\}/g, 'INV-2026-089')
    .replace(/\{month\}/g, 'March')
    .replace(/\{year\}/g, '2026')
    .replace(/\{bank_name\}/g, 'Islami Bank Bangladesh Ltd.')
    .replace(/\{cheque_no\}/g, 'CHQ-890214')
    .replace(/\{amount\}/g, 'BDT 1,50,000')
    .replace(/\{purpose\}/g, 'factory raw materials supply');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in-50 font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {initialData ? 'Edit Narration Setup' : 'Add New Narration Setup'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure standard narration boilerplate and dynamic transaction placeholders
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Code */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Narration Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PAY-VEND-01"
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 uppercase tracking-wider"
              />
            </div>

            {/* Voucher Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Voucher Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value as VoucherTypeOption)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
              >
                {VOUCHER_TYPE_OPTIONS.map((vt) => (
                  <option key={vt} value={vt}>
                    {vt === 'All' ? 'All Vouchers' : `${vt} Voucher`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Title / Short Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly Staff Salary Disbursal"
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            >
              {NARRATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Narration Template Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Standard Narration Template <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Click tags below to insert</span>
            </div>

            <textarea
              ref={textareaRef}
              rows={3}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="e.g. Being payment made to {party_name} against invoice #{invoice_no} via Cheque #{cheque_no} drawn on {bank_name}."
              className="w-full text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none leading-relaxed"
            />

            {/* Quick Variable Insert Badges */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="size-2.5 text-indigo-500" />
                <span>Insert Placeholders:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 transition cursor-pointer"
                    title={v.desc}
                  >
                    <span>+</span>
                    <span>{v.key}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          {template && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Live Sample Output:
              </span>
              <p className="text-xs text-slate-700 italic font-normal leading-relaxed">
                "{livePreview}"
              </p>
            </div>
          )}

          {/* Active status */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-slate-700 cursor-pointer">
              Active (available for selection across voucher entries)
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="size-3.5" />
              <span>{submitting ? 'Saving...' : initialData ? 'Update Narration' : 'Create Narration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

