import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChequeBookStore } from '../../stores/chequeBookStore';
import { ChequeBook } from '../../types/cheque';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { EmptyState } from '../../components/cheques/EmptyState';
import { DeleteConfirmDialog } from '../../components/cheques/DeleteConfirmDialog';
import {
  BookOpen,
  Plus,
  Search,
  Landmark,
  ShieldCheck,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export const BookListPage: React.FC = () => {
  const navigate = useNavigate();
  const { books, loading, loadBooks, removeBook } = useChequeBookStore();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ChequeBook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filtered = books.filter(
    (b) =>
      b.bookName.toLowerCase().includes(search.toLowerCase()) ||
      b.bankName.toLowerCase().includes(search.toLowerCase()) ||
      b.firstChequeNo.toLowerCase().includes(search.toLowerCase()) ||
      b.accountsBankId.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await removeBook(deleteTarget.id);
      toast.success(`Cheque book "${deleteTarget.bookName}" deleted`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete cheque book');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      {/* Module Navigation Tabs */}
      <ChequeTabs />

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-2xs">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Cheque Book Setup
            </h1>
            <p className="text-xs text-muted-foreground">
              Define cheque leaf series, bank bindings, and serial enforcement policies
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/cheques/books/new')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>New Cheque Book</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search book name, bank, or account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'Book' : 'Books'}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading cheque books...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Cheque Books Found"
          description={
            search
              ? 'No cheque books match your search query.'
              : 'Create your first cheque book to auto-generate serial leaves.'
          }
          actionText={search ? undefined : 'New Cheque Book'}
          onAction={() => navigate('/cheques/books/new')}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Book Name</th>
                <th className="py-3 px-4">Bank & Account</th>
                <th className="py-3 px-4">First Cheque</th>
                <th className="py-3 px-4 text-center">Total Leaves</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Serial Enforced</th>
                <th className="py-3 px-4 text-right w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((b) => {
                const total = b.cheques.length;
                const used = b.cheques.filter((c) => c.used).length;
                const inactive = b.cheques.filter((c) => c.isInactive).length;
                const available = total - used - inactive;

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group"
                  >
                    {/* Book Name */}
                    <td className="py-3 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="size-3.5 text-indigo-500" />
                        <span>{b.bookName}</span>
                      </div>
                    </td>

                    {/* Bank & Account */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{b.bankName}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {b.accountsBankId}
                        </span>
                      </div>
                    </td>

                    {/* First Cheque */}
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {b.firstChequeNo}
                    </td>

                    {/* Total Leaves */}
                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {b.noOfCheque}
                    </td>

                    {/* Available */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                          available > 0
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {available} left
                      </span>
                    </td>

                    {/* Enforce by SL */}
                    <td className="py-3 px-4 text-center">
                      {b.enforceBySerial ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="size-3" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">No</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/cheques/books/${b.id}/edit`)}
                          title="Edit Cheque Book"
                          className="p-1 rounded text-muted-foreground hover:text-indigo-600 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(b)}
                          title="Delete Cheque Book"
                          className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Cheque Book"
        message={`Are you sure you want to delete "${deleteTarget?.bookName}"? Books with used cheques cannot be deleted.`}
      />
    </div>
  );
};
