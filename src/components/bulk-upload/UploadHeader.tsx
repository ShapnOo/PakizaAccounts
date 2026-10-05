import React, { useRef } from 'react';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { useBulkUploadStore } from '../../stores/bulkUploadStore';

export const UploadHeader: React.FC = () => {
  const { downloadSample, handleFileSelect, uploading } = useBulkUploadStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // reset input so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Bulk Data Upload
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Upload vouchers from an Excel file and monitor import history
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={onFileChange}
        />

        <button
          type="button"
          onClick={downloadSample}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Sample Download</span>
        </button>

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:bg-indigo-800 disabled:opacity-50 transition-all shadow-sm shadow-indigo-200"
        >
          <Upload className="w-4 h-4 text-white" />
          <span>{uploading ? 'Reading File...' : 'Upload Voucher'}</span>
        </button>
      </div>
    </div>
  );
};
