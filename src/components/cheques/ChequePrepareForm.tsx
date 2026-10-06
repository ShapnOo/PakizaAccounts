import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  SourceType,
  ChequeFor,
  ChequeType,
  PrepareLine,
  ChequePrepare,
} from '../../types/chequePrepare';
import { ChequeBook } from '../../types/cheque';
import { useChequeBookStore } from '../../stores/chequeBookStore';
import { useChequePrepareStore } from '../../stores/preparedChequeStore';
import { useVouchers } from '../../context/VoucherContext';
import {
  chequePrepareSchema,
  ChequePrepareFormValues,
} from '../../lib/validation/chequePrepare';
import { buildAutoNarration } from '../../lib/autoNarration';
import { useColumnVisibility } from './ColumnTogglePopover';

import { PrepareSubNav } from './PrepareSubNav';
import { BankInfoBlock } from './BankInfoBlock';
import { BillInfoBlock } from './BillInfoBlock';
import { IouInfoBlock } from './IouInfoBlock';
import { PrepareChequeTable } from './PrepareChequeTable';
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
  const { add: addPreparedCheque, update: updatePreparedCheque } = useChequePrepareStore();
  const { postVoucherEntry } = useVouchers();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedChequeId, setLastSavedChequeId] = useState<string | null>(null);
  const [lastVoucherId, setLastVoucherId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Column visibility hook (persisted in localStorage per sourceType)
  const { columns, updateColumns } = useColumnVisibility(sourceType);

  // 1. Bank & Source Header State
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

  // 3. Prepare Lines State (Direct: 1..N; Bill/IOU: 1)
  const [lines, setLines] = useState<PrepareLine[]>([
    {
      id: `line-${Date.now()}-init`,
      chequeType: 'AC Payee',
      chequeNo: '',
      chequeDate: new Date().toISOString().split('T')[0],
      payTo: '',
      chequeFor: sourceType === 'iou' ? 'Employee' : 'Supplier',
      name: '',
      glAccountId: 'acc-02-01-01-01',
      amount: 0,
    },
  ]);

  // 4. Build Journal State
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [voucherType, setVoucherType] = useState('Bank Payment');
  const [narration, setNarration] = useState('');
  const [isAutoNarrationOverridden, setIsAutoNarrationOverridden] = useState(false);

  // Initial books load
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Selected book reference
  const currentBook = books.find((b) => b.id === bookId) || null;

  // Auto-narration for Direct payment (RULE CP7, CP8, N.B. #2)
  useEffect(() => {
    if (sourceType === 'direct' && !isAutoNarrationOverridden && lines[0]) {
      const autoText = buildAutoNarration({
        name: lines[0].name,
        chequeFor: lines[0].chequeFor,
        chequeNo: lines[0].chequeNo,
        chequeDate: lines[0].chequeDate,
      });
      setNarration(autoText);
    }
  }, [
    sourceType,
    isAutoNarrationOverridden,
    lines[0]?.name,
    lines[0]?.chequeFor,
    lines[0]?.chequeNo,
    lines[0]?.chequeDate,
  ]);

  // Handle Account change -> auto-populates bankName and selects default book
  const handleAccountChange = (acc: CoaBankAccount | null) => {
    if (acc) {
      setAccountsBankId(acc.id);
      setBankName(acc.bankName);
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
    // Clear chequeNo in lines
    setLines((prev) => prev.map((l) => ({ ...l, chequeNo: '' })));
  };

  // Handle Party Selection (Bill/IOU)
  const handlePartyNameChange = (
    name: string,
    extra?: { supplierId?: string; employeeId?: string }
  ) => {
    setPartyName(name);
    if (extra?.supplierId) setSelectedSupplierId(extra.supplierId);
    if (extra?.employeeId) setSelectedEmployeeId(extra.employeeId);

    // Sync line payTo and name
    setLines((prev) => [
      {
        ...prev[0],
        payTo: name,
        name: name,
      },
    ]);
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
      setLines((prev) => [{ ...prev[0], amount: rem }]);
    } else {
      setBillNo('');
      setBillDate('');
      setBillValue(0);
      setPrevPaid(0);
      setBalance(0);
      setPayAmount(0);
      setLines((prev) => [{ ...prev[0], amount: 0 }]);
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
      setLines((prev) => [{ ...prev[0], amount: rem }]);
    } else {
      setBillNo('');
      setBillDate('');
      setBillValue(0);
      setPrevPaid(0);
      setBalance(0);
      setPayAmount(0);
      setLines((prev) => [{ ...prev[0], amount: 0 }]);
    }
  };

  // When pay amount changes in bill/iou
  const handlePayAmountChange = (newVal: number) => {
    setPayAmount(newVal);
    setLines((prev) => [{ ...prev[0], amount: newVal }]);
  };

  // Reset form
  const handleResetForm = () => {
    setLines([
      {
        id: `line-${Date.now()}-reset`,
        chequeType: 'AC Payee',
        chequeNo: '',
        chequeDate: new Date().toISOString().split('T')[0],
        payTo: '',
        chequeFor: sourceType === 'iou' ? 'Employee' : 'Supplier',
        name: '',
        glAccountId: 'acc-02-01-01-01',
        amount: 0,
      },
    ]);
    setPartyName('');
    setBillNo('');
    setBillDate('');
    setBillValue(0);
    setPrevPaid(0);
    setBalance(0);
    setPayAmount(0);
    setNarration('');
    setIsAutoNarrationOverridden(false);
    setLastSavedChequeId(null);
    setLastVoucherId(null);
    setErrors({});
  };

  // Re-generate journal after saving
  const handleRegenerateJournal = async () => {
    if (!lastSavedChequeId) return;
    setIsSaving(true);
    try {
      const totalAmount = lines.reduce((sum, l) => sum + (l.amount || 0), 0);
      const posted = postVoucherEntry({
        id: `vch-${Date.now()}`,
        voucherNumber: `VCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        voucherType:
          voucherType === 'Contra'
            ? 'Contra Voucher'
            : voucherType === 'Journal'
            ? 'Journal Voucher'
            : 'Payment Voucher',
        date: voucherDate,
        headerAccountId: accountsBankId,
        headerAccountName: bankName,
        lines: lines.map((line, idx) => ({
          id: `line-${idx + 1}`,
          accountHeadId: line.glAccountId,
          accountHeadName: line.name || line.payTo || 'Accounts Payable',
          currency: 'BDT',
          exchangeRate: 1,
          debit: line.amount,
          credit: 0,
          debitBDT: line.amount,
          creditBDT: 0,
          description: `CQ No: ${line.chequeNo} | Pay to: ${line.payTo}`,
        })),
        narration: narration || `Cheque disbursement for ${sourceType} payment`,
        totals: {
          debit: totalAmount,
          credit: totalAmount,
          debitBDT: totalAmount,
          creditBDT: totalAmount,
        },
        createdAt: new Date().toISOString(),
      });

      await updatePreparedCheque(lastSavedChequeId, {
        voucherId: posted.id,
        voucherNo: posted.voucherNumber,
        voucherDate: voucherDate,
        voucherType: voucherType,
      });

      setLastVoucherId(posted.id);
      toast.success(`Journal entry re-generated! Posted voucher: ${posted.voucherNumber}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to re-generate journal entry');
    } finally {
      setIsSaving(false);
    }
  };

  // Save handler
  const executeSave = async (withJournal: boolean) => {
    const rawPayload: ChequePrepareFormValues = {
      sourceType,
      accountsBankId,
      bankName: bankName || currentBook?.bankName || '',
      bookName: currentBook?.bookName || '',
      chequeFor: sourceType !== 'direct' ? chequeFor : undefined,
      name: sourceType !== 'direct' ? partyName : undefined,

      bill:
        sourceType === 'bill' && billNo
          ? {
              billNo,
              billDate,
              billValue,
              prevPaid,
              balance,
              payAmount,
            }
          : undefined,

      iou:
        sourceType === 'iou' && billNo
          ? {
              requisitionNo: billNo,
              reqDate: billDate,
              reqValue: billValue,
              prevPaid,
              balance,
              payAmount,
            }
          : undefined,

      lines,

      voucherDate: withJournal ? voucherDate : undefined,
      voucherType: withJournal ? voucherType : undefined,
      narration: narration || undefined,
    };

    const parsed = chequePrepareSchema.safeParse(rawPayload);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errMap[path] = issue.message;
      });
      setErrors(errMap);
      const firstMsg = parsed.error.issues[0]?.message || 'Please verify form fields';
      toast.error(firstMsg);
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      let createdVoucherId: string | undefined;

      // If Save & Journal is clicked, create linked voucher entry
      if (withJournal) {
        const totalAmount = lines.reduce((sum, l) => sum + (l.amount || 0), 0);
        const posted = postVoucherEntry({
          id: `vch-${Date.now()}`,
          voucherNumber: `VCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          voucherType:
            voucherType === 'Contra'
              ? 'Contra Voucher'
              : voucherType === 'Journal'
              ? 'Journal Voucher'
              : 'Payment Voucher',
          date: voucherDate,
          headerAccountId: accountsBankId,
          headerAccountName: bankName,
          lines: lines.map((line, idx) => ({
            id: `line-${idx + 1}`,
            accountHeadId: line.glAccountId,
            accountHeadName: line.name || line.payTo || 'Accounts Payable',
            currency: 'BDT',
            exchangeRate: 1,
            debit: line.amount,
            credit: 0,
            debitBDT: line.amount,
            creditBDT: 0,
            description: `CQ No: ${line.chequeNo} | Pay to: ${line.payTo}`,
          })),
          narration: narration || `Cheque disbursement for ${sourceType} payment`,
          totals: {
            debit: totalAmount,
            credit: totalAmount,
            debitBDT: totalAmount,
            creditBDT: totalAmount,
          },
          createdAt: new Date().toISOString(),
        });
        createdVoucherId = posted.id;
        setLastVoucherId(posted.id);
      }

      const created = await addPreparedCheque({
        ...rawPayload,
        voucherId: createdVoucherId,
        voucherNo: createdVoucherId ? `VCH-${new Date().getFullYear()}-001` : undefined,
      });

      setLastSavedChequeId(created.id);
      await loadBooks(); // refresh consumed cheque leafs

      if (withJournal) {
        toast.success(`Cheque prepared · Linked ${voucherType} voucher posted!`);
      } else {
        toast.success('Cheque prepared and saved to register successfully!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to prepare cheque');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Sub-Nav sticky pills */}
      <PrepareSubNav activeType={sourceType} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeSave(false);
        }}
        className="space-y-5"
      >
        {/* 1. Bank & Source Information Card */}
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
            setLines((prev) => prev.map((l) => ({ ...l, chequeNo: '' })));
          }}
          onChequeForChange={setChequeFor}
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

        {/* 3. Prepare Cheque Block (Multi-line for Direct, single for Bill/IOU) */}
        <PrepareChequeTable
          sourceType={sourceType}
          book={currentBook}
          lines={lines}
          onLinesChange={setLines}
          columns={columns}
          onColumnsChange={updateColumns}
          isAmountLocked={sourceType !== 'direct'}
          errors={errors}
        />

        {/* 4. Build Journal Block */}
        <BuildJournalBlock
          sourceType={sourceType}
          voucherDate={voucherDate}
          voucherType={voucherType}
          narration={narration}
          isAutoNarrationOverridden={isAutoNarrationOverridden}
          onVoucherDateChange={setVoucherDate}
          onVoucherTypeChange={setVoucherType}
          onNarrationChange={(val) => {
            setNarration(val);
            if (sourceType === 'direct') {
              setIsAutoNarrationOverridden(true);
            }
          }}
          onResetAutoNarration={() => {
            setIsAutoNarrationOverridden(false);
            if (lines[0]) {
              setNarration(
                buildAutoNarration({
                  name: lines[0].name,
                  chequeFor: lines[0].chequeFor,
                  chequeNo: lines[0].chequeNo,
                  chequeDate: lines[0].chequeDate,
                })
              );
            }
          }}
        />

        {/* 5. Sticky Footer Action Bar */}
        <PrepareActionBar
          lastSavedChequeId={lastSavedChequeId}
          lastVoucherId={lastVoucherId}
          isSaving={isSaving}
          onSave={() => executeSave(false)}
          onSaveAndJournal={() => executeSave(true)}
          onRegenerateJournal={handleRegenerateJournal}
          hasJournal={Boolean(voucherType)}
          onReset={handleResetForm}
        />
      </form>
    </div>
  );
};
