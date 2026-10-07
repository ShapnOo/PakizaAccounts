import React, { useEffect } from 'react';
import { Account, AccountFormData } from '../../types/coa';
import { ChartCreateForm } from './ChartCreateForm';
import { X, FolderPlus, Edit3 } from 'lucide-react';

interface ChartAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAccount?: Account;
  defaultParentId?: string | null;
  allAccounts: Account[];
  extraDetailsTypes: string[];
  onAddDetailsType: (type: string) => void;
  onSubmit: (data: AccountFormData) => void;
  isEditMode?: boolean;
}

export const ChartAccountModal: React.FC<ChartAccountModalProps> = ({
  isOpen,
  onClose,
  initialAccount,
  defaultParentId,
  allAccounts,
  extraDetailsTypes,
  onAddDetailsType,
  onSubmit,
  isEditMode = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in-50 duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              {isEditMode ? <Edit3 className="size-4" /> : <FolderPlus className="size-4" />}
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black tracking-tight text-foreground">
                {isEditMode ? `Edit Account: ${initialAccount?.name}` : 'Create New Account / Head'}
              </h3>
              <p className="text-[11px] text-muted-foreground font-medium">
                {isEditMode
                  ? 'Update hierarchy placement, GL metadata, and auxiliary dimensions.'
                  : 'Add a new Group, Subgroup, Control, or posting GL Account head to the taxonomy.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg border border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 sidebar-scroll">
          <ChartCreateForm
            key={`${isEditMode ? initialAccount?.id : 'new'}-${defaultParentId}`}
            initialAccount={initialAccount}
            defaultParentId={defaultParentId}
            allAccounts={allAccounts}
            extraDetailsTypes={extraDetailsTypes}
            onAddDetailsType={onAddDetailsType}
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
            onCancel={onClose}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartAccountModal;
