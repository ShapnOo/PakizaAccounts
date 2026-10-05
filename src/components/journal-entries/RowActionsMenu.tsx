import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  Printer,
  Pencil,
  Paperclip,
  Ban,
  RotateCcw,
} from 'lucide-react';
import { VoucherEntry } from '../../types/journalEntry';

interface RowActionsMenuProps {
  entry: VoucherEntry;
  onOpenAttachment: (entry: VoucherEntry) => void;
  onToggleVoid: (id: string) => void;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  entry,
  onOpenAttachment,
  onToggleVoid,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
        title="Row Actions"
      >
        <MoreVertical className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl z-50 py-1 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-100">
          {/* 1. PDF Print */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(`/journal-entries/${entry.id}/print`);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer text-left"
          >
            <Printer className="size-3.5 text-indigo-500" />
            <span>PDF Print</span>
          </button>

          {/* 2. Edit */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(`/journal-entries/${entry.id}/edit`);
            }}
            disabled={entry.voided}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-left"
          >
            <Pencil className="size-3.5 text-emerald-500" />
            <span>Edit Voucher</span>
          </button>

          {/* 3. Attachment */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenAttachment(entry);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Paperclip className="size-3.5 text-blue-500" />
              <span>Attachments</span>
            </div>
            {entry.attachments && entry.attachments.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {entry.attachments.length}
              </span>
            )}
          </button>

          <div className="my-1 border-t border-border/60" />

          {/* 4. Void / Unvoid */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleVoid(entry.id);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer text-left ${
              entry.voided
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            {entry.voided ? (
              <>
                <RotateCcw className="size-3.5" />
                <span>Restore (Unvoid)</span>
              </>
            ) : (
              <>
                <Ban className="size-3.5" />
                <span>Void Voucher</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
