import React, { useRef } from 'react';
import { UploadCloud, Download, Upload } from 'lucide-react';
import { useBulkUploadStore } from '../../stores/bulkUploadStore';

export const EmptyState: React.FC = () => {
  const { downloadSample, handleFileSelect, uploading } = useBulkUploadStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-dashed border-slate-200 rounded-xl text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">No uploads yet</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 font-normal">
        Upload your first voucher file to see history and manage uploaded entries.
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          type="button"
          onClick={downloadSample}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Sample Download</span>
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4 text-white" />
          <span>{uploading ? 'Reading...' : 'Upload Voucher'}</span>
        </button>
      </div>
    </div>
  );
};
