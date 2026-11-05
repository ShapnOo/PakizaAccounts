import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Check,
  FileText,
  Plus,
  Trash2,
  Pencil,
  Star,
} from 'lucide-react';
import { VoucherDefinition, NarrationItem } from '../../types/voucher';
import { AVAILABLE_VARIABLES } from '../../types/narrationSetup';

interface VoucherNarrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: VoucherDefinition | null;
  onSave: (
    id: string,
    narrationTemplate: string,
    autoNarrationEnabled: boolean,
    narrations: NarrationItem[]
  ) => void;
}

export const VoucherNarrationConfigModal: React.FC<VoucherNarrationConfigModalProps> = ({
  isOpen,
  onClose,
  voucher,
  onSave,
}) => {
  const [narrationsList, setNarrationsList] = useState<NarrationItem[]>([]);
  const [autoEnabled, setAutoEnabled] = useState(true);

  // Form states for adding / editing a single narration inside the voucher
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (voucher) {
      const items: NarrationItem[] =
        voucher.narrations && voucher.narrations.length > 0
          ? [...voucher.narrations]
          : [
              {
                id: `narr-${Date.now()}`,
                title: 'Standard Default Narration',
                template:
                  voucher.narrationTemplate ||
                  `Being amount processed under ${voucher.name} for {purpose} against #{invoice_no}.`,
                isDefault: true,
              },
            ];

      setNarrationsList(items);
      setAutoEnabled(voucher.autoNarrationEnabled !== false);
      setShowEditor(false);
      setEditingItemId(null);
    }
  }, [voucher, isOpen]);

  if (!isOpen || !voucher) return null;

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

  const handleStartAdd = () => {
    setEditingItemId(null);
    setTitle('');
    setTemplate('');
    setIsDefault(narrationsList.length === 0);
    setShowEditor(true);
  };

  const handleStartEdit = (item: NarrationItem) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setTemplate(item.template);
    setIsDefault(!!item.isDefault);
    setShowEditor(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !template.trim()) return;

    let updated: NarrationItem[];

    if (editingItemId) {
      updated = narrationsList.map((item) => {
        if (item.id === editingItemId) {
          return { ...item, title: title.trim(), template: template.trim(), isDefault };
        }
        return isDefault ? { ...item, isDefault: false } : item;
      });
    } else {
      const newItem: NarrationItem = {
        id: `narr-${Date.now()}`,
        title: title.trim(),
        template: template.trim(),
        isDefault,
      };
      if (isDefault) {
        updated = narrationsList.map((item) => ({ ...item, isDefault: false }));
        updated.unshift(newItem);
      } else {
        updated = [...narrationsList, newItem];
      }
    }

    setNarrationsList(updated);
    setShowEditor(false);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (narrationsList.length <= 1) {
      alert('At least one narration template must remain.');
      return;
    }
    const filtered = narrationsList.filter((item) => item.id !== id);
    if (!filtered.some((item) => item.isDefault) && filtered.length > 0) {
      filtered[0].isDefault = true;
    }
    setNarrationsList(filtered);
    if (editingItemId === id) {
      setShowEditor(false);
    }
  };

  const handleSetDefault = (id: string) => {
    const updated = narrationsList.map((item) => ({
      ...item,
      isDefault: item.id === id,
    }));
    setNarrationsList(updated);
  };

  const handleFinalSave = () => {
    const defaultItem = narrationsList.find((item) => item.isDefault) || narrationsList[0];
    const defaultTemplate = defaultItem ? defaultItem.template : '';

    onSave(voucher.id, defaultTemplate, autoEnabled, narrationsList);
    onClose();
  };

  // Sample live preview
  const previewSource = showEditor
    ? template
    : narrationsList.find((i) => i.isDefault)?.template || '';

  const livePreview = previewSource
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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-[680px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Compact Modal Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{voucher.name}</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {voucher.shortName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  {voucher.voucherType}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Compact Modal Content */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          {/* Compact Auto-prepopulate toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Auto-Prepopulate Default Narration on Voucher Entry
              </span>
              <p className="text-[11px] text-slate-400">
                Automatically fill the default template when creating a new {voucher.name}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={autoEnabled}
                onChange={(e) => setAutoEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Form to Add / Edit a Narration Template */}
          {showEditor && (
            <div className="p-3.5 rounded-xl bg-indigo-50/30 border border-indigo-200 space-y-2.5 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">
                  {editingItemId ? 'Edit Narration Template' : 'Add New Narration Template'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Template Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vendor Bill Settlement, Asset Depreciation..."
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Formula</label>
                  <span className="text-[10.5px] text-indigo-600 font-medium">Click tokens to insert</span>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="e.g. Being payment made to {party_name} against bill #{invoice_no}."
                  className="w-full text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed transition"
                />

                {/* Token Pills */}
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                  {AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => insertVariable(v.key)}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
                      title={v.desc}
                    >
                      <span>+</span>
                      <span>{v.key}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="size-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-medium text-slate-700">
                    Set as default template
                  </span>
                </label>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveItem}
                    disabled={!title.trim() || !template.trim()}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    {editingItemId ? 'Update' : 'Add to List'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List of Configured Multiple Narrations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Configured Narration Templates
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-[10.5px] font-bold border border-indigo-200/80">
                  {narrationsList.length} Options
                </span>
              </div>

              {!showEditor && (
                <button
                  type="button"
                  onClick={handleStartAdd}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition cursor-pointer"
                >
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Add Another Narration</span>
                </button>
              )}
            </div>

            {/* Existing Narrations List - Title Only */}
            <div className="space-y-1.5">
              {narrationsList.map((item) => (
                <div
                  key={item.id}
                  className={`px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    item.isDefault
                      ? 'bg-indigo-50/30 border-indigo-200 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                  title={item.template}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </span>
                    {item.isDefault ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-2xs shrink-0">
                        <Star className="size-2.5 fill-current" />
                        <span>Default</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(item.id)}
                        className="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 hover:underline cursor-pointer shrink-0"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                      title="Edit template formula"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete template"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Real-time Output Sample */}
          <div className="p-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2">
            <Sparkles className="size-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider mr-1.5">
                Output Preview:
              </span>
              <span className="italic text-slate-800">
                {previewSource ? `"${livePreview}"` : 'Select or add a template to preview'}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinalSave}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Check className="size-3.5 stroke-[2.5]" />
            <span>Save All Narrations for {voucher.shortName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
