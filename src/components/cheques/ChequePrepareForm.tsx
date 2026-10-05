import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SourceType, ChequeFor, ChequeType, ChequeBook, ChequeEntry } from '../../types/cheque';
import { useChequeBookStore } from '../../stores/chequeBookStore';
import { usePreparedChequeStore } from '../../stores/preparedChequeStore';
import { preparedChequeSchema, PreparedChequeFormValues } from '../../lib/validation/cheque';

import { BankInfoBlock } from './BankInfoBlock';
import { BillInfoBlock } from './BillInfoBlock';
import { IouInfoBlock } from './IouInfoBlock';
import { PrepareChequeBlock } from './PrepareChequeBlock';
import { BuildJournalBlock } from './BuildJournalBlock';
import { PrepareActionBar } from './PrepareActionBar';
import { CoaBankAccount } from '../../mock/coaBankAccounts';
import { Bill } from '../../mock/bills';
import { IouRequisition } from '../../mock/ious';

interface ChequePrepareFormProps {
  sourceType: SourceType;
}

export const ChequePrepareForm: React.FC<ChequePrepareFormProps> = ({ sourceType }) => {
  const navigate = useNavigate();
  const { books, loadBooks } = useChequeBookStore();
  const { addPrepared } = usePreparedChequeStore();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedChequeId, setLastSavedChequeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // 1. Bank Info State
  const [accountsBankId, setAccountsBankId] = useState('');
  const [bankName, setBankName] = useState('');
  const [bookId, setBookId] = useState('');
  const [chequeFor, setChequeFor] = useState<ChequeFor>(
    sourceType === 'iou' ? 'Employee' : 'Supplier'
  );
  const [partyName, setPartyName] = useState('');

  // 2. Bill / IOU State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billValue, setBillValue] = useState(0);
  const [prevPaid, setPrevPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [payAmount, setPayAmount] = useState(0);

  // 3. Prepare Cheque State
  const [chequeType, setChequeType] = useState<ChequeType>('AC Payee');
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState(new Date().toISOString().split('T')[0]);
  const [payTo, setPayTo] = useState('');
  const [glAccountId, setGlAccountId] = useState(
    sourceType === 'direct' ? '' : 'acc-02-01-01-01' // Default Accounts Payable
  );
  const [amount, setAmount] = useState(0);

  // 4. Build Journal State
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [voucherType, setVoucherType] = useState('Payment Voucher');
  const [narration, setNarration] = useState('');

  // Initial load
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Selected book reference
  const currentBook = books.find((b) => b.id === bookId) || null;

  // Handle Account change -> auto-populates bankName and selects default book
  const handleAccountChange = (acc: CoaBankAccount | null) => {
    if (acc) {
      setAccountsBankId(acc.id);
      setBankName(acc.bankName);
      // Auto-select first matching book if available
      const matchingBook = books.find((b) => b.accountsBankId === acc.id);
      if (matchingBook) {
        setBookId(matchingBook.id);
      } else {
        setBookId('');
      }
    } else {
      setAccountsBankId('');
      setBankName('');
      setBookId('');
    }
    setChequeNo('');
  };

  // Handle Cheque for change
  const handleChequeForChange = (newFor: ChequeFor) => {
    setChequeFor(newFor);
    setPartyName('');
    setPayTo('');
    setSelectedSupplierId(undefined);
    setSelectedEmployeeId(undefined);
    setBillNo('');
    setBillDate('');
    setBillValue(0);
    setPrevPaid(0);
    setBalance(0);
    setPayAmount(0);
    if (sourceType !== 'direct') {
      setAmount(0);
    }
  };

  // Handle Party Selection
  const handlePartyNameChange = (
    name: string,
    extra?: { supplierId?: string; employeeId?: string }
  ) => {
    setPartyName(name);
    if (!payTo) {
      setPayTo(name);
    }
    if (extra?.supplierId) setSelectedSupplierId(extra.supplierId);
    if (extra?.employeeId) setSelectedEmployeeId(extra.employeeId);
  };

  // Handle Bill Selection
  const handleBillSelect = (bill: Bill | null) => {
    if (bill) {
      setBillNo(bill.billNo);
      setBillDate(bill.billDate);
      setBillValue(bill.billValue);
      setPrevPaid(bill.prevPaid);
      const rem = bill.billValue - bill.prevPaid;
      setBalance(rem);
      setPayAmount(rem);
      setAmount(rem); // Rule CH10: locked to Pay amount
    } else {
      setBillNo('');
      setBillDate('');
      setBillValue(0);
      setPrevPaid(0);
      setBalance(0);
      setPayAmount(0);
      setAmount(0);
    }
  };

  // Handle IOU Selection
  const handleIouSelect = (iou: IouRequisition | null) => {
    if (iou) {
      setBillNo(iou.requisitionNo);
      setBillDate(iou.reqDate);
      setBillValue(iou.reqValue);
      setPrevPaid(iou.prevPaid);
      const rem = iou.reqValue - iou.prevPaid;
      setBalance(rem);
      setPayAmount(rem);
      setAmount(rem); // Rule CH10: locked to Pay amount
    } else {
      setBillNo('');
      setBillDate('');
      setBillValue(0);
      setPrevPaid(0);
      setBalance(0);
      setPayAmount(0);
      setAmount(0);
    }
  };

  // When pay amount changes in bill/iou
  const handlePayAmountChange = (newVal: number) => {
    setPayAmount(newVal);
    setAmount(newVal); // Mirrors Pay amount (locked)
  };

  // Save handler
  const executeSave = async (withJournal: boolean) => {
    const rawPayload: PreparedChequeFormValues = {
      sourceType,
      chequeBookId: bookId,
      accountsBankId,
      bankName: bankName || currentBook?.bankName || '',
      bookName: currentBook?.bookName || '',
      chequeFor,
      partyName,
      billNo: billNo || undefined,
      billDate: billDate || undefined,
      billValue: billValue || undefined,
      prevPaid: prevPaid || undefined,
      balance: balance || undefined,
      payAmount: sourceType !== 'direct' ? payAmount : undefined,
      chequeType,
      chequeNo,
      chequeDate,
      payTo: payTo || partyName,
      glAccountId,
      amount,
      voucherDate: withJournal ? voucherDate : undefined,
      voucherType: withJournal ? voucherType : undefined,
      narration: narration || undefined,
    };

    const parsed = preparedChequeSchema.safeParse(rawPayload);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || 'general';
        errMap[path] = issue.message;
      });
      setErrors(errMap);
      const firstMsg = parsed.error.issues[0]?.message || 'Please check form validation';
      toast.error(firstMsg);
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const created = await addPrepared(rawPayload);
      setLastSavedChequeId(created.id);
      await loadBooks(); // refresh cheque consumption in store

      if (withJournal) {
        toast.success(
          `Cheque ${created.chequeNo} saved & ${voucherType} generated successfully!`
        );
      } else {
        toast.success(`Cheque ${created.chequeNo} prepared successfully!`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to prepare cheque');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeSave(false);
        }}
        className="space-y-6"
      >
        {/* 1. Bank & Party Info Block */}
        <BankInfoBlock
          sourceType={sourceType}
          accountsBankId={accountsBankId}
          bankName={bankName}
          bookId={bookId}
          chequeFor={chequeFor}
          partyName={partyName}
          books={books}
          onAccountChange={handleAccountChange}
          onBookChange={(id) => {
            setBookId(id);
            setChequeNo('');
          }}
          onChequeForChange={handleChequeForChange}
          onPartyNameChange={handlePartyNameChange}
          errors={errors}
        />

        {/* 2. Middle Block (Bill / IOU / None) */}
        {sourceType === 'bill' && (
          <BillInfoBlock
            supplierId={selectedSupplierId}
            billNo={billNo}
            billDate={billDate}
            billValue={billValue}
            prevPaid={prevPaid}
            balance={balance}
            payAmount={payAmount}
            onBillSelect={handleBillSelect}
            onPayAmountChange={handlePayAmountChange}
            errors={errors}
          />
        )}

        {sourceType === 'iou' && (
          <IouInfoBlock
            employeeId={selectedEmployeeId}
            requisitionNo={billNo}
            reqDate={billDate}
            reqValue={billValue}
            prevPaid={prevPaid}
            balance={balance}
            payAmount={payAmount}
            onIouSelect={handleIouSelect}
            onPayAmountChange={handlePayAmountChange}
            errors={errors}
          />
        )}

        {/* 3. Prepare Cheque Block */}
        <PrepareChequeBlock
          sourceType={sourceType}
          book={currentBook}
          chequeType={chequeType}
          chequeNo={chequeNo}
          chequeDate={chequeDate}
          payTo={payTo}
          glAccountId={glAccountId}
          amount={amount}
          onChequeTypeChange={setChequeType}
          onChequeNoChange={(no) => setChequeNo(no)}
          onChequeDateChange={setChequeDate}
          onPayToChange={setPayTo}
          onGlAccountChange={setGlAccountId}
          onAmountChange={setAmount}
          errors={errors}
        />

        {/* 4. Build Journal Block */}
        <BuildJournalBlock
          voucherDate={voucherDate}
          voucherType={voucherType}
          narration={narration}
          onVoucherDateChange={setVoucherDate}
          onVoucherTypeChange={setVoucherType}
          onNarrationChange={setNarration}
        />

        {/* 5. Footer Action Bar */}
        <PrepareActionBar
          lastSavedChequeId={lastSavedChequeId}
          isSaving={isSaving}
          onSave={() => executeSave(false)}
          onSaveAndJournal={() => executeSave(true)}
          hasJournal={Boolean(voucherType)}
        />
      </form>
    </div>
  );
};
