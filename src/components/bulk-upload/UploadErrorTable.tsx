import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UploadErrorTableProps {
  errors: { row: number; message: string }[];
}

export const UploadErrorTable: React.FC<UploadErrorTableProps> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-4 border border-rose-200 rounded-lg overflow-hidden bg-rose-50/40">
      <div className="px-3.5 py-2 bg-rose-100/70 border-b border-rose-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span className="text-xs font-semibold text-rose-800">
          Validation Errors Detected ({errors.length} {errors.length === 1 ? 'issue' : 'issues'})
        </span>
      </div>
      <div className="max-h-48 overflow-y-auto divide-y divide-rose-100 text-xs">
        <table className="w-full text-left">
          <thead className="bg-rose-50 text-rose-900 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-3 py-2 w-20">Row</th>
              <th className="px-3 py-2">Error Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100 text-rose-950 font-normal">
            {errors.map((err, i) => (
              <tr key={i} className="hover:bg-rose-100/40 transition-colors">
                <td className="px-3 py-2 font-mono font-medium text-rose-700">Row {err.row}</td>
                <td className="px-3 py-2">{err.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
