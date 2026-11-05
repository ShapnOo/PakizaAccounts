import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Trash2, FolderPlus, BookOpen, Layers } from 'lucide-react';
import type { MasterListItem } from '../../types/isCustomization';

interface ManageMasterListModalProps {
  isOpen: boolean;
  masterList: MasterListItem[];
  usedLabels: Set<string>;
  onClose: () => void;
  onCreateMasterItem: (section: string, label: string) => Promise<any>;
  onDeleteMasterItem: (id: string) => Promise<void>;
}

export const ManageMasterListModal: React.FC<ManageMasterListModalProps> = ({
  isOpen,
  masterList,
  usedLabels,
  onClose,
  onCreateMasterItem,
  onDeleteMasterItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('Income - Operating Income');
  const [customSection, setCustomSection] = useState('');
  const [isNewSection, setIsNewSection] = useState(false);
  const [accountTitle, setAccountTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract all existing unique sections
  const existingSections = useMemo(() => {
    const set = new Set<string>();
    masterList.forEach((m) => {
      if (m.section) set.add(m.section);
    });
    return Array.from(set);
  }, [masterList]);

  // Grouped items filtered by search
  const groupedData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const map = new Map<string, MasterListItem[]>();

    masterList.forEach((item) => {
      if (item.isSectionHeader) return;
      if (q && !item.label.toLowerCase().includes(q) && !item.section.toLowerCase().includes(q)) {
        return;
      }
      const existing = map.get(item.section) || [];
      existing.push(item);
      map.set(item.section, existing);
    });

    return Array.from(map.entries());
  }, [masterList, search]);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSection = isNewSection ? customSection.trim() : selectedSection.trim();
    const finalTitle = accountTitle.trim();

    if (!finalSection || !finalTitle) return;

    setIsSubmitting(true);
    try {
      await onCreateMasterItem(finalSection, finalTitle);
      setAccountTitle('');
      if (isNewSection) {
        setIsNewSection(false);
        setSelectedSection(finalSection);
        setCustomSection('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAccounts = masterList.filter((m) => !m.isSectionHeader).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 font-sans">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <BookOpen className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Accounts Master List
              </h2>
              <p className="text-xs text-slate-500">
                Create new accounts, categories, and manage master lookup items
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Create Form Section */}
        <form onSubmit={handleCreate} className="p-4 border-b border-slate-200 bg-indigo-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Plus className="size-3.5" />
              <span>Create New Master Account</span>
            </span>
            <button
              type="button"
              onClick={() => setIsNewSection(!isNewSection)}
              className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              {isNewSection ? '← Select Existing Section' : '+ New Section / Category'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Section Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Category / Section
              </label>
              {isNewSection ? (
                <div className="relative">
                  <input
                    type="text"
                    value={customSection}
                    onChange={(e) => setCustomSection(e.target.value)}
                    placeholder="e.g. Income - Other Realization"
                    required
                    className="w-full h-8 px-2.5 rounded-lg border border-indigo-300 bg-white text-[13px] font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <FolderPlus className="size-3.5 text-indigo-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full h-8 pl-2.5 pr-8 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                  >
                    {existingSections.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                  <Layers className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Account Title Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Account Head Title
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="e.g. Export Cash Incentive"
                  required
                  className="flex-1 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[13px] font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !accountTitle.trim()}
                  className="px-3.5 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isSubmitting ? 'Adding...' : '+ Add'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Search Bar & Stats */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search master accounts..."
              className="w-full h-7 pl-8 pr-3 rounded-md border border-slate-200 text-[12px] font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <span className="text-[12px] text-slate-500 font-medium">
            Total <strong className="text-slate-800">{totalAccounts}</strong> accounts in{' '}
            <strong className="text-slate-800">{existingSections.length}</strong> categories
          </span>
        </div>

        {/* Master List Explorer */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {groupedData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching accounts found in master list.
            </div>
          ) : (
            groupedData.map(([section, items]) => (
              <div key={section} className="rounded-lg border border-slate-200/80 bg-slate-50/40 p-2.5 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 flex items-center justify-between">
                  <span>── {section} ──</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {items.length} accounts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {items.map((item) => {
                    const isUsed = usedLabels.has(item.label.toLowerCase());
                    return (
                      <div
                        key={item.id}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] flex items-center justify-between gap-2 group hover:border-slate-300"
                      >
                        <span className="truncate text-slate-800 font-medium">
                          {item.label}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUsed && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                              Active in report
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteMasterItem(item.id)}
                            className="text-slate-300 hover:text-rose-600 p-0.5 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                            title={`Delete "${item.label}" from Master List`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[13px] font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

