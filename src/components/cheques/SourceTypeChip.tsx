import React from 'react';
import { SourceType } from '../../types/chequePrepare';

interface SourceTypeChipProps {
  type: SourceType;
  className?: string;
}

export const SourceTypeChip: React.FC<SourceTypeChipProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'direct':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-sky-500" />
          Direct Payment
        </span>
      );
    case 'bill':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-amber-500" />
          Bill Payment
        </span>
      );
    case 'iou':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-violet-500" />
          IOU Payment
        </span>
      );
    default:
      return null;
  }
};
