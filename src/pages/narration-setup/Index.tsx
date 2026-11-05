import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Copy,
  CopyPlus,
  Search,
  RotateCcw,
  Filter,
  Check,
  CreditCard,
  ArrowDownLeft,
  BookOpen,
  Repeat2,
  Tag,
} from 'lucide-react';
import { useNarrationSetupStore } from '../../stores/narrationSetupStore';
import { NarrationTemplate, VoucherTypeOption, VOUCHER_TYPE_OPTIONS } from '../../types/narrationSetup';
import { NarrationModal } from '../../components/narration-setup/NarrationModal';
import { toast } from 'sonner';

export const NarrationSetupPage: React.FC = () => {
  const {
    templates,
    loading,
    loadTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateActive,
    resetToDefault,
  } = useNarrationSetupStore();

  const [search, setSearch] = useState('');
  const [selectedVoucherType, setSelectedVoucherType] = useState<VoucherTypeOption>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NarrationTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      if (selectedVoucherType !== 'All' && item.voucherType !== selectedVoucherType && item.voucherType !== 'All') {
        return false;
      }
      if (statusFilter === 'Active' && !item.isActive) return false;
      if (statusFilter === 'Inactive' && item.isActive) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const code = (item.code || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        const tmpl = (item.template || '').toLowerCase();
        return code.includes(q) || title.includes(q) || cat.includes(q) || tmpl.includes(q);
      }
      return true;
    });
  }, [templates, selectedVoucherType, statusFilter, search]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Narration text copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDuplicate = async (item: NarrationTemplate) => {
    await addTemplate({
      code: `${item.code}-COPY`,
      title: `${item.title} (Copy)`,
      voucherType: item.voucherType,
      category: item.category,
      template: item.template,
      isActive: true,
      tags: item.tags,
    });
    toast.success('Narration template duplicated');
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteTemplate(id);
      toast.success('Narration template deleted');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all narration templates to factory defaults? Custom templates will be overwritten.')) {
      await resetToDefault();
      toast.success('Narration templates reset to defaults');
    }
  };

  const stats = useMemo(() => {
    return {
      total: templates.length,
      payment: templates.filter((t) => t.voucherType === 'Payment' || t.voucherType === 'All').length,
      receive: templates.filter((t) => t.voucherType === 'Receive' || t.voucherType === 'All').length,
      journal: templates.filter((t) => t.voucherType === 'Journal' || t.voucherType === 'All').length,
      contra: templates.filter((t) => t.voucherType === 'Contra' || t.voucherType === 'All').length,
    };
  }, [templates]);

  const getVoucherTypeBadge = (vt: VoucherTypeOption) => {
    switch (vt) {
      case 'Payment':
        return 'bg-rose-50 text-rose-700 border-rose-200/90';
      case 'Receive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/90';
      case 'Journal':
        return 'bg-blue-50 text-blue-700 border-blue-200/90';
      case 'Contra':
        return 'bg-purple-50 text-purple-700 border-purple-200/90';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1600px] mx-auto space-y-5">
        {/* Page Breadcrumb & Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <FileText className="size-3.5" />
              <span>Master Configuration & Setup (F&A)</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800">Narration Setup</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              <span>Narration Setup</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                {templates.length} Templates
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure standard boilerplate voucher narrations and transaction descriptions across Payment, Receive, Journal, and Contra books.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              title="Reset to factory defaults"
            >
              <RotateCcw className="size-3.5 text-slate-500" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingTemplate(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add Narration</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Cards with Icons & Better Visual Alignment */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Templates</span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">{stats.total}</span>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">Payment Vouchers</span>
              <span className="text-xl font-black text-rose-700 mt-0.5 block">{stats.payment}</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <CreditCard className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider block">Receive Vouchers</span>
              <span className="text-xl font-black text-emerald-700 mt-0.5 block">{stats.receive}</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider block">Journal Vouchers</span>
              <span className="text-xl font-black text-blue-700 mt-0.5 block">{stats.journal}</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider block">Contra Vouchers</span>
              <span className="text-xl font-black text-purple-700 mt-0.5 block">{stats.contra}</span>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Repeat2 className="size-4.5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Voucher Type Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {VOUCHER_TYPE_OPTIONS.map((vt) => (
                <button
                  key={vt}
                  type="button"
                  onClick={() => setSelectedVoucherType(vt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedVoucherType === vt
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {vt === 'All' ? 'All Books' : `${vt} Voucher`}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="size-3 text-slate-400" />
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search narration code, title, template text, or category..."
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Narration Templates Table (Fixed Alignment, No Text Wrapping on Code, Centered Actions) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-44 whitespace-nowrap">Code</th>
                  <th className="py-3 px-4 w-72">Title & Category</th>
                  <th className="py-3 px-4 w-28 text-center">Voucher</th>
                  <th className="py-3 px-4 min-w-[380px]">Standard Narration Template</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-36 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs italic">
                      No narration templates found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                      {/* Code (Whitespace-nowrap so PAY-VEND-01-COPY never breaks into 3 lines) */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span className="font-bold text-slate-800 px-2.5 py-1 rounded-md bg-slate-100 text-xs border border-slate-200 tracking-wide font-sans inline-block">
                          {item.code}
                        </span>
                      </td>

                      {/* Title & Category */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Tag className="size-2.5 text-slate-400" />
                          <span>{item.category}</span>
                        </div>
                      </td>

                      {/* Voucher Type */}
                      <td className="py-3.5 px-4 align-middle text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border tracking-wide whitespace-nowrap ${getVoucherTypeBadge(
                            item.voucherType
                          )}`}
                        >
                          {item.voucherType === 'All' ? 'All Books' : `${item.voucherType}`}
                        </span>
                      </td>

                      {/* Template with Nicely Formatted Variable Pills */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="text-slate-700 leading-relaxed font-normal text-xs">
                          {item.template.split(/(\{.*?\})/).map((part, pIdx) => {
                            if (part.startsWith('{') && part.endsWith('}')) {
                              return (
                                <span
                                  key={pIdx}
                                  className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200/80 shadow-2xs"
                                >
                                  {part}
                                </span>
                              );
                            }
                            return part;
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-middle text-center">
                        <button
                          type="button"
                          onClick={() => toggleTemplateActive(item.id)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition cursor-pointer shadow-2xs ${
                            item.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions with proper semantic icons & hover states */}
                      <td className="py-3.5 px-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Copy to clipboard */}
                          <button
                            type="button"
                            onClick={() => handleCopyText(item.id, item.template)}
                            className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition cursor-pointer"
                            title="Copy narration text"
                          >
                            {copiedId === item.id ? (
                              <Check className="size-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>

                          {/* Duplicate (Using CopyPlus icon) */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(item)}
                            className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition cursor-pointer"
                            title="Duplicate template"
                          >
                            <CopyPlus className="size-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTemplate(item);
                              setIsModalOpen(true);
                            }}
                            className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition cursor-pointer"
                            title="Edit template"
                          >
                            <Pencil className="size-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.title)}
                            className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                            title="Delete template"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add / Edit */}
        <NarrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingTemplate}
          onSave={async (data) => {
            if (editingTemplate) {
              await updateTemplate(editingTemplate.id, data);
              toast.success('Narration template updated successfully');
            } else {
              await addTemplate(data);
              toast.success('New narration template created successfully');
            }
          }}
        />
      </div>
    </div>
  );
};

export default NarrationSetupPage;
