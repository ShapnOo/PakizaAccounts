import React from 'react';
import { UploadStatus } from '../../types/bulk';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface UploadStatusChipProps {
  status: UploadStatus;
  className?: string;
}

export const UploadStatusChip: React.FC<UploadStatusChipProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'Success':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 whitespace-nowrap select-none ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Success
        </span>
      );
    case 'Partial':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 whitespace-nowrap select-none ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          Partial
        </span>
      );
    case 'Failed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 whitespace-nowrap select-none ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          Failed
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 whitespace-nowrap select-none ${className}`}
        >
          {status}
        </span>
      );
  }
};
