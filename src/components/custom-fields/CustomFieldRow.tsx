import React, { useState } from 'react';
import { CustomField } from '../../types/customField';
import { DataTypeChip } from './DataTypeChip';
import { MandatoryPill } from './MandatoryPill';
import { ActiveStatusPill } from './ActiveStatusPill';
import {
  GripVertical,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface CustomFieldRowProps {
  field: CustomField;
  index: number;
  totalCount: number;
  onEdit: (field: CustomField) => void;
  onDuplicate: (id: string) => void;
  onDelete: (field: CustomField) => void;
  onToggleMandatory: (id: string) => void;
  onToggleActive: (id: string) => void;
  onInlineRename: (id: string, newLabel: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  // Drag-and-drop HTML5 handlers
  onDragStart: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDrop: (e: React.DragEvent<HTMLTableRowElement>) => void;
  isDragging?: boolean;
}

export const CustomFieldRow: React.FC<CustomFieldRowProps> = ({
  field,
  index,
  totalCount,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleMandatory,
  onToggleActive,
  onInlineRename,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineLabel, setInlineLabel] = useState(field.label);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCommitInline = () => {
    setIsEditingInline(false);
    if (inlineLabel.trim() && inlineLabel.trim() !== field.label) {
      onInlineRename(field.id, inlineLabel.trim());
    } else {
      setInlineLabel(field.label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommitInline();
    } else if (e.key === 'Escape') {
      setIsEditingInline(false);
      setInlineLabel(field.label);
    }
  };

  return (
    <tr
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border-b border-border/60 transition-colors group select-none ${
        index % 2 === 0 ? 'bg-card' : 'bg-muted/15'
      } hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 ${
        isDragging ? 'opacity-40 bg-indigo-100/50' : ''
      }`}
    >
      {/* 1. Drag Handle & Order */}
      <td className="py-2.5 px-3 text-center w-14">
        <div className="flex items-center justify-center gap-1">
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted text-muted-foreground/50 hover:text-foreground transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </div>
          <div className="hidden group-hover:flex flex-col gap-0.5 -my-1">
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              className="p-0.5 text-muted-foreground hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
              title="Move Up"
            >
              <ChevronUp className="size-3" />
            </button>
            <button
              type="button"
              disabled={index === totalCount - 1}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              className="p-0.5 text-muted-foreground hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
              title="Move Down"
            >
              <ChevronDown className="size-3" />
            </button>
          </div>
        </div>
      </td>

      {/* 2. Label Name */}
      <td className="py-2.5 px-3">
        {isEditingInline ? (
          <input
            type="text"
            autoFocus
            value={inlineLabel}
            onChange={(e) => setInlineLabel(e.target.value)}
            onBlur={handleCommitInline}
            onKeyDown={handleKeyDown}
            className="h-7 px-2 rounded border border-indigo-500 bg-background text-xs font-semibold text-foreground outline-none shadow-xs"
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditingInline(true)}
            onClick={() => onEdit(field)}
            title="Click to edit, double click to inline rename"
            className="cursor-pointer group/name flex items-center gap-2"
          >
            <span className="font-semibold text-xs text-foreground group-hover/name:text-indigo-600 dark:group-hover/name:text-indigo-400 transition-colors">
              {field.label}
            </span>
            <span className="text-[10px] text-muted-foreground/60 opacity-0 group-hover/name:opacity-100 transition-opacity">
              (click to edit)
            </span>
          </div>
        )}
      </td>

      {/* 3. Data Type */}
      <td className="py-2.5 px-3">
        <DataTypeChip dataType={field.dataType} />
      </td>

      {/* 4. Mandatory */}
      <td className="py-2.5 px-3">
        <MandatoryPill
          mandatory={field.mandatory}
          onToggle={() => onToggleMandatory(field.id)}
        />
      </td>

      {/* 5. Active Status */}
      <td className="py-2.5 px-3">
        <ActiveStatusPill
          status={field.activeStatus}
          onToggle={() => onToggleActive(field.id)}
        />
      </td>

      {/* 6. Actions */}
      <td className="py-2.5 px-3 text-right">
        <div className="relative inline-block text-left">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onEdit(field)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
              title="Edit Field"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(field.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-muted transition-colors cursor-pointer"
              title="Duplicate Field"
            >
              <Copy className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(field)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete Field"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};
