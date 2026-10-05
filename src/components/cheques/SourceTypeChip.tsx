import React from 'react';
import { SourceType } from '../../types/cheque';

export const SourceTypeChip: React.FC<{ type: SourceType }> = ({ type }) => {
  switch (type) {
    case 'direct':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-300">
          Direct
        </span>
      );
    case 'bill':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
          Bill
        </span>
      );
    case 'iou':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-300">
          IOU
        </span>
      );
    default:
      return null;
  }
};
