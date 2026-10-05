import React, { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCoa } from '../../context/CoaContext';
import { ChartCreateForm } from '../../components/coa/ChartCreateForm';
import { ChevronRight, ArrowLeft, FolderTree } from 'lucide-react';
import { AccountFormData } from '../../types/coa';

export const CoaCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const parentIdParam = searchParams.get('parentId');
  const navigate = useNavigate();
  const { accounts, getAccountById, createAccount, updateAccount, extraDetailsTypes, addDetailsType } =
    useCoa();

  const isEditMode = !!id;
  const initialAccount = id ? getAccountById(id) : undefined;

  // If new with parentId query param, create a stub account with that parentId
  const initialData = useMemo(() => {
    if (initialAccount) return initialAccount;
    if (parentIdParam) {
      const parent = accounts.find((a) => a.id === parentIdParam);
      if (parent) {
        return {
          id: '',
          name: '',
          code: '',
          accountsType: parent.accountsType,
          nature: parent.nature,
          parentId: parent.id,
          level: ((parent.level + 1) as any),
          path: [...parent.path],
          activeStatus: 'Active' as const,
          companyName: parent.companyName,
          isParent: false,
          defaultCurrency: 'BDT' as const,
        };
      }
    }
    return undefined;
  }, [initialAccount, parentIdParam, accounts]);

  const handleSubmit = (data: AccountFormData) => {
    if (isEditMode && id) {
      updateAccount(id, data);
    } else {
      createAccount(data);
    }
    navigate('/chart-of-accounts');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-4">
      {/* ── Breadcrumb & Navigation ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <Link to="/chart-of-accounts" className="hover:text-foreground transition-colors">
            Chart of Accounts
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-primary font-black">
            {isEditMode ? 'Edit Account' : 'Create Account'}
          </span>
        </div>

        <Link
          to="/chart-of-accounts"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Accounts</span>
        </Link>
      </div>

      {/* Main Form */}
      <ChartCreateForm
        initialAccount={initialData}
        allAccounts={accounts}
        extraDetailsTypes={extraDetailsTypes}
        onAddDetailsType={addDetailsType}
        onSubmit={handleSubmit}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default CoaCreatePage;
