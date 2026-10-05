import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { usePresetJournalStore } from '../../stores/presetJournalStore';
import { VoucherType, JournalPreset } from '../../types/presetJournal';
import { ListHeader } from '../../components/preset-journal/ListHeader';
import { PresetTabs } from '../../components/preset-journal/PresetTabs';
import { PresetTable } from '../../components/preset-journal/PresetTable';
import { PreviewPanel } from '../../components/preset-journal/PreviewPanel';
import { DeleteConfirmDialog } from '../../components/preset-journal/DeleteConfirmDialog';
import { EmptyState } from '../../components/preset-journal/EmptyState';
import { TableSkeleton } from '../../components/preset-journal/TableSkeleton';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function PresetJournalListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    presets,
    loading,
    selectedTypeTab,
    setSelectedTypeTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedPresetForPreview,
    setSelectedPresetForPreview,
    load,
    remove,
    duplicate,
  } = usePresetJournalStore();

  const [deleteTarget, setDeleteTarget] = useState<JournalPreset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  // Tab filter
  const counts = useMemo(() => {
    const res: Record<string, number> = { all: presets.length };
    for (const p of presets) {
      res[p.voucherType] = (res[p.voucherType] || 0) + 1;
    }
    return res;
  }, [presets]);

  const filtered = useMemo(() => {
    return presets
      .filter((p) => {
        const matchesTab =
          selectedTypeTab === 'All' || p.voucherType === selectedTypeTab;
        const matchesSearch =
          p.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.narration && p.narration.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'most-used') {
          return (b.usageCount || 0) - (a.usageCount || 0);
        }
        if (sortBy === 'alphabetical') {
          return a.profileName.localeCompare(b.profileName);
        }
        // default recent
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [presets, selectedTypeTab, searchQuery, sortBy]);

  const handleDuplicate = async (id: string) => {
    try {
      const dup = await duplicate(id);
      toast.success(`Duplicated preset '${dup.profileName}'`);
    } catch (e) {
      toast.error('Failed to duplicate preset');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(`Deleted preset '${deleteTarget.profileName}'`);
      setDeleteTarget(null);
    } catch (e) {
      toast.error('Failed to delete preset');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Header */}
      <ListHeader totalCount={presets.length} />

      {/* Tabs */}
      <PresetTabs
        selectedTab={selectedTypeTab}
        onSelectTab={setSelectedTypeTab}
        counts={counts}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search preset by profile name or narration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8.5 pr-3 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <ArrowUpDown className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="recent">Recently Created / Updated</option>
            <option value="most-used">Most Frequently Used</option>
            <option value="alphabetical">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Content Area with optional Side Preview Panel */}
      {loading && presets.length === 0 ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          hasFilters={selectedTypeTab !== 'All' || searchQuery !== ''}
          onClearFilters={() => {
            setSelectedTypeTab('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          {/* Preset Table */}
          <div
            className={
              selectedPresetForPreview
                ? 'xl:col-span-8 transition-all'
                : 'xl:col-span-12 transition-all'
            }
          >
            <PresetTable
              presets={filtered}
              selectedPresetId={selectedPresetForPreview?.id}
              onSelectPreset={(p) =>
                setSelectedPresetForPreview(
                  selectedPresetForPreview?.id === p.id ? null : p
                )
              }
              onDuplicate={handleDuplicate}
              onDelete={(p) => setDeleteTarget(p)}
            />
          </div>

          {/* Side Preview Panel (shows on row click) */}
          {selectedPresetForPreview && (
            <div className="xl:col-span-4">
              <PreviewPanel
                preset={selectedPresetForPreview}
                onClose={() => setSelectedPresetForPreview(null)}
                onDuplicate={handleDuplicate}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        preset={deleteTarget}
        loading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default PresetJournalListPage;
