import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  Building2,
  FileText,
  Truck,
} from 'lucide-react';
import { SubledgerEntry, SubledgerType } from '../../types/subledger';
import { ActiveStatusPill } from './ActiveStatusPill';
import { CompanyChips } from './CompanyChips';

interface SubledgerRowProps {
  entry: SubledgerEntry;
  density: 'comfortable' | 'compact';
  onEdit: (entry: SubledgerEntry) => void;
  onToggleActive: (id: string) => void;
  onDelete: (entry: SubledgerEntry) => void;
}

const TYPE_ICONS: Record<SubledgerType, React.ElementType> = {
  'cost-center': Building2,
  'reference-center': FileText,
  vehicle: Truck,
};

export const SubledgerRow: React.FC<SubledgerRowProps> = ({
  entry,
  density,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const Icon = TYPE_ICONS[entry.type] || Building2;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isCompact = density === 'compact';

  return (
    <>
      {/* Desktop / Tablet Table Row (>= 768px) */}
      <tr
        className={[
          'hidden md:table-row group border-b border-slate-100 hover:bg-slate-50/80 transition-colors',
          isCompact ? 'h-10' : 'h-12',
        ].join(' ')}
      >
        {/* Name Column */}
        <td className="px-4 py-2 align-middle">
          <div className="flex items-center gap-2.5">
            <div
              className={[
                'rounded-lg flex items-center justify-center shrink-0 transition-colors',
                isCompact ? 'size-6' : 'size-7',
                entry.type === 'cost-center'
                  ? 'bg-blue-50 text-blue-600'
                  : entry.type === 'reference-center'
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-amber-50 text-amber-600',
              ].join(' ')}
            >
              <Icon className={isCompact ? 'size-3' : 'size-3.5'} />
            </div>

            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onEdit(entry)}
                className="text-left font-semibold text-xs text-slate-900 hover:text-indigo-600 hover:underline transition-colors block truncate max-w-[280px] lg:max-w-md cursor-pointer"
                title={`Click to edit ${entry.name}`}
              >
                {entry.name}
              </button>

              {/* Responsive company chips on mid screens (768-1023px) */}
              <div className="lg:hidden mt-0.5">
                <CompanyChips
                  companyIds={entry.effectiveCompanyIds}
                  size="xs"
                  maxVisible={2}
                />
              </div>
            </div>
          </div>
        </td>

        {/* Active Status Column */}
        <td className="px-4 py-2 align-middle whitespace-nowrap">
          <ActiveStatusPill
            status={entry.activeStatus}
            onClick={() => onToggleActive(entry.id)}
            size={isCompact ? 'sm' : 'md'}
          />
        </td>

        {/* Effective Company Column (>= 1024px) */}
        <td className="px-4 py-2 align-middle hidden lg:table-cell">
          <CompanyChips
            companyIds={entry.effectiveCompanyIds}
            size={isCompact ? 'xs' : 'sm'}
            maxVisible={3}
          />
        </td>

        {/* Actions Column */}
        <td className="px-4 py-2 align-middle text-right whitespace-nowrap">
          <div className="relative inline-block text-left" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="More actions"
            >
              <MoreVertical className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 rounded-xl bg-white shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in-0 zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(entry);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer text-left"
                >
                  <Pencil className="size-3.5 text-slate-400" />
                  <span>Edit Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleActive(entry.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer text-left"
                >
                  <Power className="size-3.5 text-slate-400" />
                  <span>Toggle Status</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(entry);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer text-left font-medium"
                >
                  <Trash2 className="size-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* Mobile Card Layout (< 768px) */}
      <tr className="md:hidden border-b border-slate-200">
        <td colSpan={4} className="p-3 bg-white">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={[
                    'size-6 rounded-lg flex items-center justify-center shrink-0',
                    entry.type === 'cost-center'
                      ? 'bg-blue-50 text-blue-600'
                      : entry.type === 'reference-center'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-amber-50 text-amber-600',
                  ].join(' ')}
                >
                  <Icon className="size-3.5" />
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(entry)}
                  className="font-bold text-xs text-slate-900 truncate hover:text-indigo-600 text-left"
                >
                  {entry.name}
                </button>
              </div>

              <ActiveStatusPill
                status={entry.activeStatus}
                onClick={() => onToggleActive(entry.id)}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <CompanyChips
                companyIds={entry.effectiveCompanyIds}
                size="xs"
                maxVisible={2}
              />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(entry)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100"
                  title="Edit"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(entry)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};
