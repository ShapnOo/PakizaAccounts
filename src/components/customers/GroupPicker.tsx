import React, { useState } from 'react';
import { CustomerGroup } from '../../types/customer';
import { Plus, Users, X, Check } from 'lucide-react';

interface GroupPickerProps {
  groups: CustomerGroup[];
  selectedId: string;
  onChange: (groupId: string) => void;
  onAddGroup: (name: string) => Promise<CustomerGroup>;
  error?: string;
}

export const GroupPicker: React.FC<GroupPickerProps> = ({
  groups,
  selectedId,
  onChange,
  onAddGroup,
  error,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      setDialogError('Group name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setDialogError('');
      const created = await onAddGroup(newGroupName.trim());
      onChange(created.id);
      setNewGroupName('');
      setDialogOpen(false);
    } catch (err: any) {
      setDialogError(err.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <span>Group Name</span>
          <span className="text-rose-500">*</span>
        </label>

        {/* Action: Add++ */}
        <button
          type="button"
          onClick={() => {
            setDialogError('');
            setDialogOpen(true);
          }}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 rounded-md border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
          title="Create a new customer group"
        >
          <Plus className="size-3" />
          <span>Add++</span>
        </button>
      </div>

      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none transition-all cursor-pointer shadow-2xs ${
            error
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        >
          <option value="">-- Select Customer Group --</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}

      {/* Inline Modal for Add++ */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  New Customer Group
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground block">
                  Group Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. WHOLESALE, EXPORT"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs uppercase"
                />
                {dialogError && (
                  <p className="text-[10.5px] text-rose-500 font-medium">
                    {dialogError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="size-3" />
                  <span>{isSubmitting ? 'Creating...' : 'Create Group'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
