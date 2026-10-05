import React, { useEffect, useState } from 'react';
import { ListHeader } from '../../components/bulk-update/ListHeader';
import { HistoryTable } from '../../components/bulk-update/HistoryTable';
import { FilterModal } from '../../components/bulk-update/FilterModal';
import { SelectionModal } from '../../components/bulk-update/SelectionModal';
import { UpdateModal } from '../../components/bulk-update/UpdateModal';
import { DetailsHistoryModal } from '../../components/bulk-update/DetailsHistoryModal';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';
import { CheckCircle, Info, X } from 'lucide-react';

export const BulkUpdatePage: React.FC = () => {
  const { loadHistory } = useBulkUpdateStore();
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

  const handleUndoMock = (desc: string) => {
    showToast(`Undo requested for: "${desc}" (Demo rollback logged)`);
  };

  return (
    <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-indigo-300 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-indigo-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen Header */}
      <ListHeader />

      {/* Update History Table */}
      <HistoryTable onUndoMock={handleUndoMock} />

      {/* Step 1: Filter Modal */}
      <FilterModal />

      {/* Step 2: Selection Modal */}
      <SelectionModal />

      {/* Step 3: Update Modal */}
      <UpdateModal onSuccess={showToast} />

      {/* Details Drill-down Modal */}
      <DetailsHistoryModal />
    </div>
  );
};

export default BulkUpdatePage;
