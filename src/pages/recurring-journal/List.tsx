import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Repeat,
  Sparkles,
  Layers,
  Calendar,
  Zap,
} from 'lucide-react';
import {
  useRecurringJournalStore,
  selectFilteredProfiles,
} from '../../stores/recurringJournalStore';
import { RecurringProfile, VoucherType, Cadence, CADENCES, VOUCHER_TYPES } from '../../types/recurringJournal';
import { ListHeader } from '../../components/recurring-journal/ListHeader';
import { ProfileTable } from '../../components/recurring-journal/ProfileTable';
import { EmptyState } from '../../components/recurring-journal/EmptyState';
import { DeleteConfirmDialog } from '../../components/recurring-journal/DeleteConfirmDialog';

export const RecurringJournalListPage: React.FC = () => {
  const {
    profiles,
    loading,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    cadenceFilter,
    setCadenceFilter,
    statusFilter,
    setStatusFilter,
    loadProfiles,
    toggleActive,
    cloneProfile,
    executeNow,
    removeProfile,
  } = useRecurringJournalStore();

  const [profileToDelete, setProfileToDelete] = useState<RecurringProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const filtered = selectFilteredProfiles({
    profiles,
    loading,
    searchQuery,
    typeFilter,
    cadenceFilter,
    statusFilter,
    loadProfiles,
    setSearchQuery,
    setTypeFilter,
    setCadenceFilter,
    setStatusFilter,
    addProfile: useRecurringJournalStore.getState().addProfile,
    editProfile: useRecurringJournalStore.getState().editProfile,
    removeProfile: useRecurringJournalStore.getState().removeProfile,
    toggleActive: useRecurringJournalStore.getState().toggleActive,
    cloneProfile: useRecurringJournalStore.getState().cloneProfile,
    executeNow: useRecurringJournalStore.getState().executeNow,
  });

  const activeCount = profiles.filter((p) => p.active).length;
  const totalValue = profiles.reduce((s, p) => s + p.amount, 0);

  const handleToggleActiveWithToast = async (id: string) => {
    const target = profiles.find((p) => p.id === id);
    if (!target) return;
    await toggleActive(id);
    toast.success(
      `Profile "${target.profileName}" marked as ${target.active ? 'Inactive' : 'Active'}.`
    );
  };

  const handleDuplicateWithToast = async (id: string) => {
    try {
      const cloned = await cloneProfile(id);
      toast.success(`Duplicated profile: "${cloned.profileName}"`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to duplicate profile');
    }
  };

  const handleRunNowWithToast = async (id: string) => {
    try {
      const { profile, voucherNo } = await executeNow(id);
      toast.success(
        `Generated voucher ${voucherNo} from profile "${profile.profileName}"! Next run: ${profile.nextRunAt}`
      );
    } catch (e: any) {
      toast.error(e.message || 'Failed to execute profile');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!profileToDelete) return;
    setDeleting(true);
    try {
      await removeProfile(profileToDelete.id);
      toast.success(`Profile "${profileToDelete.profileName}" deleted.`);
      setProfileToDelete(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header */}
      <ListHeader totalCount={profiles.length} activeCount={activeCount} />

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Total Active Schedules</span>
            <Repeat className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground">{activeCount}</div>
          <p className="text-[11px] text-muted-foreground">
            out of {profiles.length} configured profiles
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Total Scheduled Volume</span>
            <Sparkles className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            ৳ {totalValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-muted-foreground">per full execution cycle</p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Monthly Cadence</span>
            <Calendar className="size-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {profiles.filter((p) => p.repeatEvery === 'Month').length}
          </div>
          <p className="text-[11px] text-muted-foreground">profiles repeating monthly</p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Total Executions</span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {profiles.reduce((s, p) => s + (p.totalRunsCount || 0), 0)}
          </div>
          <p className="text-[11px] text-muted-foreground">vouchers auto-generated</p>
        </div>
      </div>

      {/* 3. Toolbar & Filters */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recurring profile name, account, narration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voucher Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as VoucherType | 'all')}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Voucher Types</option>
            {VOUCHER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t} Voucher
              </option>
            ))}
          </select>

          {/* Cadence */}
          <select
            value={cadenceFilter}
            onChange={(e) => setCadenceFilter(e.target.value as Cadence | 'all')}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Cadences</option>
            {CADENCES.map((c) => (
              <option key={c.value} value={c.value}>
                Every {c.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* 4. Profiles Table / Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No matching recurring profiles' : 'No recurring profiles yet'}
          description={
            searchQuery
              ? 'Try adjusting your search keywords or clearing active filters.'
              : 'Create your first schedule-based recurring voucher template to automate standard monthly entries.'
          }
        />
      ) : (
        <ProfileTable
          profiles={filtered}
          onToggleActive={handleToggleActiveWithToast}
          onDuplicate={handleDuplicateWithToast}
          onRunNow={handleRunNowWithToast}
          onDelete={(p) => setProfileToDelete(p)}
        />
      )}

      {/* 5. Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(profileToDelete)}
        onClose={() => setProfileToDelete(null)}
        onConfirm={handleDeleteConfirm}
        profileName={profileToDelete?.profileName || ''}
        loading={deleting}
      />
    </div>
  );
};
