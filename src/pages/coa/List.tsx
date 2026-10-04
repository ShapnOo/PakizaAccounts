import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCoa } from '../../context/CoaContext';
import { CoaHeader } from '../../components/coa/CoaHeader';
import { AccountTable } from '../../components/coa/AccountTable';
import { AccountTree } from '../../components/coa/AccountTree';
import { ChartUploadModal } from '../../components/coa/ChartUploadModal';

export const CoaListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') === 'tree' ? 'tree' : 'list';
  const { accounts, toggleAccountActive, deleteAccount, importAccounts } = useCoa();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5 md:py-6 space-y-4">
      {/* Header with Title, Tabs, and Actions */}
      <CoaHeader
        onOpenUpload={() => setIsUploadOpen(true)}
        totalAccounts={accounts.length}
      />

      {/* Main View: List or Tree */}
      {currentView === 'tree' ? (
        <AccountTree
          accounts={accounts}
          onToggleActive={toggleAccountActive}
          onDelete={deleteAccount}
        />
      ) : (
        <AccountTable
          accounts={accounts}
          onToggleActive={toggleAccountActive}
          onDelete={deleteAccount}
        />
      )}

      {/* Upload Modal */}
      <ChartUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImport={importAccounts}
      />
    </div>
  );
};

export default CoaListPage;
