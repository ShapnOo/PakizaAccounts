import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  CornerDownRight,
  Layers,
} from 'lucide-react';

interface RowActionsMenuProps {
  isParent: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onAddSubHead: () => void;
  onAddHeadBelow: () => void;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  isParent,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete,
  onAddSubHead,
  onAddHeadBelow,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        title="Row actions"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-slate-200 shadow-xl z-50 py-1 text-[13px] animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Add Sub Head Action */}
          <button
            type="button"
            onClick={() => {
              onAddSubHead();
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-indigo-50 text-indigo-700 font-medium cursor-pointer"
          >
            <CornerDownRight className="size-3.5 text-indigo-600" />
            <span>{isParent ? 'Add Sub Head here' : 'Add Sub Head below'}</span>
          </button>

          {/* Add Head Below Action */}
          <button
            type="button"
            onClick={() => {
              onAddHeadBelow();
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            <Layers className="size-3.5 text-slate-400" />
            <span>Add Head below</span>
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Move Up */}
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={() => {
              onMoveUp();
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowUp className="size-3.5 text-slate-400" />
            <span>Move Up</span>
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={() => {
              onMoveDown();
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowDown className="size-3.5 text-slate-400" />
            <span>Move Down</span>
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>{isParent ? 'Delete Head (Section)' : 'Delete Sub Head'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
