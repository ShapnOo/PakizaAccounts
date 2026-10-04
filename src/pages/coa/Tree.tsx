import React, { useState } from 'react';
import { useCoa } from '../../context/CoaContext';
import { CoaHeader } from '../../components/coa/CoaHeader';
import { AccountTree } from '../../components/coa/AccountTree';
import { ChartUploadModal } from '../../components/coa/ChartUploadModal';

export const CoaTreePage: React.FC = () => {
  const { accounts, toggleAccountActive, deleteAccount, importAccounts } = useCoa();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5 md:py-6 space-y-4">
      <CoaHeader
        onOpenUpload={() => setIsUploadOpen(true)}
        totalAccounts={accounts.length}
      />

      <AccountTree
        accounts={accounts}
        onToggleActive={toggleAccountActive}
        onDelete={deleteAccount}
      />

      <ChartUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImport={importAccounts}
      />
    </div>
  );
};

export default CoaTreePage;
