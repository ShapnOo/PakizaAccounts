import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Eye,
  BookOpen,
  Bookmark,
} from 'lucide-react';
import { JournalPreset } from '../../types/presetJournal';
import { VoucherTypeChip } from './VoucherTypeChip';
import { LineCountChip } from './LineCountChip';
import { UsageCounter } from './UsageCounter';

interface PresetRowProps {
  preset: JournalPreset;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (preset: JournalPreset) => void;
}

export function PresetRow({
  preset,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}: PresetRowProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <tr
      onClick={onSelect}
      className={`group transition-colors cursor-pointer ${
        isSelected
          ? 'bg-primary/5 border-l-4 border-l-primary'
          : 'hover:bg-muted/40'
      }`}
    >
      {/* Profile Name */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Bookmark className="size-4" />
          </div>
          <div className="min-w-0">
            <Link
              to={`/preset-journal/${preset.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-foreground hover:text-primary hover:underline transition-colors truncate block max-w-xs"
            >
              {preset.profileName}
            </Link>
            {preset.narration && (
              <p
                className="text-[11px] text-muted-foreground truncate max-w-sm"
                title={preset.narration}
              >
                {preset.narration}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Voucher Type */}
      <td className="py-3 px-3 whitespace-nowrap">
        <VoucherTypeChip type={preset.voucherType} size="sm" />
      </td>

      {/* Lines Count */}
      <td className="py-3 px-3 whitespace-nowrap">
        <LineCountChip count={preset.lines.length} />
      </td>

      {/* Usage Count & Last Used */}
      <td className="py-3 px-3 whitespace-nowrap">
        <UsageCounter
          usageCount={preset.usageCount}
          lastUsedAt={preset.lastUsedAt}
        />
      </td>

      {/* Kebab Action Menu */}
      <td
        className="py-3 px-3 text-right whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onSelect}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Preview Template Lines"
          >
            <Eye className="size-3.5" />
          </button>

          <Link
            to={`/journal-entries/new?type=${preset.voucherType}&presetId=${preset.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            title="Use in Journal Entry"
          >
            <BookOpen className="size-3" />
            <span className="hidden sm:inline">Use</span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-30 w-40 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/preset-journal/${preset.id}/edit`);
                  }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-muted text-foreground transition-all"
                >
                  <Pencil className="size-3.5 text-indigo-600" />
                  <span>Edit Preset</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(preset.id);
                  }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-muted text-foreground transition-all"
                >
                  <Copy className="size-3.5 text-emerald-600" />
                  <span>Duplicate</span>
                </button>

                <div className="my-1 border-t border-border/50" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(preset);
                  }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-rose-500/10 text-rose-600 transition-all font-semibold"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
