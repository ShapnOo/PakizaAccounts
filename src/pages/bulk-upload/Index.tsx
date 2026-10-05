import React, { useEffect, useState } from 'react';
import { UploadHeader } from '../../components/bulk-upload/UploadHeader';
import { UploadPreviewCard } from '../../components/bulk-upload/UploadPreviewCard';
import { UploadHistoryTable } from '../../components/bulk-upload/UploadHistoryTable';
import { useBulkUploadStore } from '../../stores/bulkUploadStore';
import { CheckCircle, X } from 'lucide-react';

export const BulkUploadPage: React.FC = () => {
  const { loadHistory } = useBulkUploadStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-emerald-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen Header */}
      <UploadHeader />

      {/* Upload Preview Card (shown if a file is selected) */}
      <UploadPreviewCard onSuccess={showToast} />

      {/* History Table */}
      <UploadHistoryTable />
    </div>
  );
};

export default BulkUploadPage;
