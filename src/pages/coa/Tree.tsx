import React, { useState } from 'react';
import { useCoa } from '../../context/CoaContext';
import { CoaHeader } from '../../components/coa/CoaHeader';
import { AccountTree } from '../../components/coa/AccountTree';
import { ChartUploadModal } from '../../components/coa/ChartUploadModal';
import { ChartAccountModal } from '../../components/coa/ChartAccountModal';
import { Account, AccountFormData } from '../../types/coa';

export const CoaTreePage: React.FC = () => {
  const {
    accounts,
    toggleAccountActive,
    deleteAccount,
    importAccounts,
    createAccount,
    updateAccount,
    extraDetailsTypes,
    addDetailsType,
  } = useCoa();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [modalParentId, setModalParentId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);

  const handleOpenCreate = (parentId?: string | null) => {
    setEditingAccount(undefined);
    setModalParentId(parentId ?? null);
    setIsAccountModalOpen(true);
  };

  const handleOpenEdit = (acc: Account) => {
    setEditingAccount(acc);
    setModalParentId(acc.parentId || null);
    setIsAccountModalOpen(true);
  };

  const handleAccountSubmit = (data: AccountFormData) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, data);
    } else {
      createAccount(data);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-4">
      <CoaHeader
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCreate={() => handleOpenCreate(null)}
        totalAccounts={accounts.length}
      />

      <AccountTree
        accounts={accounts}
        onToggleActive={toggleAccountActive}
        onDelete={deleteAccount}
        onOpenCreate={handleOpenCreate}
        onOpenEdit={handleOpenEdit}
      />

      <ChartAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        initialAccount={editingAccount}
        defaultParentId={modalParentId}
        allAccounts={accounts}
        extraDetailsTypes={extraDetailsTypes}
        onAddDetailsType={addDetailsType}
        onSubmit={handleAccountSubmit}
        isEditMode={!!editingAccount}
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
