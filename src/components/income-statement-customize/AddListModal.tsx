import React, { useState, useMemo } from 'react';
import { Search, X, Check, Layers, Plus, FolderPlus } from 'lucide-react';
import { useISCustomizationStore } from '../../stores/isCustomizationStore';
import type { ISCustomRow, MasterListItem } from '../../types/isCustomization';

interface AddListModalProps {
  isOpen: boolean;
  parentRows: ISCustomRow[];
  currentRows: ISCustomRow[];
  onClose: () => void;
  onAddLines: (items: MasterListItem[], parentCode: string) => void;
  onOpenManageMaster?: () => void;
}

export const AddListModal: React.FC<AddListModalProps> = ({
  isOpen,
  parentRows,
  currentRows,
  onClose,
  onAddLines,
  onOpenManageMaster,
}) => {
  const masterList = useISCustomizationStore((s) => s.masterList);
  const createMasterItem = useISCustomizationStore((s) => s.createMasterItem);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedParentCode, setSelectedParentCode] = useState<string>(
    parentRows[0]?.code ?? 'A'
  );
  const [search, setSearch] = useState('');

  // Quick inline master account creation state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSection, setNewSection] = useState('Income - Operating Income');
  const [newLabel, setNewLabel] = useState('');
  const [isSavingNew, setIsSavingNew] = useState(false);

  // Set of labels already present in current rows
  const existingLabels = useMemo(() => {
    return new Set(currentRows.map((r) => r.particulars.trim().toLowerCase()));
  }, [currentRows]);

  // Unique sections in master list
  const uniqueSections = useMemo(() => {
    const set = new Set<string>();
    masterList.forEach((m) => {
      if (m.section) set.add(m.section);
    });
    return Array.from(set);
  }, [masterList]);

  // Group leaf items by section
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

  const toggleSelect = (id: string, alreadyAdded: boolean) => {
    if (alreadyAdded) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateNewMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setIsSavingNew(true);
    try {
      const created = await createMasterItem(newSection, newLabel.trim());
      if (created) {
        setSelectedIds((prev) => [...prev, created.id]);
      }
      setNewLabel('');
      setIsCreatingNew(false);
    } finally {
      setIsSavingNew(false);
    }
  };

  const handleConfirm = () => {
    const chosenItems = masterList.filter((m) => selectedIds.includes(m.id));
    if (chosenItems.length === 0) return;
    onAddLines(chosenItems, selectedParentCode);
    setSelectedIds([]);
    setSearch('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Add Lines from Master List
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick accounts from the master list or create new master accounts directly.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Controls: Search + Target Section + "+ Create Master Item" button */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search master accounts..."
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-[13px] font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Target Head Assignment Combobox */}
            <div className="relative">
              <select
                value={selectedParentCode}
                onChange={(e) => setSelectedParentCode(e.target.value)}
                className="w-full h-8 pl-8 pr-8 rounded-lg bg-white border border-slate-200 text-[13px] font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
              >
                {parentRows.map((p) => (
                  <option key={p.id} value={p.code}>
                    Assign to: Head {p.code} — {p.particulars}
                  </option>
                ))}
              </select>
              <Layers className="size-3.5 text-indigo-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Create Master Account Toolbar Toggle */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>{isCreatingNew ? 'Close New Account Form' : '+ Create New Account in Master List'}</span>
            </button>

            {onOpenManageMaster && (
              <button
                type="button"
                onClick={onOpenManageMaster}
                className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Manage All Master Accounts →
              </button>
            )}
          </div>

          {/* Quick Create Inline Form */}
          {isCreatingNew && (
            <form onSubmit={handleCreateNewMaster} className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-200 flex flex-wrap sm:flex-nowrap items-center gap-2">
              <select
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="h-7 px-2 rounded border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 outline-none"
              >
                {uniqueSections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Account Title (e.g. Subcontract Cost)..."
                required
                className="flex-1 min-w-[180px] h-7 px-2.5 rounded border border-slate-200 bg-white text-[12px] font-medium outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={isSavingNew || !newLabel.trim()}
                className="px-3 h-7 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                {isSavingNew ? 'Saving...' : 'Add & Select'}
              </button>
            </form>
          )}
        </div>

        {/* Master List Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {groupedData.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching account items found.
            </div>
          ) : (
            groupedData.map(([section, items]) => (
              <div key={section} className="rounded-lg border border-slate-100 bg-slate-50/40 p-2.5">
                {/* Non-selectable Section Header */}
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1 flex items-center justify-between">
                  <span>── {section} ──</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {items.length} accounts
                  </span>
                </div>

                {/* Leaf Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {items.map((item) => {
                    const isAlreadyAdded = existingLabels.has(item.label.toLowerCase());
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSelect(item.id, isAlreadyAdded)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            toggleSelect(item.id, isAlreadyAdded);
                          }
                        }}
                        className={`p-2 rounded-lg border text-[13px] flex items-center justify-between gap-2 transition cursor-pointer select-none ${
                          isAlreadyAdded
                            ? 'bg-slate-100/60 border-slate-200/60 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isSelected || isAlreadyAdded}
                            disabled={isAlreadyAdded}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5"
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {isAlreadyAdded && (
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">
                            Already added
                          </span>
                        )}
                        {!isAlreadyAdded && isSelected && (
                          <Check className="size-3.5 text-indigo-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-[12px] text-slate-600">
            <span className="font-semibold text-slate-800">{selectedIds.length}</span> items selected
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[13px] font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add {selectedIds.length > 0 ? `${selectedIds.length} ` : ''}Lines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
