import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Printer, ArrowLeft, Building2, Calendar, FileText } from 'lucide-react';
import { ChequePrepare, PrepareLine } from '../../types/chequePrepare';
import { getPreparedCheque } from '../../services/preparedChequeService';
import { listChequeBooks } from '../../services/chequeBookService';
import { ChequePrintCanvas } from '../../components/cheques/ChequePrintCanvas';
import { MOCK_CHEQUE_COMPANY } from '../../mock/companyHeader';
import { toast } from 'sonner';

export const ChequePrintPage: React.FC = () => {
  const { preparedId } = useParams<{ preparedId: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<ChequePrepare | null>(null);
  const [signatories, setSignatories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!preparedId) return;
    const fetchCheque = async () => {
      setLoading(true);
      try {
        const item = await getPreparedCheque(preparedId);
        if (item) {
          setRecord(item);
          // Look up signatory from book leafs
          const books = await listChequeBooks();
          const sigMap: Record<string, string> = {};
          item.lines?.forEach((line) => {
            const targetBook = books.find((b) =>
              b.cheques.some((c) => c.chequeNo === line.chequeNo)
            );
            if (targetBook) {
              const leaf = targetBook.cheques.find((c) => c.chequeNo === line.chequeNo);
              if (leaf?.signatory) {
                sigMap[line.chequeNo] = leaf.signatory;
              }
            }
          });
          setSignatories(sigMap);
        } else {
          toast.error('Prepared cheque record not found');
          navigate('/cheques/register');
        }
      } catch (err) {
        toast.error('Failed to load cheque details');
      } finally {
        setLoading(false);
      }
    };

    fetchCheque();
  }, [preparedId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center text-xs text-muted-foreground">
        Loading cheque print layout...
      </div>
    );
  }

  if (!record || !record.lines || record.lines.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center text-xs text-muted-foreground space-y-3">
        <p className="font-bold text-foreground">Cheque record not found.</p>
        <Link
          to="/cheques/register"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
        >
          Back to Register
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-6">
      {/* Header bar (Hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Link to="/cheques/register" className="hover:text-primary transition-colors">
              Cheque Register
            </Link>
            <span>/</span>
            <span className="text-primary font-black">Cheque Print Preview</span>
          </div>
          <h1 className="text-xl font-black text-foreground flex items-center gap-2">
            <span>Physical Cheque Paper Layout</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase">
              {record.lines.length} {record.lines.length === 1 ? 'Cheque Leaf' : 'Cheque Leafs'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 h-9 px-4.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer active:scale-95"
          >
            <Printer className="size-4" />
            <span>Print Cheque</span>
          </button>
        </div>
      </div>

      {/* Canvas Stack */}
      <div className="space-y-8 print:space-y-0">
        {record.lines.map((line, idx) => (
          <div
            key={line.id || idx}
            className="print:break-after-page print:p-0"
          >
            <ChequePrintCanvas
              line={line}
              bankName={record.bankName}
              sourceType={record.sourceType}
              narration={record.narration}
              signatory={signatories[line.chequeNo] || 'Managing Director'}
              companyName={MOCK_CHEQUE_COMPANY.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
