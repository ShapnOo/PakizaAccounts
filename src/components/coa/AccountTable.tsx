import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, HierarchyLevel } from '../../types/coa';
import { formatAccountCode } from '../../lib/accountCode';
import {
  Search,
  MoreVertical,
  Edit2,
  PlusCircle,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { ACCOUNTS_TYPE_TREE } from '../../constants/accountsTypeTree';

interface AccountTableProps {
  accounts: Account[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortField = 'code' | 'name' | 'level';
type SortOrder = 'asc' | 'desc';

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onToggleActive,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountsTypeFilter, setAccountsTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // 1. Filter Data
  const filteredData = useMemo(() => {
    return accounts.filter((acc) => {
      if (accountsTypeFilter !== 'All' && acc.accountsType !== accountsTypeFilter) {
        return false;
      }
      if (statusFilter !== 'All' && acc.activeStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = acc.name.toLowerCase().includes(query);
        const matchesCode = acc.code.includes(query);
        const matchesPath = acc.path.some((p) => p.toLowerCase().includes(query));
        const matchesType = acc.accountsType.toLowerCase().includes(query);
        return matchesName || matchesCode || matchesPath || matchesType;
      }
      return true;
    });
  }, [accounts, accountsTypeFilter, statusFilter, searchQuery]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'code') {
        comparison = a.code.localeCompare(b.code);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'level') {
        comparison = a.level - b.level;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortOrder]);

  // 3. Paginate Data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Level Badge Colors
  const getLevelBadge = (level: HierarchyLevel, text: string, nameRaw?: string) => {
    const isTypo = !!nameRaw && nameRaw !== text;
    let colorClass = '';
    switch (level) {
      case 1:
        colorClass = 'bg-indigo-700/10 text-indigo-700 dark:text-indigo-400 border-indigo-700/25';
        break;
      case 2:
        colorClass = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25';
        break;
      case 3:
        colorClass = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25';
        break;
      case 4:
        colorClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
        break;
      case 5:
        colorClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
        break;
      case 6:
        colorClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';
        break;
    }

    return (
      <div className="flex items-center gap-1.5 truncate">
        <span
          className={`inline-block font-semibold text-[11px] px-2 py-0.5 rounded border truncate ${colorClass}`}
          title={isTypo ? `Source text verbatim: "${nameRaw}"` : text}
        >
          {text}
        </span>
        {isTypo && (
          <span
            className="text-[9.5px] text-amber-600 dark:text-amber-400 font-mono italic shrink-0"
            title={`Source string typo: "${nameRaw}"`}
          >
            [sic: {nameRaw}]
          </span>
        )}
      </div>
    );
  };

  const rowPadding = density === 'comfortable' ? 'py-2.5' : 'py-1.5';

  return (
    <div className="space-y-3">
      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-card border border-border/70 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search level paths, account code, or title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
          />
        </div>

        {/* Right: Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Accounts Type Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <Filter className="size-3 text-muted-foreground" />
            <select
              value={accountsTypeFilter}
              onChange={(e) => {
                setAccountsTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Account Types</option>
              {Array.from(new Set(ACCOUNTS_TYPE_TREE.map((t) => t.type))).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2 py-1 rounded-lg shadow-2xs">
            <select
              value={statusFilter}
              onChange={(e: any) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
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

      {/* ── Table Container ── */}
      <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border/70 sticky top-0 z-10 backdrop-blur-xs">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 select-none whitespace-nowrap">
                <th className="px-3.5 py-2.5 w-48">
                  <button
                    type="button"
                    onClick={() => handleSortToggle('code')}
                    className="flex items-center gap-1 font-mono font-bold hover:text-foreground text-[11px] tracking-wide"
                  >
                    <span>Level No</span>
                    <ArrowUpDown className="size-3 text-muted-foreground/60" />
                  </button>
                </th>
                <th className="px-3.5 py-2.5">Level-1</th>
                <th className="px-3.5 py-2.5">Level-2</th>
                <th className="px-3.5 py-2.5">Level-3</th>
                <th className="px-3.5 py-2.5">Level-4</th>
                <th className="px-3.5 py-2.5">Level-5</th>
                <th className="px-3.5 py-2.5">Level-6</th>
                <th className="px-3.5 py-2.5 w-12 text-right">⋮</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <p className="text-sm font-semibold">No accounts found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((acc) => {
                  const isMenuOpen = activeMenuId === acc.id;

                  return (
                    <tr
                      key={acc.id}
                      onClick={() => navigate(`/chart-of-accounts/${acc.id}/edit`)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      {/* 1. Level No */}
                      <td className="px-3.5 py-2 whitespace-nowrap font-mono text-[11px] font-bold text-foreground tracking-tight select-all">
                        {formatAccountCode(acc.code)}
                      </td>

                      {/* 2. Level-1 */}
                      <td className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {acc.path[0] ? (
                          getLevelBadge(1, acc.path[0], acc.level === 1 ? acc.nameRaw : undefined)
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      {/* 3. Level-2 */}
                      <td className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {acc.path[1] ? (
                          getLevelBadge(2, acc.path[1], acc.level === 2 ? acc.nameRaw : undefined)
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      {/* 4. Level-3 */}
                      <td className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {acc.path[2] ? (
                          getLevelBadge(3, acc.path[2], acc.level === 3 ? acc.nameRaw : undefined)
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      {/* 5. Level-4 */}
                      <td className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {acc.path[3] ? (
                          getLevelBadge(4, acc.path[3], acc.level === 4 ? acc.nameRaw : undefined)
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      {/* 6. Level-5 */}
                      <td className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {acc.path[4] ? (
                          getLevelBadge(5, acc.path[4], acc.level === 5 ? acc.nameRaw : undefined)
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      {/* 7. Level-6 */}
                      <td className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {acc.path[5] ? (
                          getLevelBadge(6, acc.path[5], acc.level === 6 ? acc.nameRaw : undefined)
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      {/* 8. Kebab Actions */}
                      <td
                        className="px-3.5 py-2 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : acc.id)}
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
                                    navigate(`/chart-of-accounts/${acc.id}/edit`);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <Edit2 className="size-3.5 text-primary" />
                                  <span>Edit Account</span>
                                </button>

                                {acc.level < 6 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      navigate(`/chart-of-accounts/new?parentId=${acc.id}`);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                  >
                                    <PlusCircle className="size-3.5 text-emerald-600" />
                                    <span>Add Child (L{acc.level + 1})</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onToggleActive(acc.id);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <Power
                                    className={`size-3.5 ${
                                      acc.activeStatus === 'Active'
                                        ? 'text-amber-500'
                                        : 'text-emerald-500'
                                    }`}
                                  />
                                  <span>
                                    {acc.activeStatus === 'Active' ? 'Mark Inactive' : 'Mark Active'}
                                  </span>
                                </button>

                                <div className="my-1 border-t border-border/50" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDelete(acc.id);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
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

        {/* ── Table Footer & Pagination ── */}
        <div className="p-3 border-t border-border/60 bg-muted/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-foreground">
                {sortedData.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-foreground">
                {Math.min(safeCurrentPage * pageSize, sortedData.length)}
              </strong>{' '}
              of <strong className="text-foreground">{sortedData.length}</strong> accounts
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1 ml-3">
              <span className="text-[11px]">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 rounded-md bg-card border border-border/80 text-xs font-semibold text-foreground outline-none cursor-pointer"
              >
                {[25, 50, 100, 500].map((size) => (
                  <option key={size} value={size}>
                    {size === 500 ? 'All' : size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage <= 1}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-foreground">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage >= totalPages}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
