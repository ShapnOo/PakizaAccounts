import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVouchers } from '../../context/VoucherContext';
import { VoucherTypeChip } from '../../components/vouchers/VoucherTypeChip';
import { VoucherDefinition, VoucherType } from '../../types/voucher';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Copy,
  Power,
  Trash2,
  FilePlus2,
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
  Printer,
} from 'lucide-react';

export const VoucherListPage: React.FC = () => {
  const navigate = useNavigate();
  const { vouchers, toggleVoucherActive, deleteVoucherDefinition, createVoucherDefinition } =
    useVouchers();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      if (typeFilter !== 'All' && v.voucherType !== typeFilter) return false;
      if (statusFilter !== 'All' && v.activeStatus !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.shortName.toLowerCase().includes(q) ||
          v.voucherType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vouchers, typeFilter, statusFilter, search]);

  const handleDuplicate = (v: VoucherDefinition) => {
    createVoucherDefinition({
      name: `${v.name} (Copy)`,
      shortName: `${v.shortName}C`,
      voucherType: v.voucherType,
      activeStatus: 'Active',
      defaultAccounts: [...v.defaultAccounts],
    });
  };

  const rowPadding = density === 'comfortable' ? 'py-3' : 'py-2';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* ── Breadcrumb & Page Header ── */}
      <div className="space-y-3 pb-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span>Accounts Configuration</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-primary font-black">Voucher Setup</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shadow-2xs">
              <Receipt className="size-4.5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <span>Voucher Setup</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {vouchers.length} Types
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Master list of voucher definitions, counter-side default accounts, and entry classifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/accounts-report/journal"
              className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="size-3.5 text-indigo-600" />
              <span>Print Templates</span>
            </Link>

            <Link
              to="/vouchers/new"
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Voucher</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Quick Voucher Entry Shortcuts Banner ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Link
          to="/vouchers/entry/journal"
          className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">
              JV Entry
            </span>
            <p className="text-xs font-bold text-foreground">Journal Voucher</p>
          </div>
          <ArrowRight className="size-3.5 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/vouchers/entry/payment"
          className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono font-black text-rose-600 dark:text-rose-400">
              PV Entry
            </span>
            <p className="text-xs font-bold text-foreground">Payment Voucher</p>
          </div>
          <ArrowRight className="size-3.5 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/vouchers/entry/receive"
          className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400">
              RV Entry
            </span>
            <p className="text-xs font-bold text-foreground">Receive Voucher</p>
          </div>
          <ArrowRight className="size-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/vouchers/entry/contra"
          className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono font-black text-amber-600 dark:text-amber-400">
              CV Entry
            </span>
            <p className="text-xs font-bold text-foreground">Contra Voucher</p>
          </div>
          <ArrowRight className="size-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Toolbar: Search & Filters ── */}
      <div className="bg-card border border-border/70 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search voucher name, short code, or classification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
          />
        </div>

        {/* Right: Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <Filter className="size-3 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Voucher Types</option>
              <option value="Journal Voucher">Journal Voucher</option>
              <option value="Payment Voucher">Payment Voucher</option>
              <option value="Receive Voucher">Receive Voucher</option>
              <option value="Contra Voucher">Contra Voucher</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Density Toggle */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                density === 'comfortable'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                density === 'compact'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* ── Table: Sheet 1 (Voucher Page list) ── */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/30 border-b border-border/70 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-2.5 px-4 font-black">Voucher Name</th>
              <th className="py-2.5 px-4 font-black w-32">Short Name</th>
              <th className="py-2.5 px-4 font-black w-48">Voucher Type</th>
              <th className="py-2.5 px-4 font-black w-32 text-center">Active Status</th>
              <th className="py-2.5 px-4 font-black w-16 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredVouchers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  <Receipt className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm font-semibold">No voucher definitions found</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Click "New Voucher" to configure your first voucher format.
                  </p>
                </td>
              </tr>
            ) : (
              filteredVouchers.map((v) => {
                const isMenuOpen = activeMenuId === v.id;

                return (
                  <tr
                    key={v.id}
                    onClick={() => navigate(`/vouchers/${v.id}/setup`)}
                    className="hover:bg-muted/25 transition-colors cursor-pointer group"
                  >
                    {/* Voucher Name */}
                    <td className={`px-4 ${rowPadding} font-semibold text-foreground`}>
                      <div className="flex items-center gap-2">
                        <span>{v.name}</span>
                        {v.defaultAccounts.length > 0 && (
                          <span className="text-[10px] font-mono text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                            {v.defaultAccounts.length} Default Accs
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Short Name */}
                    <td className={`px-4 ${rowPadding} font-mono font-bold text-foreground/80`}>
                      <span className="px-2 py-0.5 rounded bg-muted/70 border border-border/60">
                        {v.shortName}
                      </span>
                    </td>

                    {/* Voucher Type Chip */}
                    <td className={`px-4 ${rowPadding}`}>
                      <VoucherTypeChip type={v.voucherType} size="sm" />
                    </td>

                    {/* Active Status */}
                    <td className={`px-4 ${rowPadding} text-center`}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          v.activeStatus === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            v.activeStatus === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                          }`}
                        />
                        <span>{v.activeStatus}</span>
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td
                      className={`px-4 ${rowPadding} text-right`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : v.id)}
                          className="size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer"
                        >
                          <MoreVertical className="size-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-popover rounded-xl border border-border shadow-xl p-1 text-left animate-in fade-in-50 zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  navigate(`/vouchers/${v.id}/setup`);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Edit2 className="size-3.5 text-primary" />
                                <span>Edit Setup</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  const typeSlug = v.voucherType.replace(' Voucher', '');
                                  navigate(`/accounts-report/journal?type=${typeSlug}`);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Printer className="size-3.5 text-indigo-600" />
                                <span>Print Template</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleDuplicate(v);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Copy className="size-3.5 text-sky-600" />
                                <span>Duplicate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  toggleVoucherActive(v.id);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Power
                                  className={`size-3.5 ${
                                    v.activeStatus === 'Active'
                                      ? 'text-amber-500'
                                      : 'text-emerald-500'
                                  }`}
                                />
                                <span>
                                  {v.activeStatus === 'Active' ? 'Deactivate' : 'Activate'}
                                </span>
                              </button>

                              <div className="my-1 border-t border-border/50" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  deleteVoucherDefinition(v.id);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
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
  );
};

export default VoucherListPage;
