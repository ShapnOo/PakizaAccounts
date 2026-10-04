import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Account, HierarchyLevel } from '../../types/coa';
import { formatAccountCode } from '../../lib/accountCode';
import {
  Search,
  MoreVertical,
  Edit2,
  PlusCircle,
  Power,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2,
  CheckCircle,
  XCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { ACCOUNTS_TYPE_TREE, COMPANY } from '../../constants/accountsTypeTree';

interface AccountTableProps {
  accounts: Account[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onToggleActive,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [accountsTypeFilter, setAccountsTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter accounts
  const filteredData = useMemo(() => {
    return accounts.filter((acc) => {
      // Type filter
      if (accountsTypeFilter !== 'All' && acc.accountsType !== accountsTypeFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && acc.activeStatus !== statusFilter) {
        return false;
      }
      // Global search across path, code, name
      if (globalFilter.trim()) {
        const query = globalFilter.toLowerCase();
        const matchesName = acc.name.toLowerCase().includes(query);
        const matchesCode = acc.code.includes(query);
        const matchesPath = acc.path.some((p) => p.toLowerCase().includes(query));
        const matchesType = acc.accountsType.toLowerCase().includes(query);
        return matchesName || matchesCode || matchesPath || matchesType;
      }
      return true;
    });
  }, [accounts, accountsTypeFilter, statusFilter, globalFilter]);

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

  const columns = useMemo<ColumnDef<Account>[]>(
    () => [
      // 1. Level No (Formatted 12-digit code)
      {
        accessorKey: 'code',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 font-mono font-bold hover:text-foreground text-[11px] tracking-wide"
          >
            <span>Level No</span>
            <ArrowUpDown className="size-3 text-muted-foreground/60" />
          </button>
        ),
        cell: (info) => (
          <div className="font-mono text-[11px] font-bold text-foreground tracking-tight select-all">
            {formatAccountCode(info.getValue() as string)}
          </div>
        ),
        size: 170,
      },

      // 2. Level-1
      {
        id: 'level1',
        header: 'Level-1',
        cell: ({ row }) => {
          const acc = row.original;
          const val = acc.path[0];
          return val ? getLevelBadge(1, val, acc.level === 1 ? acc.nameRaw : undefined) : (
            <span className="text-muted-foreground/30">—</span>
          );
        },
      },

      // 3. Level-2
      {
        id: 'level2',
        header: 'Level-2',
        cell: ({ row }) => {
          const acc = row.original;
          const val = acc.path[1];
          return val ? getLevelBadge(2, val, acc.level === 2 ? acc.nameRaw : undefined) : (
            <span className="text-muted-foreground/30">—</span>
          );
        },
      },

      // 4. Level-3
      {
        id: 'level3',
        header: 'Level-3',
        cell: ({ row }) => {
          const acc = row.original;
          const val = acc.path[2];
          return val ? getLevelBadge(3, val, acc.level === 3 ? acc.nameRaw : undefined) : (
            <span className="text-muted-foreground/30">—</span>
          );
        },
      },

      // 5. Level-4
      {
        id: 'level4',
        header: 'Level-4',
        cell: ({ row }) => {
          const acc = row.original;
          const val = acc.path[3];
          return val ? getLevelBadge(4, val, acc.level === 4 ? acc.nameRaw : undefined) : (
            <span className="text-muted-foreground/30">—</span>
          );
        },
      },

      // 6. Level-5
      {
        id: 'level5',
        header: 'Level-5',
        cell: ({ row }) => {
          const acc = row.original;
          const val = acc.path[4];
          return val ? getLevelBadge(5, val, acc.level === 5 ? acc.nameRaw : undefined) : (
            <span className="text-muted-foreground/30">—</span>
          );
        },
      },

      // 7. Level-6
      {
        id: 'level6',
        header: 'Level-6',
        cell: ({ row }) => {
          const acc = row.original;
          const val = acc.path[5];
          return val ? getLevelBadge(6, val, acc.level === 6 ? acc.nameRaw : undefined) : (
            <span className="text-muted-foreground/30">—</span>
          );
        },
      },

      // 8. Actions column (⋮)
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const acc = row.original;
          const isMenuOpen = activeMenuId === acc.id;

          return (
            <div
              className="relative flex items-center justify-end"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-popover rounded-xl border border-border shadow-xl p-1 animate-in fade-in-50 zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuId(null);
                        navigate(`/chart-of-accounts/${acc.id}/edit`);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
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
                        className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
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
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Power
                        className={`size-3.5 ${
                          acc.activeStatus === 'Active' ? 'text-amber-500' : 'text-emerald-500'
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
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [activeMenuId, navigate, onDelete, onToggleActive]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

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
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
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
              onChange={(e) => setAccountsTypeFilter(e.target.value)}
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
              onChange={(e: any) => setStatusFilter(e.target.value)}
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

      {/* ── TanStack Table ── */}
      <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border/70 sticky top-0 z-10 backdrop-blur-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 select-none whitespace-nowrap"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                    <p className="text-sm font-semibold">No accounts found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/chart-of-accounts/${row.original.id}/edit`)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`px-3.5 ${rowPadding} whitespace-nowrap`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
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
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-foreground">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  filteredData.length
                )}
              </strong>{' '}
              of <strong className="text-foreground">{filteredData.length}</strong> accounts
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1 ml-3">
              <span className="text-[11px]">Rows:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="h-7 px-2 rounded-md bg-card border border-border/80 text-xs font-semibold text-foreground outline-none cursor-pointer"
              >
                {[25, 50, 100, 500].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize === 500 ? 'All' : pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-foreground">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-7 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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
