import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { VoucherType, VoucherEntry, VOUCHER_TYPES } from '../../types/journalEntry';
import { getEntry } from '../../services/journalEntryService';
import { VoucherEntryForm } from '../../components/journal-entries/VoucherEntryForm';
import { Loader2 } from 'lucide-react';

export const JournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(Boolean(id));
  const [entry, setEntry] = useState<VoucherEntry | null>(null);

  // Determine voucher type: from edit entry OR from ?type= query param (default Journal)
  const typeParam = searchParams.get('type') as VoucherType | null;
  const voucherType: VoucherType =
    entry?.voucherType ||
    (typeParam && VOUCHER_TYPES.includes(typeParam) ? typeParam : 'Journal');

  useEffect(() => {
    if (id) {
      setLoading(true);
      getEntry(id).then((data) => {
        if (!data) {
          navigate('/journal-entries');
        } else {
          setEntry(data);
        }
        setLoading(false);
      });
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">
          Loading voucher details...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <VoucherEntryForm
        voucherType={voucherType}
        initialData={entry}
      />
    </div>
  );
};
