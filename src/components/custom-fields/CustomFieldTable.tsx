import React, { useState, useMemo } from 'react';
import { CustomField, CustomFieldContext, CustomFieldDataType, DATA_TYPES } from '../../types/customField';
import { CustomFieldRow } from './CustomFieldRow';
import { TableSkeleton } from './TableSkeleton';
import { EmptyState } from './EmptyState';
import { DataTypeChip } from './DataTypeChip';
import { MandatoryPill } from './MandatoryPill';
import { ActiveStatusPill } from './ActiveStatusPill';
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  GripVertical,
  Pencil,
  Copy,
  Trash2,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react';

interface CustomFieldTableProps {
  context: CustomFieldContext;
  fields: CustomField[];
  loading: boolean;
  onEdit: (field: CustomField) => void;
  onDuplicate: (id: string) => void;
  onDelete: (field: CustomField) => void;
  onToggleMandatory: (id: string) => void;
  onToggleActive: (id: string) => void;
  onInlineRename: (id: string, newLabel: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onAddNew: () => void;
}

export const CustomFieldTable: React.FC<CustomFieldTableProps> = ({
  context,
  fields,
  loading,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleMandatory,
  onToggleActive,
  onInlineRename,
  onReorder,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<CustomFieldDataType[]>([]);
  const [mandatoryFilter, setMandatoryFilter] = useState<'All' | 'Yes' | 'No'>('All');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Filter fields belonging to current context
  const contextFields = useMemo(() => {
    return fields
      .filter((f) => f.context === context)
      .sort((a, b) => a.order - b.order);
  }, [fields, context]);

  // Filtered by search & filters
  const filteredFields = useMemo(() => {
    return contextFields.filter((field) => {
      // 1. Search
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!field.label.toLowerCase().includes(q)) return false;
      }
      // 2. Data Type
      if (selectedTypes.length > 0 && !selectedTypes.includes(field.dataType)) {
        return false;
      }
      // 3. Mandatory
      if (mandatoryFilter === 'Yes' && !field.mandatory) return false;
      if (mandatoryFilter === 'No' && field.mandatory) return false;
      // 4. Active Status
      if (activeFilter !== 'All' && field.activeStatus !== activeFilter) {
        return false;
      }
      return true;
    });
  }, [contextFields, search, selectedTypes, mandatoryFilter, activeFilter]);

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedTypes.length > 0 ||
    mandatoryFilter !== 'All' ||
    activeFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setSelectedTypes([]);
    setMandatoryFilter('All');
    setActiveFilter('All');
  };

  // Reorder handlers
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contextFields.length) return;

    const copy = [...contextFields];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onReorder(copy.map((f) => f.id));
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const currentOrder = contextFields.map((f) => f.id);
    const fromIndex = currentOrder.indexOf(draggedId);
    const toIndex = currentOrder.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      currentOrder.splice(fromIndex, 1);
      currentOrder.splice(toIndex, 0, draggedId);
      onReorder(currentOrder);
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-3">
      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border/80 p-3 rounded-xl shadow-2xs">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search custom fields by label..."
            className="w-full h-8.5 pl-8.5 pr-8 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Right filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mandatory Filter */}
          <select
            value={mandatoryFilter}
            onChange={(e) => setMandatoryFilter(e.target.value as any)}
            className="h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">Mandatory: All</option>
            <option value="Yes">Yes (Required)</option>
            <option value="No">No (Optional)</option>
          </select>

          {/* Active Filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-8.5 px-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}

          {/* Density toggle */}
          <div className="hidden sm:flex items-center border border-border rounded-lg p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`p-1 rounded cursor-pointer ${
                density === 'comfortable' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'
              }`}
              title="Comfortable Density"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`p-1 rounded cursor-pointer ${
                density === 'compact' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'
              }`}
              title="Compact Density"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Table Container (Desktop / Tablet ≥768px) ── */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : contextFields.length === 0 ? (
          <EmptyState
            context={context}
            onAddField={onAddNew}
            isFiltered={false}
          />
        ) : filteredFields.length === 0 ? (
          <EmptyState
            context={context}
            onAddField={onAddNew}
            isFiltered={true}
            onClearFilters={clearFilters}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto sidebar-scroll">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/50 border-b border-border text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14">Order</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Label Name</th>
                    <th className="py-2.5 px-3 min-w-[140px]">Data Type</th>
                    <th className="py-2.5 px-3 min-w-[120px]">Mandatory</th>
                    <th className="py-2.5 px-3 min-w-[120px]">Active Status</th>
                    <th className="py-2.5 px-3 text-right w-24">Actions</th>
                  </tr>
                </thead>

                <tbody className={density === 'compact' ? 'divide-y divide-border/40 text-[11.5px]' : 'divide-y divide-border/60'}>
                  {filteredFields.map((field, idx) => (
                    <CustomFieldRow
                      key={field.id}
                      field={field}
                      index={idx}
                      totalCount={filteredFields.length}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                      onToggleMandatory={onToggleMandatory}
                      onToggleActive={onToggleActive}
                      onInlineRename={onInlineRename}
                      onMoveUp={() => handleMove(idx, 'up')}
                      onMoveDown={() => handleMove(idx, 'down')}
                      onDragStart={() => handleDragStart(field.id)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(field.id)}
                      isDragging={draggedId === field.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List (<768px) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredFields.map((field, idx) => (
                <div key={field.id} className="p-3.5 space-y-2 bg-card hover:bg-muted/15 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab text-muted-foreground/50 p-1">
                        <GripVertical className="size-4" />
                      </div>
                      <span
                        onClick={() => onEdit(field)}
                        className="font-bold text-xs text-foreground cursor-pointer hover:text-indigo-600"
                      >
                        {field.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(field)}
                        className="p-1 rounded text-muted-foreground hover:text-indigo-600"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicate(field.id)}
                        className="p-1 rounded text-muted-foreground hover:text-slate-800"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(field)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pl-6">
                    <DataTypeChip dataType={field.dataType} size="sm" />
                    <MandatoryPill
                      mandatory={field.mandatory}
                      onToggle={() => onToggleMandatory(field.id)}
                      size="sm"
                    />
                    <ActiveStatusPill
                      status={field.activeStatus}
                      onToggle={() => onToggleActive(field.id)}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
