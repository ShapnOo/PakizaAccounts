import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  RotateCcw,
  Check,
  Copy,
  SlidersHorizontal,
  CreditCard,
  ArrowDownLeft,
  BookOpen,
  Repeat2,
  Sparkles,
  Star,
  Layers,
} from 'lucide-react';
import { useVouchers } from '../../context/VoucherContext';
import { VoucherDefinition, VoucherType } from '../../types/voucher';
import { VoucherNarrationConfigModal } from '../../components/narration-setup/VoucherNarrationConfigModal';
import { INITIAL_VOUCHER_DEFINITIONS } from '../../mock/vouchers';
import { toast } from 'sonner';

export const NarrationSetupPage: React.FC = () => {
  const { vouchers, updateVoucherDefinition } = useVouchers();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Enabled' | 'Disabled'>('All');

  const [activeVoucher, setActiveVoucher] = useState<VoucherDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter vouchers list
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      if (selectedType !== 'All' && v.voucherType !== selectedType) {
        return false;
      }

      const isAuto = v.autoNarrationEnabled !== false;
      if (statusFilter === 'Enabled' && !isAuto) return false;
      if (statusFilter === 'Disabled' && isAuto) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const name = (v.name || '').toLowerCase();
        const short = (v.shortName || '').toLowerCase();
        const tmpl = (v.narrationTemplate || '').toLowerCase();
        return name.includes(q) || short.includes(q) || tmpl.includes(q);
      }
      return true;
    });
  }, [vouchers, selectedType, statusFilter, search]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Dynamic narration template copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAuto = (v: VoucherDefinition) => {
    const nextVal = v.autoNarrationEnabled === false ? true : false;
    updateVoucherDefinition(v.id, { autoNarrationEnabled: nextVal });
    toast.success(
      `Auto-narration for "${v.name}" ${nextVal ? 'enabled' : 'disabled'}`
    );
  };

  const handleResetSingle = (v: VoucherDefinition) => {
    const original = INITIAL_VOUCHER_DEFINITIONS.find((iv) => iv.id === v.id);
    const defaultTemplate =
      original?.narrationTemplate ||
      `Being amount processed under ${v.name} for {purpose} against #{invoice_no}.`;
    updateVoucherDefinition(v.id, {
      narrationTemplate: defaultTemplate,
      autoNarrationEnabled: true,
      narrations: original?.narrations || [],
    });
    toast.success(`Narration for "${v.name}" reset to default`);
  };

  const handleResetAllToDefaults = () => {
    if (
      window.confirm(
        'Reset dynamic narration templates for all vouchers to factory defaults?'
      )
    ) {
      INITIAL_VOUCHER_DEFINITIONS.forEach((init) => {
        updateVoucherDefinition(init.id, {
          narrationTemplate: init.narrationTemplate,
          autoNarrationEnabled: true,
          narrations: init.narrations || [],
        });
      });
      toast.success('All voucher narration templates reset to factory defaults');
    }
  };

  const stats = useMemo(() => {
    return {
      total: vouchers.length,
      payment: vouchers.filter((v) => v.voucherType === 'Payment Voucher').length,
      receive: vouchers.filter((v) => v.voucherType === 'Receive Voucher').length,
      journal: vouchers.filter((v) => v.voucherType === 'Journal Voucher').length,
      contra: vouchers.filter((v) => v.voucherType === 'Contra Voucher').length,
    };
  }, [vouchers]);

  const getVoucherTypeBadge = (type: VoucherType) => {
    switch (type) {
      case 'Payment Voucher':
        return 'bg-rose-50 text-rose-700 border-rose-200/90';
      case 'Receive Voucher':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/90';
      case 'Journal Voucher':
        return 'bg-blue-50 text-blue-700 border-blue-200/90';
      case 'Contra Voucher':
        return 'bg-purple-50 text-purple-700 border-purple-200/90';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1600px] mx-auto space-y-5">
        {/* Page Breadcrumb & Header */}
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
                {vouchers.length} Vouchers Listed
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure dynamic auto-narration formulas and dynamic placeholders ({'{party_name}'}, {'{invoice_no}'}, {'{cheque_no}'}, {'{bank_name}'}) for each voucher.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAllToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              title="Reset all voucher narrations to factory defaults"
            >
              <RotateCcw className="size-3.5 text-slate-500" />
              <span>Reset All Defaults</span>
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Vouchers
              </span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">{stats.total}</span>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">
                Payment Vouchers
              </span>
              <span className="text-xl font-black text-rose-700 mt-0.5 block">{stats.payment}</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <CreditCard className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider block">
                Receive Vouchers
              </span>
              <span className="text-xl font-black text-emerald-700 mt-0.5 block">{stats.receive}</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider block">
                Journal Vouchers
              </span>
              <span className="text-xl font-black text-blue-700 mt-0.5 block">{stats.journal}</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="size-4.5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider block">
                Contra Vouchers
              </span>
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
              {[
                { label: 'All Vouchers', val: 'All' },
                { label: 'Payment Vouchers', val: 'Payment Voucher' },
                { label: 'Receive Vouchers', val: 'Receive Voucher' },
                { label: 'Journal Vouchers', val: 'Journal Voucher' },
                { label: 'Contra Vouchers', val: 'Contra Voucher' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => setSelectedType(tab.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedType === tab.val
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Auto-Narration Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Auto-Generate:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="All">All Vouchers</option>
                <option value="Enabled">Auto-Narration Enabled</option>
                <option value="Disabled">Disabled</option>
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
              placeholder="Search voucher name, short code (e.g. CPV, BPV), or narration template text..."
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Vouchers Table (Exact VOUCHER NAME column as requested in screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-72 whitespace-nowrap">Voucher Name</th>
                  <th className="py-3 px-4 w-36 text-center whitespace-nowrap">Voucher Type</th>
                  <th className="py-3 px-4 min-w-[380px]">Configured Dynamic Narration Templates</th>
                  <th className="py-3 px-4 w-32 text-center whitespace-nowrap">Auto-Generate</th>
                  <th className="py-3 px-4 w-44 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs italic">
                      No vouchers found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v) => {
                    const isAuto = v.autoNarrationEnabled !== false;
                    const items =
                      v.narrations && v.narrations.length > 0
                        ? v.narrations
                        : [
                            {
                              id: `def-${v.id}`,
                              title: 'Default Narration',
                              template: v.narrationTemplate || '',
                              isDefault: true,
                            },
                          ];
                    const defaultItem = items.find((i) => i.isDefault) || items[0];
                    const altItems = items.filter((i) => i.id !== defaultItem?.id);
                    const tmpl = defaultItem?.template || v.narrationTemplate || '';

                    return (
                      <tr key={v.id} className="hover:bg-slate-50/60 transition group">
                        {/* VOUCHER NAME (Matches user's screenshot exactly!) */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{v.name}</span>
                            {v.defaultAccounts && v.defaultAccounts.length > 0 && (
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                                {v.defaultAccounts.length} Default Accs
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold">
                              {v.shortName}
                            </span>
                            <span className="text-[10.5px] text-indigo-600 font-sans font-semibold">
                              • {items.length} {items.length === 1 ? 'Template' : 'Templates'}
                            </span>
                          </div>
                        </td>

                        {/* VOUCHER TYPE */}
                        <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border tracking-tight ${getVoucherTypeBadge(
                              v.voucherType
                            )}`}
                          >
                            {v.voucherType}
                          </span>
                        </td>

                        {/* CONFIGURED DYNAMIC NARRATION TEMPLATES */}
                        <td className="py-3.5 px-4 align-middle">
                          {tmpl ? (
                            <div className="space-y-1.5">
                              {/* Default Narration Header badge */}
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10.5px] font-bold border border-amber-200/80">
                                  <Star className="size-2.5 fill-amber-500 text-amber-500" />
                                  <span>{defaultItem?.title || 'Default Narration'}</span>
                                </span>
                              </div>

                              {/* Default Template with pills */}
                              <div className="text-slate-700 leading-relaxed font-normal text-xs">
                                {tmpl.split(/(\{.*?\})/).map((part, pIdx) => {
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

                              {/* Alternative Templates list */}
                              {altItems.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Dropdown Options:
                                  </span>
                                  {altItems.map((alt) => (
                                    <button
                                      key={alt.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveVoucher(v);
                                        setIsModalOpen(true);
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/80 transition cursor-pointer"
                                      title={alt.template}
                                    >
                                      <span>•</span>
                                      <span>{alt.title}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-slate-400 italic text-xs flex items-center gap-1">
                              <Sparkles className="size-3 text-slate-300" />
                              <span>Click "Configure" to set dynamic narration</span>
                            </div>
                          )}
                        </td>

                        {/* AUTO-GENERATE TOGGLE */}
                        <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleAuto(v)}
                            title="Click to toggle auto-narration on voucher entry"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition cursor-pointer shadow-2xs ${
                              isAuto
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isAuto ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            <span>{isAuto ? 'Auto Active' : 'Disabled'}</span>
                          </button>
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Configure / Edit button */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveVoucher(v);
                                setIsModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer shadow-2xs"
                              title="Configure dynamic narration formulas"
                            >
                              <SlidersHorizontal className="size-3 text-indigo-600" />
                              <span>Configure ({items.length})</span>
                            </button>

                            {/* Copy default template */}
                            {tmpl && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(v.id, tmpl)}
                                className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition cursor-pointer"
                                title="Copy default narration formula"
                              >
                                {copiedId === v.id ? (
                                  <Check className="size-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                            )}

                            {/* Reset to default for this voucher */}
                            <button
                              type="button"
                              onClick={() => handleResetSingle(v)}
                              className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition cursor-pointer"
                              title="Reset this voucher's narrations to default"
                            >
                              <RotateCcw className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Narration Config Modal */}
        <VoucherNarrationConfigModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveVoucher(null);
          }}
          voucher={activeVoucher}
          onSave={(id, newTemplate, newAutoEnabled, newNarrations) => {
            updateVoucherDefinition(id, {
              narrationTemplate: newTemplate,
              autoNarrationEnabled: newAutoEnabled,
              narrations: newNarrations,
            });
            toast.success(`Narration configuration updated for ${activeVoucher?.name}`);
          }}
        />
      </div>
    </div>
  );
};

export default NarrationSetupPage;
