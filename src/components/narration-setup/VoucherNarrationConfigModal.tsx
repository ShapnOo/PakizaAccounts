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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 animate-in fade-in-50 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="size-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900">{voucher.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {voucher.shortName}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  {voucher.voucherType}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure standard narration templates with dynamic placeholders for auto-filling voucher entries.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          {/* Auto-prepopulate toggle banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 block">
                Auto-Prepopulate Default Narration
              </span>
              <span className="text-xs text-slate-500 block">
                Automatically fill the default narration template when creating a new {voucher.name}.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={autoEnabled}
                onChange={(e) => setAutoEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Form to Add / Edit a Narration Template */}
          {showEditor && (
            <div className="p-6 rounded-2xl bg-white border-2 border-indigo-200/90 shadow-md space-y-4 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-950">
                  {editingItemId ? 'Edit Narration Template' : 'Add New Narration Template for this Voucher'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Template Title / Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vendor Bill Settlement, Monthly Asset Depreciation, Raw Materials..."
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Narration Formula</label>
                  <span className="text-[11px] text-indigo-600 font-semibold">Click tokens below to insert</span>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="e.g. Being payment made to {party_name} against bill #{invoice_no} via {bank_name}."
                  className="w-full text-[13px] font-normal text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed transition"
                />

                {/* Token Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Insert:</span>
                  {AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => insertVariable(v.key)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs"
                      title={v.desc}
                    >
                      <span>+</span>
                      <span>{v.key}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="size-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Set as default template for this voucher
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveItem}
                    disabled={!title.trim() || !template.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {editingItemId ? 'Update Template' : 'Add to List'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List of Configured Multiple Narrations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Configured Narration Templates</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80">
                    {narrationsList.length} Options
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  These templates will appear in the dropdown inside voucher and journal entry forms.
                </p>
              </div>

              {!showEditor && (
                <button
                  type="button"
                  onClick={handleStartAdd}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  <span>Add Another Narration</span>
                </button>
              )}
            </div>

            {/* Existing Narrations List */}
            <div className="space-y-3">
              {narrationsList.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.isDefault
                      ? 'bg-indigo-50/25 border-indigo-200 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-slate-900">{item.title}</span>
                        {item.isDefault ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-2xs">
                            <Star className="size-3 fill-current" />
                            <span>Default</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(item.id)}
                            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 hover:underline cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      <p className="text-[13px] text-slate-700 leading-relaxed font-normal">
                        {item.template.split(/(\{.*?\})/).map((part, pIdx) => {
                          if (part.startsWith('{') && part.endsWith('}')) {
                            return (
                              <span
                                key={pIdx}
                                className="inline-block px-2 py-0.5 mx-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80 shadow-2xs"
                              >
                                {part}
                              </span>
                            );
                          }
                          return part;
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition cursor-pointer"
                        title="Edit this narration"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                        title="Delete narration"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Output Sample */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="size-4 text-indigo-600" />
              <span>Real-Time Output Preview:</span>
            </div>
            <p className="text-[13px] text-slate-800 font-medium leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-2xs">
              {previewSource ? `"${livePreview}"` : <span className="text-slate-400 font-normal">Select or add a template above to preview</span>}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinalSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
          >
            <Check className="size-4 stroke-[2.5]" />
            <span>Save All Narrations for {voucher.shortName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
