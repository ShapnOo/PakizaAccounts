import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChequeBook, ChequeEntry } from '../../types/cheque';
import { generateChequeNumbers } from '../../lib/chequeNumber';
import { chequeBookSchema, ChequeBookFormValues } from '../../lib/validation/cheque';
import { useChequeBookStore } from '../../stores/chequeBookStore';
import { getChequeBook } from '../../services/chequeBookService';
import { BookSetupHeaderBlock } from '../../components/cheques/BookSetupHeaderBlock';
import { BookSetupBookBlock } from '../../components/cheques/BookSetupBookBlock';
import { GeneratedChequesTable } from '../../components/cheques/GeneratedChequesTable';
import { CoaBankAccount } from '../../mock/coaBankAccounts';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';

export const BookSetupFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { addBook, editBook } = useChequeBookStore();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Form Fields
  const [accountsBankId, setAccountsBankId] = useState('');
  const [bankName, setBankName] = useState('');
  const [glName, setGlName] = useState('');
  const [enforceBySerial, setEnforceBySerial] = useState(true);

  const [bookName, setBookName] = useState('');
  const [firstChequeNo, setFirstChequeNo] = useState('');
  const [noOfCheque, setNoOfCheque] = useState(10);

  const [cheques, setCheques] = useState<ChequeEntry[]>([]);

  // Load existing book in edit mode
  useEffect(() => {
    if (!id) return;
    const fetchTarget = async () => {
      setLoading(true);
      try {
        const book = await getChequeBook(id);
        if (book) {
          setAccountsBankId(book.accountsBankId);
          setBankName(book.bankName);
          setGlName(book.glName);
          setEnforceBySerial(book.enforceBySerial);
          setBookName(book.bookName);
          setFirstChequeNo(book.firstChequeNo);
          setNoOfCheque(book.noOfCheque);
          setCheques(book.cheques || []);
        } else {
          toast.error('Cheque book not found');
          navigate('/cheques/books');
        }
      } catch (err) {
        toast.error('Failed to load cheque book');
      } finally {
        setLoading(false);
      }
    };
    fetchTarget();
  }, [id, navigate]);

  // When Bank Account is picked
  const handleAccountChange = (acc: CoaBankAccount | null) => {
    if (acc) {
      setAccountsBankId(acc.id);
      setBankName(acc.bankName);
      setGlName(acc.accountName);
    } else {
      setAccountsBankId('');
      setBankName('');
      setGlName('');
    }
  };

  // ADD >> Generator
  const handleGenerateCheques = () => {
    if (!firstChequeNo.trim()) {
      setErrors((prev) => ({ ...prev, firstChequeNo: 'First cheque no. is required' }));
      toast.error('Please specify a First Cheque Number (e.g. CQ26000001)');
      return;
    }
    if (!noOfCheque || noOfCheque <= 0 || noOfCheque > 500) {
      setErrors((prev) => ({
        ...prev,
        noOfCheque: 'Enter a valid number of cheques (1–500)',
      }));
      toast.error('Please enter a valid number of cheques');
      return;
    }

    if (cheques.length > 0 && !confirm('Regenerating will replace the existing cheque rows. Continue?')) {
      return;
    }

    const numbers = generateChequeNumbers(firstChequeNo.trim(), noOfCheque);
    const newRows: ChequeEntry[] = numbers.map((no, idx) => ({
      id: `leaf-${Date.now()}-${idx + 1}`,
      sl: idx + 1,
      chequeNo: no,
      isInactive: false,
      signatory: idx === 0 ? 'Managing Director' : '',
      used: false,
    }));

    setCheques(newRows);
    setErrors((prev) => ({ ...prev, firstChequeNo: undefined, noOfCheque: undefined, cheques: undefined }));
    toast.success(`Generated ${newRows.length} cheque leaves (${numbers[0]} ... ${numbers[numbers.length - 1]})`);
  };

  // Toggle Inactive status
  const handleToggleInactive = (index: number) => {
    setCheques((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, isInactive: !c.isInactive } : c))
    );
  };

  // Edit Signatory caption
  const handleSignatoryChange = (index: number, val: string) => {
    setCheques((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, signatory: val } : c))
    );
  };

  // Remove a leaf row
  const handleRemoveRow = (index: number) => {
    setCheques((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      // Re-index SL
      return filtered.map((c, idx) => ({ ...c, sl: idx + 1 }));
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ChequeBookFormValues = {
      accountsBankId,
      bankName,
      glName,
      enforceBySerial,
      bookName: bookName.trim(),
      firstChequeNo: firstChequeNo.trim().toUpperCase(),
      noOfCheque: cheques.length || noOfCheque,
      cheques,
    };

    const parsed = chequeBookSchema.safeParse(payload);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || 'general';
        errMap[path] = issue.message;
      });
      setErrors(errMap);
      const firstMsg = parsed.error.issues[0]?.message || 'Please review form errors';
      toast.error(firstMsg);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      if (isEdit && id) {
        await editBook(id, payload);
        toast.success(`Cheque book "${bookName}" updated successfully`);
      } else {
        await addBook(payload);
        toast.success(`Cheque book "${bookName}" created with ${cheques.length} leaves`);
      }
      navigate('/cheque-setup');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save cheque book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/cheques/books')}
            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs cursor-pointer"
            title="Back to Cheque Books"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BookOpen className="size-3.5" />
              </div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                {isEdit ? `Edit Cheque Book — ${bookName}` : 'Cheque Book Setup'}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bind bank entity, specify initial serial, and auto-generate serial cheque leaves
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="w-full space-y-5 min-w-0">
        {/* 1. Header Block: Bank Account & Enforce Serial */}
        <BookSetupHeaderBlock
          accountsBankId={accountsBankId}
          bankName={bankName}
          glName={glName}
          enforceBySerial={enforceBySerial}
          onAccountChange={handleAccountChange}
          onEnforceChange={setEnforceBySerial}
          errors={errors}
        />

        {/* 2. Book Block: Name, First No, Count, ADD>> button */}
        <BookSetupBookBlock
          bookName={bookName}
          firstChequeNo={firstChequeNo}
          noOfCheque={noOfCheque}
          onBookNameChange={setBookName}
          onFirstChequeNoChange={setFirstChequeNo}
          onNoOfChequeChange={setNoOfCheque}
          onAddClick={handleGenerateCheques}
          errors={errors}
        />

        {/* 3. Generated Cheques Table */}
        {cheques.length > 0 ? (
          <div className="bg-card rounded-xl border border-border p-5 shadow-2xs">
            <GeneratedChequesTable
              cheques={cheques}
              enforceBySerial={enforceBySerial}
              onToggleInactive={handleToggleInactive}
              onSignatoryChange={handleSignatoryChange}
              onRemoveRow={handleRemoveRow}
            />
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl p-8 text-center bg-card">
            <p className="text-xs font-semibold text-foreground">
              No Cheque Details Generated Yet
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm mx-auto">
              Fill in the First Cheque No and Number of Cheques above, then click{' '}
              <strong className="text-primary">"ADD &gt;&gt;"</strong> to auto-populate leaves.
            </p>
            {errors.cheques && (
              <p className="text-xs text-rose-500 font-bold mt-2">{errors.cheques}</p>
            )}
          </div>
        )}

        {/* 4. Form Actions: Cancel + Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
          <button
            type="button"
            onClick={() => navigate('/cheque-setup')}
            className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving Book...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Submit Cheque Book</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
