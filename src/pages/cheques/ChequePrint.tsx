import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PreparedCheque } from '../../types/cheque';
import { getPreparedCheque } from '../../services/preparedChequeService';
import { getChequeBook } from '../../services/chequeBookService';
import { ChequePrintCanvas } from '../../components/cheques/ChequePrintCanvas';
import { toast } from 'sonner';

export const ChequePrintPage: React.FC = () => {
  const { preparedId } = useParams<{ preparedId: string }>();
  const navigate = useNavigate();

  const [cheque, setCheque] = useState<PreparedCheque | null>(null);
  const [signatory, setSignatory] = useState('Managing Director');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!preparedId) return;
    const fetchCheque = async () => {
      setLoading(true);
      try {
        const item = await getPreparedCheque(preparedId);
        if (item) {
          setCheque(item);
          // Look up signatory from book leaf
          const book = await getChequeBook(item.chequeBookId);
          if (book) {
            const leaf = book.cheques.find((c) => c.chequeNo === item.chequeNo);
            if (leaf?.signatory) {
              setSignatory(leaf.signatory);
            }
          }
        } else {
          toast.error('Prepared cheque not found');
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

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-muted-foreground">
        Loading cheque print layout...
      </div>
    );
  }

  if (!cheque) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-muted-foreground">
        Cheque record not found.
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20">
      <ChequePrintCanvas cheque={cheque} signatoryCaption={signatory} />
    </div>
  );
};
