import React from 'react';
import { FileSpreadsheet, X, Check, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useBulkUploadStore } from '../../stores/bulkUploadStore';
import { UploadErrorTable } from './UploadErrorTable';

interface UploadPreviewCardProps {
  onSuccess?: (msg: string) => void;
}

export const UploadPreviewCard: React.FC<UploadPreviewCardProps> = ({ onSuccess }) => {
  const { preview, activeFile, clearPreview, confirmUpload, uploading } = useBulkUploadStore();

  if (!preview) return null;

  const validCount = preview.validRows.length;
  const errorCount = preview.errors.length;
  const totalCount = preview.totalRows;

  const handleConfirm = async () => {
    const res = await confirmUpload('Riazul Islam');
    if (res && onSuccess) {
      onSuccess(`${res.noOfVoucher} vouchers uploaded successfully (${res.status})`);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mb-6 bg-white border border-indigo-100 rounded-xl p-5 shadow-sm ring-1 ring-indigo-500/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-slate-900">
                {preview.fileName}
              </span>
              {activeFile?.size && (
                <span className="text-xs text-slate-400 font-normal">
                  ({formatFileSize(activeFile.size)})
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 flex-wrap">
              <span className="font-medium text-slate-800">{totalCount} rows found</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {validCount} valid
              </span>
              {errorCount > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorCount} errors
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={clearPreview}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Remove selected file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <UploadErrorTable errors={preview.errors} />

      <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={clearPreview}
          className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={uploading || validCount === 0}
          onClick={handleConfirm}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
        >
          <Check className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Confirm Upload'}</span>
        </button>
      </div>
    </div>
  );
};
