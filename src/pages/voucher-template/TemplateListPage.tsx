import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Star,
  Printer,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  List,
  CheckCircle2,
  Layers,
  FileText,
  FileSpreadsheet,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useVoucherTemplateStore } from '../../stores/voucherTemplateStore';
import { VoucherTemplate, VoucherType, PaperSize } from '../../types/voucherTemplate';
import { ViewTemplateModal } from '../../components/voucher-template/ViewTemplateModal';
import { CreateTemplateModal } from '../../components/voucher-template/CreateTemplateModal';
import { DeleteTemplateModal } from '../../components/voucher-template/DeleteTemplateModal';
import { TableSkeleton } from '../../components/custom-fields/TableSkeleton';

const VOUCHER_TYPE_COLORS: Record<VoucherType, { badge: string; border: string; bg: string; text: string }> = {
  Journal: {
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    border: 'border-indigo-200 dark:border-indigo-800/80',
    bg: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  Payment: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    border: 'border-emerald-200 dark:border-emerald-800/80',
    bg: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  Receive: {
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    border: 'border-purple-200 dark:border-purple-800/80',
    bg: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
  },
  Contra: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    border: 'border-amber-200 dark:border-amber-800/80',
    bg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
};

export const VoucherTemplateListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    templateList,
    company,
    previewLines,
    loading,
    load,
    createTemplate,
    duplicateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    resetAll,
    setActiveTemplateId,
  } = useVoucherTemplateStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || 'ALL');
  const [sizeFilter, setSizeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [previewTemplate, setPreviewTemplate] = useState<VoucherTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<VoucherTemplate | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  // Sync type filter with search params
  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    if (type === 'ALL') {
      searchParams.delete('type');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type });
    }
  };

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templateList.filter((tpl) => {
      if (typeFilter !== 'ALL' && tpl.voucherType !== typeFilter) return false;
      if (sizeFilter !== 'ALL' && tpl.paper.size !== sizeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tpl.name?.toLowerCase().includes(q);
        const matchesType = tpl.voucherType.toLowerCase().includes(q);
        const matchesVariant = tpl.variant?.toLowerCase().includes(q);
        const matchesDesc = tpl.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesVariant && !matchesDesc) return false;
      }
      return true;
    });
  }, [templateList, typeFilter, sizeFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: templateList.length,
      Journal: templateList.filter((t) => t.voucherType === 'Journal').length,
      Payment: templateList.filter((t) => t.voucherType === 'Payment').length,
      Receive: templateList.filter((t) => t.voucherType === 'Receive').length,
      Contra: templateList.filter((t) => t.voucherType === 'Contra').length,
    };
  }, [templateList]);

  const handleEdit = (id: string) => {
    setActiveTemplateId(id);
    navigate(`/voucher-template/${id}/edit`);
  };

  const handleView = (template: VoucherTemplate) => {
    setPreviewTemplate(template);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateTemplate(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultTemplate(id);
  };

  const handleDelete = (template: VoucherTemplate) => {
    setTemplateToDelete(template);
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteTemplate(id);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 pb-24">
      {/* ── Page Header ── */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-xs shrink-0 border border-indigo-100 dark:border-indigo-900/50">
            <SlidersHorizontal className="size-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Voucher Print Templates
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {templateList.length} Templates
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Select a template to view, modify paper margins, customize columns, or design new voucher formats.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Restore all initial factory templates"
          >
            <RotateCcw className="size-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all shadow-sm shadow-indigo-600/20 cursor-pointer active:scale-95"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* ── Summary KPI Badges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['Journal', 'Payment', 'Receive', 'Contra'] as VoucherType[]).map((type) => {
          const styling = VOUCHER_TYPE_COLORS[type];
          const isSelected = typeFilter === type;
          const count = counts[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeFilterChange(isSelected ? 'ALL' : type)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs flex items-center justify-between group ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
                  : 'border-border/80 bg-card hover:bg-muted/40'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {type} Vouchers
                </span>
                <span className="text-lg font-black text-foreground">{count}</span>
                <span className="text-[10px] text-muted-foreground ml-1">templates</span>
              </div>
              <span
                className={`size-2.5 rounded-full ${styling.bg} group-hover:scale-125 transition-transform`}
              />
            </button>
          );
        })}
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search template name, variant, or layout..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Center: Type Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto sidebar-scroll pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => handleTypeFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            All ({counts.all})
          </button>
          {(['Journal', 'Payment', 'Receive', 'Contra'] as VoucherType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeFilterChange(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>

        {/* Right: Paper size filter & Layout toggle */}
        <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end">
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Paper Sizes</option>
            <option value="A4">A4</option>
            <option value="A5">A5</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table List View"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Section: Loading, Empty, Grid, or Table ── */}
      {loading ? (
        <div className="bg-card border border-border/80 rounded-2xl p-6">
          <TableSkeleton rows={6} />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-muted grid place-items-center mx-auto text-muted-foreground">
            <Filter className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No templates found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No voucher print templates match your search criteria. Try clearing filters or create a new template.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setSizeFilter('ALL');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              + Create Template
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Grid Cards View ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const styling = VOUCHER_TYPE_COLORS[template.voucherType];
            const visibleCols = Object.values(template.table.columns).filter((c) => c.visible).length;
            const totalCols = Object.keys(template.table.columns).length;

            return (
              <div
                key={template.id}
                className="bg-card border border-border/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/40 rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Default Indicator Ribbon */}
                {template.isDefault && (
                  <div className="absolute top-0 right-0">
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-xl shadow-2xs">
                      <Star className="size-2.5 fill-current" />
                      Default
                    </span>
                  </div>
                )}

                {/* Card Top: Type badge & Title */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styling.badge}`}
                    >
                      {template.voucherType}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {template.paper.size} · {template.paper.orientation}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
                    {template.description || `${template.voucherType} voucher layout with custom columns and margins.`}
                  </p>

                  {/* Paper Layout Mini Schematic Preview */}
                  <div className="my-3.5 p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-border/60 flex items-center justify-center">
                    <div
                      className={`bg-white dark:bg-card border border-border shadow-xs rounded-sm p-2 flex flex-col justify-between transition-transform group-hover:scale-105 duration-200 ${
                        template.paper.orientation === 'Landscape' ? 'w-36 h-24' : 'w-24 h-32'
                      }`}
                    >
                      {/* Mini Header lines */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="size-2 rounded-xs bg-indigo-500/80" />
                          <div className="w-10 h-1 rounded-xs bg-slate-300 dark:bg-slate-600" />
                        </div>
                        <div className="w-14 h-1 rounded-xs bg-slate-200 dark:bg-slate-700 mx-auto" />
                      </div>

                      {/* Mini Table Rows */}
                      <div className="space-y-0.5 my-auto">
                        <div className="w-full h-1.5 rounded-xs bg-indigo-100 dark:bg-indigo-950/60" />
                        <div className="w-full h-1 rounded-xs bg-slate-100 dark:bg-muted/80" />
                        <div className="w-full h-1 rounded-xs bg-slate-100 dark:bg-muted/80" />
                        <div className="w-full h-1 rounded-xs bg-slate-100 dark:bg-muted/80" />
                      </div>

                      {/* Mini Signatures */}
                      <div className="flex justify-between items-center pt-1 border-t border-border/40">
                        <div className="w-3 h-0.5 bg-slate-300 dark:bg-slate-600" />
                        <div className="w-3 h-0.5 bg-slate-300 dark:bg-slate-600" />
                        <div className="w-3 h-0.5 bg-slate-300 dark:bg-slate-600" />
                      </div>
                    </div>
                  </div>

                  {/* Specs Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">Margins:</span>
                      <span>L/R: {template.margin.left}"</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">Font:</span>
                      <span className="truncate">{template.font.family} ({template.font.size}pt)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">Columns:</span>
                      <span>{visibleCols} of {totalCols} visible</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">Theme:</span>
                      <span>{template.font.theme}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Explicit Action Buttons (View, Edit/Modify, Duplicate, Delete, Set Default) */}
                <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* View Button */}
                    <button
                      type="button"
                      onClick={() => handleView(template)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-all cursor-pointer shadow-2xs hover:text-indigo-600"
                      title="View Voucher Print Preview"
                    >
                      <Eye className="size-3 text-indigo-600" />
                      <span>View</span>
                    </button>

                    {/* Edit / Modify Button */}
                    <button
                      type="button"
                      onClick={() => handleEdit(template.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                      title="Edit template in 3-panel designer"
                    >
                      <Edit3 className="size-3 stroke-[2.5]" />
                      <span>Modify</span>
                    </button>
                  </div>

                  {/* Utility Quick Actions: Set Default, Duplicate, Delete */}
                  <div className="flex items-center gap-0.5">
                    {!template.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(template.id)}
                        className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-colors cursor-pointer"
                        title="Set as default template for this voucher type"
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDuplicate(template.id)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Duplicate this template"
                    >
                      <Copy className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(template)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete template"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Table List View ── */
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto sidebar-scroll">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 min-w-[220px]">Template Name</th>
                  <th className="py-3 px-3 w-28">Voucher Type</th>
                  <th className="py-3 px-3 w-32">Paper & Size</th>
                  <th className="py-3 px-3 w-28">Margins</th>
                  <th className="py-3 px-3 w-36">Font & Style</th>
                  <th className="py-3 px-3 w-28 text-center">Columns</th>
                  <th className="py-3 px-3 w-24 text-center">Status</th>
                  <th className="py-3 px-4 text-center w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTemplates.map((tpl) => {
                  const styling = VOUCHER_TYPE_COLORS[tpl.voucherType];
                  const visibleCols = Object.values(tpl.table.columns).filter((c) => c.visible).length;

                  return (
                    <tr key={tpl.id} className="hover:bg-muted/30 transition-colors group">
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleEdit(tpl.id)}
                            className="font-bold text-foreground hover:text-indigo-600 transition-colors text-left text-xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>{tpl.name}</span>
                          </button>
                          {tpl.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {tpl.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Voucher Type */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${styling.badge}`}
                        >
                          {tpl.voucherType}
                        </span>
                      </td>

                      {/* Paper & Orientation */}
                      <td className="py-3 px-3 font-medium text-foreground">
                        <span>{tpl.paper.size}</span>
                        <span className="text-muted-foreground ml-1">({tpl.paper.orientation})</span>
                      </td>

                      {/* Margins */}
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                        L: {tpl.margin.left}" · R: {tpl.margin.right}"
                      </td>

                      {/* Font */}
                      <td className="py-3 px-3 text-muted-foreground">
                        <span className="text-foreground font-medium">{tpl.font.family}</span> {tpl.font.size}pt
                      </td>

                      {/* Columns */}
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-bold text-foreground">
                          {visibleCols} cols
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {tpl.isDefault ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <Star className="size-2.5 fill-current" />
                            Default
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Optional</span>
                        )}
                      </td>

                      {/* Actions: View, Modify, Duplicate, Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => handleView(tpl)}
                            className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-indigo-600 transition-colors cursor-pointer"
                            title="View Preview"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          {/* Edit / Modify */}
                          <button
                            type="button"
                            onClick={() => handleEdit(tpl.id)}
                            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                            title="Modify in Designer"
                          >
                            <Edit3 className="size-3.5 stroke-[2.5]" />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(tpl.id)}
                            className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Duplicate Template"
                          >
                            <Copy className="size-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(tpl)}
                            className="p-1.5 rounded-lg border border-border bg-background hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Template"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── View Preview Modal ── */}
      <ViewTemplateModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        company={company}
        previewLines={previewLines}
      />

      {/* ── Create Template Modal ── */}
      <CreateTemplateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        existingTemplates={templateList}
        onCreate={createTemplate}
        onCreated={(created) => {
          setActiveTemplateId(created.id);
          navigate(`/voucher-template/${created.id}/edit`);
        }}
      />

      {/* ── Delete Confirmation Modal ── */}
      <DeleteTemplateModal
        template={templateToDelete}
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
