import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BranchFormHeaderProps {
  isEdit: boolean;
  bankAlias?: string;
  branchName?: string;
}

export const BranchFormHeader: React.FC<BranchFormHeaderProps> = ({
  isEdit,
  bankAlias,
  branchName,
}) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Link
          to="/banks"
          className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shadow-2xs"
          title="Back to Banks and Branches list"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 className="size-3.5" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              {isEdit ? `Edit — ${bankAlias || 'Bank'} / ${branchName || 'Branch'}` : 'New Branch'}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEdit
              ? 'Update branch identity details and manage linked COA bank accounts'
              : 'Register a new bank branch and attach linked Chart of Accounts heads'}
          </p>
        </div>
      </div>
    </div>
  );
};
