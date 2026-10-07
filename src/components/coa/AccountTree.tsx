import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, HierarchyLevel } from '../../types/coa';
import { formatAccountCode } from '../../lib/accountCode';
import { BaseDigitLegend } from './BaseDigitLegend';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Power,
  FolderTree,
  Search,
  SlidersHorizontal,
  Table,
  Layers,
  Building2,
} from 'lucide-react';

interface AccountTreeProps {
  accounts: Account[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenCreate?: (parentId?: string | null) => void;
  onOpenEdit?: (account: Account) => void;
}

interface LevelConfig {
  headerName: string;
  addBtnText: string;
  headerBg: string;
  textColor: string;
  borderColor: string;
  btnBorderColor: string;
  btnTextColor: string;
  btnHoverBg: string;
}

const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    headerName: 'CLASS NAME',
    addBtnText: '+ Add Class',
    headerBg: 'bg-rose-50/70 dark:bg-rose-950/25',
    textColor: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-200/80 dark:border-rose-900/40',
    btnBorderColor: 'border-rose-300 dark:border-rose-800',
    btnTextColor: 'text-rose-600 dark:text-rose-400',
    btnHoverBg: 'hover:bg-rose-100/60 dark:hover:bg-rose-900/30',
  },
  2: {
    headerName: 'GROUP NAME',
    addBtnText: '+ Add Group',
    headerBg: 'bg-purple-50/70 dark:bg-purple-950/25',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200/80 dark:border-purple-900/40',
    btnBorderColor: 'border-purple-300 dark:border-purple-800',
    btnTextColor: 'text-purple-600 dark:text-purple-400',
    btnHoverBg: 'hover:bg-purple-100/60 dark:hover:bg-purple-900/30',
  },
  3: {
    headerName: 'SUBGROUP NAME',
    addBtnText: '+ Add Sub Group',
    headerBg: 'bg-sky-50/70 dark:bg-sky-950/25',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200/80 dark:border-sky-900/40',
    btnBorderColor: 'border-sky-300 dark:border-sky-800',
    btnTextColor: 'text-sky-600 dark:text-sky-400',
    btnHoverBg: 'hover:bg-sky-100/60 dark:hover:bg-sky-900/30',
  },
  4: {
    headerName: 'CONTROL NAME',
    addBtnText: '+ Add Control',
    headerBg: 'bg-amber-50/70 dark:bg-amber-950/25',
    textColor: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-200/80 dark:border-amber-900/40',
    btnBorderColor: 'border-amber-300 dark:border-amber-800',
    btnTextColor: 'text-amber-700 dark:text-amber-400',
    btnHoverBg: 'hover:bg-amber-100/60 dark:hover:bg-amber-900/30',
  },
  5: {
    headerName: 'GL ACCOUNT',
    addBtnText: '+ Add GL',
    headerBg: 'bg-teal-50/70 dark:bg-teal-950/25',
    textColor: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200/80 dark:border-teal-900/40',
    btnBorderColor: 'border-teal-300 dark:border-teal-800',
    btnTextColor: 'text-teal-600 dark:text-teal-400',
    btnHoverBg: 'hover:bg-teal-100/60 dark:hover:bg-teal-900/30',
  },
  6: {
    headerName: 'GL ACCOUNT',
    addBtnText: '+ Add GL',
    headerBg: 'bg-teal-50/70 dark:bg-teal-950/25',
    textColor: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200/80 dark:border-teal-900/40',
    btnBorderColor: 'border-teal-300 dark:border-teal-800',
    btnTextColor: 'text-teal-600 dark:text-teal-400',
    btnHoverBg: 'hover:bg-teal-100/60 dark:hover:bg-teal-900/30',
  },
};

type TreeNode = Omit<Account, 'children'> & { children: TreeNode[] };

export const AccountTree: React.FC<AccountTreeProps> = ({
  accounts,
  onToggleActive,
  onDelete,
  onOpenCreate,
  onOpenEdit,
}) => {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Default: expand all parent accounts so the tree is immediately rich and visible
    return new Set(accounts.filter((a) => a.isParent).map((a) => a.id));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [useCardLayout, setUseCardLayout] = useState(true);

  // Toggle single node expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand All
  const handleExpandAll = () => {
    const parentIds = accounts.filter((a) => a.isParent).map((a) => a.id);
    setExpandedIds(new Set(parentIds));
  };

  // Collapse All
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Build recursive tree
  const treeRoots = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Sort accounts by code or manualCode
    const sorted = [...accounts].sort((a, b) => a.code.localeCompare(b.code));

    sorted.forEach((acc) => {
      map.set(acc.id, { ...acc, children: [] });
    });

    sorted.forEach((acc) => {
      const node = map.get(acc.id)!;
      if (acc.parentId && map.has(acc.parentId)) {
        map.get(acc.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [accounts]);

  // Filter tree by search query
  const filterNode = (node: TreeNode, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    const matchSelf =
      node.name.toLowerCase().includes(q) ||
      node.code.includes(q) ||
      (node.manualCode && node.manualCode.includes(q));
    const matchChild = node.children.some((child) => filterNode(child, query));
    return matchSelf || matchChild;
  };

  const filteredRoots = useMemo(() => {
    if (!searchQuery.trim()) return treeRoots;
    return treeRoots.filter((root) => filterNode(root, searchQuery));
  }, [treeRoots, searchQuery]);

  // Render a node or its children according to the nested card design
  const renderCardLevel = (
    titleLevel: number,
    nodes: TreeNode[],
    parentAccount?: TreeNode
  ) => {
    if (!nodes || nodes.length === 0) return null;

    const config = LEVEL_CONFIGS[titleLevel] || LEVEL_CONFIGS[5];
    const isLeafLevel = nodes.every((n) => n.children.length === 0 && !n.isParent);

    return (
      <div
        className={`w-full rounded-2xl border ${config.borderColor} overflow-hidden shadow-2xs transition-all duration-200 mt-2.5 first:mt-0`}
      >
        {/* Tier Header Band (CLASS NAME, GROUP NAME, etc.) */}
        <div
          className={`px-4 py-2.5 ${config.headerBg} flex items-center justify-between border-b ${config.borderColor}`}
        >
          <span className={`text-[11px] font-black uppercase tracking-wider ${config.textColor}`}>
            {config.headerName}
          </span>

          <button
            type="button"
            onClick={() => {
              if (onOpenCreate) {
                onOpenCreate(parentAccount?.id || null);
              } else {
                navigate(
                  parentAccount
                    ? `/chart-of-accounts/new?parentId=${parentAccount.id}`
                    : `/chart-of-accounts/new`
                );
              }
            }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border ${config.btnBorderColor} bg-card/80 text-[11px] font-bold ${config.btnTextColor} ${config.btnHoverBg} shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95`}
          >
            <Plus className="size-3 stroke-[2.5]" />
            <span>{config.addBtnText}</span>
          </button>
        </div>

        {/* Level Body */}
        <div className="p-3 bg-card/60 space-y-2.5">
          {/* If this is the deepest leaf level (GL ACCOUNT), render the exact clean table from the screenshot */}
          {isLeafLevel ? (
            <div className="border border-border/70 rounded-xl overflow-hidden shadow-2xs bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/30 border-b border-border/60 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-4 font-black">GL TITLE</th>
                    <th className="py-2.5 px-4 font-black">MANUAL CODE</th>
                    <th className="py-2.5 px-4 font-black">TYPE</th>
                    <th className="py-2.5 px-4 font-black">STATUS</th>
                    <th className="py-2.5 px-4 font-black text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {nodes.map((leaf) => (
                    <tr
                      key={leaf.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-2.5 px-4 font-semibold text-foreground">
                        {leaf.name}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-foreground/80">
                        {leaf.manualCode || formatAccountCode(leaf.code)}
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground font-mono text-[11px]">
                        {leaf.detailsType || leaf.accountsType.toLowerCase().replace(/\s+/g, '_')}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            leaf.activeStatus === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              leaf.activeStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{leaf.activeStatus}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenEdit) {
                              onOpenEdit(leaf);
                            } else {
                              navigate(`/chart-of-accounts/${leaf.id}/edit`);
                            }
                          }}
                          className="size-7 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground inline-grid place-items-center transition-colors cursor-pointer"
                          title="Edit Account"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Otherwise, render each row in this level */
            nodes.map((node) => {
              const isExpanded = expandedIds.has(node.id);
              const hasChildren = node.children.length > 0;
              const displayCode = node.manualCode || formatAccountCode(node.code);

              return (
                <div key={node.id} className="space-y-2">
                  {/* Item Row Header Card */}
                  <div
                    onClick={() => hasChildren && toggleExpand(node.id)}
                    className="p-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-all flex items-center justify-between shadow-2xs gap-3 cursor-pointer group"
                  >
                    {/* Left: Chevron + Code :: Title */}
                    <div className="flex items-center gap-2.5 truncate">
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(node.id);
                          }}
                          className="size-6 rounded-md border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3.5 text-foreground stroke-[2.5]" />
                          ) : (
                            <ChevronRight className="size-3.5 text-foreground stroke-[2.5]" />
                          )}
                        </button>
                      ) : (
                        <div className="size-6 grid place-items-center shrink-0">
                          <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground truncate">
                        <span className="font-mono font-bold text-foreground/85">{displayCode}</span>
                        <span className="text-muted-foreground/60 font-bold">::</span>
                        <span className="truncate">{node.name}</span>
                        {node.nameRaw && node.nameRaw !== node.name && (
                          <span className="text-[10px] text-amber-600 font-mono italic">
                            [sic: {node.nameRaw}]
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Pill + Edit Button */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onToggleActive(node.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border transition-colors cursor-pointer ${
                          node.activeStatus === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15'
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/25 hover:bg-rose-500/15'
                        }`}
                        title="Click to toggle Active / Inactive"
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            node.activeStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{node.activeStatus}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenEdit) {
                            onOpenEdit(node);
                          } else {
                            navigate(`/chart-of-accounts/${node.id}/edit`);
                          }
                        }}
                        className="size-7 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer shadow-2xs"
                        title="Edit Account"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Nested Child Card Level */}
                  {isExpanded && hasChildren && (
                    <div className="pl-3 sm:pl-4">
                      {renderCardLevel(titleLevel + 1, node.children, node)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar: Search + Layout Toggle + Expand/Collapse Buttons ── */}
      <div className="bg-card border border-border/70 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search hierarchy tree..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
          />
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Layout Toggle (Nested Cards vs Indented Table) */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setUseCardLayout(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                useCardLayout
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="size-3 text-primary" />
              <span>Card Hierarchy</span>
            </button>
            <button
              type="button"
              onClick={() => setUseCardLayout(false)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                !useCardLayout
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Table className="size-3 text-muted-foreground" />
              <span>Tree Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExpandAll}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronDown className="size-3.5 text-primary" />
            <span>Expand All</span>
          </button>

          <button
            type="button"
            onClick={handleCollapseAll}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* ── Main Tree Content ── */}
      {useCardLayout ? (
        /* ── Screen B: Exact Nested Card Layout from Screenshot ── */
        <div className="space-y-4">
          {filteredRoots.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-border/70">
              <FolderTree className="size-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold">No accounts found matching your query</p>
            </div>
          ) : (
            renderCardLevel(1, filteredRoots)
          )}

          {/* Pinned Base Digit Legend Strip */}
          <div className="rounded-xl border border-border/70 overflow-hidden shadow-2xs">
            <BaseDigitLegend />
          </div>
        </div>
      ) : (
        /* ── Alternative: Indented Tree Table ── */
        <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto sidebar-scroll">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-muted/30 border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <tr>
                  <th className="px-4 py-2.5 w-64">Level No</th>
                  <th className="px-3 py-2.5">Level-1</th>
                  <th className="px-3 py-2.5">Level-2</th>
                  <th className="px-3 py-2.5">Level-3</th>
                  <th className="px-3 py-2.5">Level-4</th>
                  <th className="px-3 py-2.5">Level-5</th>
                  <th className="px-3 py-2.5">Level-6</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    onClick={() => {
                      if (onOpenEdit) {
                        onOpenEdit(acc);
                      } else {
                        navigate(`/chart-of-accounts/${acc.id}/edit`);
                      }
                    }}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2 font-mono font-bold text-foreground">
                      <div
                        className="flex items-center gap-1.5"
                        style={{ paddingLeft: `${(acc.level - 1) * 16}px` }}
                      >
                        <span className="size-1.5 rounded-full bg-primary shrink-0" />
                        <span>{formatAccountCode(acc.code)}</span>
                      </div>
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((lvl) => (
                      <td key={lvl} className="px-3 py-2 whitespace-nowrap">
                        {acc.level === lvl ? (
                          <span className="font-semibold text-foreground">{acc.name}</span>
                        ) : (
                          <span className="text-muted-foreground/20">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenEdit) {
                            onOpenEdit(acc);
                          } else {
                            navigate(`/chart-of-accounts/${acc.id}/edit`);
                          }
                        }}
                        className="size-6 rounded border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground inline-grid place-items-center transition-colors cursor-pointer"
                      >
                        <Edit2 className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <BaseDigitLegend />
        </div>
      )}
    </div>
  );
};
