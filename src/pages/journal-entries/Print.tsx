import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { VoucherEntry } from '../../types/journalEntry';
import { getEntry } from '../../services/journalEntryService';
import { VoucherPrintCanvas } from '../../components/journal-entries/VoucherPrintCanvas';

export const JournalEntryPrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<VoucherEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEntry(id).then((res) => {
        setEntry(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">
          Preparing voucher print preview...
        </p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm font-bold text-foreground">Voucher not found</p>
        <button
          type="button"
          onClick={() => navigate('/journal-entries')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Back to Journal Entries
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900/60 p-4 md:p-8 space-y-6 print:p-0 print:bg-white">
      {/* Top Action Header (Hidden in Print) */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => navigate('/journal-entries')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to List</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer active:scale-95"
        >
          <Printer className="size-4" />
          <span>Print Voucher</span>
        </button>
      </div>

      {/* Printable Canvas */}
      <VoucherPrintCanvas voucher={entry} />
    </div>
  );
};
