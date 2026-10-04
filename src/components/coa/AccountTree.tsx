import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, HierarchyLevel } from '../../types/coa';
import { formatAccountCode } from '../../lib/accountCode';
import { BaseDigitLegend } from './BaseDigitLegend';
import {
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Folder,
  FolderOpen,
  FileCode,
  MoreVertical,
  Edit2,
  PlusCircle,
  Power,
  Trash2,
  FolderTree,
  Search,
} from 'lucide-react';

interface AccountTreeProps {
  accounts: Account[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AccountTree: React.FC<AccountTreeProps> = ({
  accounts,
  onToggleActive,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Default: expand all parent accounts so the tree is fully visible
    return new Set(accounts.filter((a) => a.isParent).map((a) => a.id));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
  const treeNodes = useMemo(() => {
    const map = new Map<string, Account & { children: Account[] }>();
    const roots: (Account & { children: Account[] })[] = [];

    // Sort accounts by code
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

  // Flatten visible nodes according to expanded state and search
  const visibleRows = useMemo(() => {
    const rows: (Account & { hasChildren: boolean; isExpanded: boolean })[] = [];

    const traverse = (node: Account & { children: Account[] }) => {
      const hasChildren = node.children.length > 0 || node.isParent;
      const isExpanded = expandedIds.has(node.id);

      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        node.name.toLowerCase().includes(query) ||
        node.code.includes(query) ||
        node.path.some((p) => p.toLowerCase().includes(query));

      if (matchesSearch) {
        rows.push({
          ...node,
          hasChildren,
          isExpanded,
        });
      }

      if (isExpanded || query) {
        node.children.forEach(traverse);
      }
    };

    treeNodes.forEach(traverse);
    return rows;
  }, [treeNodes, expandedIds, searchQuery]);

  const getLevelColor = (level: HierarchyLevel) => {
    switch (level) {
      case 1:
        return 'bg-indigo-700/10 text-indigo-700 dark:text-indigo-400 border-indigo-700/25';
      case 2:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25';
      case 3:
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25';
      case 4:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
      case 5:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
      case 6:
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Toolbar: Search + Expand/Collapse Buttons ── */}
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

        {/* Tree controls (from sheet: "Expand | Collaps") */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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

      {/* ── Tree View Indented Table ── */}
      <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border/70 sticky top-0 z-10">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 select-none whitespace-nowrap">
                <th className="px-4 py-2.5 w-56 sm:w-64">Level No</th>
                <th className="px-3 py-2.5">Level-1</th>
                <th className="px-3 py-2.5">Level-2</th>
                <th className="px-3 py-2.5">Level-3</th>
                <th className="px-3 py-2.5">Level-4</th>
                <th className="px-3 py-2.5">Level-5</th>
                <th className="px-3 py-2.5">Level-6</th>
                <th className="px-3 py-2.5 w-12 text-right">⋮</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs">
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <FolderTree className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm font-semibold">No hierarchy nodes match your criteria</p>
                  </td>
                </tr>
              ) : (
                visibleRows.map((node) => {
                  const isMenuOpen = activeMenuId === node.id;
                  const isParent = node.isParent || node.hasChildren;

                  return (
                    <tr
                      key={node.id}
                      onClick={() => navigate(`/chart-of-accounts/${node.id}/edit`)}
                      className={`hover:bg-muted/35 transition-colors cursor-pointer group ${
                        node.activeStatus === 'Inactive' ? 'opacity-60 bg-muted/10' : ''
                      }`}
                    >
                      {/* 1. Level No with indent and Expand/Collapse chevron */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-[11px]">
                        <div
                          className="flex items-center gap-1.5"
                          style={{ paddingLeft: `${(node.level - 1) * 16}px` }}
                        >
                          {isParent ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(node.id);
                              }}
                              className="size-5 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer shrink-0"
                            >
                              {node.isExpanded ? (
                                <ChevronDown className="size-3.5 text-primary stroke-[2.5]" />
                              ) : (
                                <ChevronRight className="size-3.5 stroke-[2.5]" />
                              )}
                            </button>
                          ) : (
                            <div className="size-5 grid place-items-center shrink-0">
                              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                            </div>
                          )}

                          {isParent ? (
                            node.isExpanded ? (
                              <FolderOpen className="size-3.5 text-amber-500 shrink-0" />
                            ) : (
                              <Folder className="size-3.5 text-amber-500 shrink-0" />
                            )
                          ) : (
                            <FileCode className="size-3.5 text-primary/70 shrink-0" />
                          )}

                          <span className="font-bold text-foreground tracking-tight select-all">
                            {formatAccountCode(node.code)}
                          </span>
                        </div>
                      </td>

                      {/* 2. Level-1 Column */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {node.level === 1 ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-black text-[11px] border ${getLevelColor(
                              1
                            )}`}
                          >
                            <span>{node.name}</span>
                            {node.nameRaw && node.nameRaw !== node.name && (
                              <span className="text-[9px] font-mono italic text-amber-600">
                                [sic: {node.nameRaw}]
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/20 font-mono">—</span>
                        )}
                      </td>

                      {/* 3. Level-2 Column */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {node.level === 2 ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] border ${getLevelColor(
                              2
                            )}`}
                          >
                            {node.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/20 font-mono">—</span>
                        )}
                      </td>

                      {/* 4. Level-3 Column */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {node.level === 3 ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] border ${getLevelColor(
                              3
                            )}`}
                          >
                            {node.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/20 font-mono">—</span>
                        )}
                      </td>

                      {/* 5. Level-4 Column */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {node.level === 4 ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-[11px] border ${getLevelColor(
                              4
                            )}`}
                          >
                            {node.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/20 font-mono">—</span>
                        )}
                      </td>

                      {/* 6. Level-5 Column */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {node.level === 5 ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-[11px] border ${getLevelColor(
                              5
                            )}`}
                          >
                            {node.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/20 font-mono">—</span>
                        )}
                      </td>

                      {/* 7. Level-6 Column */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {node.level === 6 ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-[11px] border ${getLevelColor(
                              6
                            )}`}
                          >
                            {node.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/20 font-mono">—</span>
                        )}
                      </td>

                      {/* 8. Kebab Actions */}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <div
                          className="relative inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : node.id)}
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
                                    navigate(`/chart-of-accounts/${node.id}/edit`);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <Edit2 className="size-3.5 text-primary" />
                                  <span>Edit Account</span>
                                </button>

                                {node.level < 6 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      navigate(`/chart-of-accounts/new?parentId=${node.id}`);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                  >
                                    <PlusCircle className="size-3.5 text-emerald-600" />
                                    <span>Add Child (L{node.level + 1})</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onToggleActive(node.id);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <Power
                                    className={`size-3.5 ${
                                      node.activeStatus === 'Active'
                                        ? 'text-amber-500'
                                        : 'text-emerald-500'
                                    }`}
                                  />
                                  <span>
                                    {node.activeStatus === 'Active' ? 'Mark Inactive' : 'Mark Active'}
                                  </span>
                                </button>

                                <div className="my-1 border-t border-border/50" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDelete(node.id);
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

        {/* ── CRITICALLY IMPORTANT PINNED FOOTER STRIP ── */}
        <BaseDigitLegend />
      </div>
    </div>
  );
};
