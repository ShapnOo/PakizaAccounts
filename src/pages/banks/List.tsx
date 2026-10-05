import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Landmark, Building2, Plus, Search, Filter } from 'lucide-react';
import { Bank, Branch } from '../../types/bank';
import { listBranches, deleteBranch, duplicateBranch } from '../../services/branchService';
import { listBanks, deleteBank, updateBank } from '../../services/bankService';
import { useBankStore } from '../../stores/bankStore';

import { BranchTable } from '../../components/banks/BranchTable';
import { BankTable } from '../../components/banks/BankTable';
import { BankModal } from '../../components/banks/BankModal';
import { DeleteConfirmDialog } from '../../components/banks/DeleteConfirmDialog';
import { EmptyState } from '../../components/banks/EmptyState';
import { TableSkeleton } from '../../components/banks/TableSkeleton';

export const BankSetupList: React.FC = () => {
  const navigate = useNavigate();
  const { banks, loadBanks } = useBankStore();

  const [activeTab, setActiveTab] = useState<'branches' | 'banks'>('branches');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedBankFilter, setSelectedBankFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<'all' | 'with-accounts' | 'no-accounts'>('all');

  // Modals & Dialogs
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<
    { type: 'branch'; item: Branch } | { type: 'bank'; item: Bank } | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [branchList] = await Promise.all([listBranches(), loadBanks()]);
      setBranches(branchList);
    } catch (err) {
      toast.error('Failed to load bank setup records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute branch counts per bank
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    branches.forEach((b) => {
      counts[b.bankId] = (counts[b.bankId] || 0) + 1;
    });
    return counts;
  }, [branches]);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchesSearch =
        b.branchName.toLowerCase().includes(search.toLowerCase()) ||
        b.bankName.toLowerCase().includes(search.toLowerCase()) ||
        b.bankAlias.toLowerCase().includes(search.toLowerCase()) ||
        (b.address && b.address.toLowerCase().includes(search.toLowerCase())) ||
        (b.routingNo && b.routingNo.includes(search));

      const matchesBank =
        selectedBankFilter === 'all' || b.bankId === selectedBankFilter;

      const hasAcc = (b.accounts?.length || 0) > 0;
      const matchesAccounts =
        accountFilter === 'all'
          ? true
          : accountFilter === 'with-accounts'
          ? hasAcc
          : !hasAcc;

      return matchesSearch && matchesBank && matchesAccounts;
    });
  }, [branches, search, selectedBankFilter, accountFilter]);

  // Filtered banks
  const filteredBanks = useMemo(() => {
    return banks.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.alias.toLowerCase().includes(search.toLowerCase())
    );
  }, [banks, search]);

  // Duplicate branch handler
  const handleDuplicateBranch = async (branch: Branch) => {
    try {
      const cloned = await duplicateBranch(branch.id);
      setBranches((prev) => [...prev, cloned]);
      toast.success(`Duplicated "${branch.branchName}" as "${cloned.branchName}"`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to duplicate branch');
    }
  };

  // Confirm delete execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'branch') {
        await deleteBranch(deleteTarget.item.id);
        setBranches((prev) => prev.filter((b) => b.id !== deleteTarget.item.id));
        toast.success(`Branch "${deleteTarget.item.branchName}" deleted`);
      } else {
        await deleteBank(deleteTarget.item.id);
        await loadBanks();
        toast.success(`Bank "${deleteTarget.item.name}" deleted`);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-2xs">
            <Landmark className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Bank Setup</h1>
            <p className="text-xs text-muted-foreground">
              Manage bank masters, branch identities, and linked Chart of Accounts heads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'banks' ? (
            <button
              type="button"
              onClick={() => {
                setEditingBank(null);
                setIsBankModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>New Bank</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/branches/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>New Branch</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="size-3.5 text-indigo-500" />
            <span>Branches</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
              {branches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'banks'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Landmark className="size-3.5 text-indigo-500" />
            <span>Banks</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              {banks.length}
            </span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={
                activeTab === 'branches'
                  ? 'Search branch, bank, or address...'
                  : 'Search bank name or alias...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Branch specific filters */}
          {activeTab === 'branches' && (
            <>
              {/* Bank dropdown filter */}
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedBankFilter}
                  onChange={(e) => setSelectedBankFilter(e.target.value)}
                  className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
                >
                  <option value="all">All Banks</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.alias})
                    </option>
                  ))}
                </select>
              </div>

              {/* Accounts presence filter */}
              <select
                value={accountFilter}
                onChange={(e) =>
                  setAccountFilter(e.target.value as 'all' | 'with-accounts' | 'no-accounts')
                }
                className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="all">All Accounts Status</option>
                <option value="with-accounts">Has Accounts</option>
                <option value="no-accounts">No Accounts</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : activeTab === 'branches' ? (
        filteredBranches.length === 0 ? (
          <EmptyState
            title="No branches found"
            description={
              search || selectedBankFilter !== 'all' || accountFilter !== 'all'
                ? 'No branches match your active search or filter criteria.'
                : 'No branches registered yet. Create your first branch to attach bank accounts.'
            }
            actionText={
              search || selectedBankFilter !== 'all' || accountFilter !== 'all'
                ? undefined
                : 'New Branch'
            }
            onAction={() => navigate('/branches/new')}
          />
        ) : (
          <BranchTable
            branches={filteredBranches}
            onDuplicate={handleDuplicateBranch}
            onDelete={(branch) => setDeleteTarget({ type: 'branch', item: branch })}
          />
        )
      ) : filteredBanks.length === 0 ? (
        <EmptyState
          title="No banks found"
          description={
            search
              ? 'No banks match your active search keyword.'
              : 'No banks registered yet. Register your first bank master.'
          }
          actionText="New Bank"
          onAction={() => {
            setEditingBank(null);
            setIsBankModalOpen(true);
          }}
        />
      ) : (
        <BankTable
          banks={filteredBanks}
          branchCounts={branchCounts}
          onEditBank={(bank) => {
            setEditingBank(bank);
            setIsBankModalOpen(true);
          }}
          onDeleteBank={(bank) => setDeleteTarget({ type: 'bank', item: bank })}
        />
      )}

      {/* Bank Modal (Create or Edit) */}
      <BankModal
        isOpen={isBankModalOpen}
        onClose={() => {
          setIsBankModalOpen(false);
          setEditingBank(null);
        }}
        onBankCreated={async () => {
          await loadBanks();
        }}
        initialBank={editingBank}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title={deleteTarget?.type === 'branch' ? 'Delete Branch' : 'Delete Bank'}
        message={
          deleteTarget?.type === 'branch'
            ? `Are you sure you want to delete the branch "${deleteTarget.item.branchName}"?`
            : `Are you sure you want to delete "${deleteTarget?.item.name}"? This action cannot be undone.`
        }
      />
    </div>
  );
};
