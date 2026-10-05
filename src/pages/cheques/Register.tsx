import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChequePrepareStore } from '../../stores/preparedChequeStore';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { RegisterTable } from '../../components/cheques/RegisterTable';
import { ListChecks, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { prepared, loading, load, voidCheque } = useChequePrepareStore();

  useEffect(() => {
    load();
  }, [load]);

  const handleVoidCheque = async (id: string) => {
    try {
      await voidCheque(id);
      toast.success('Cheque preparation voided and cheque leaf freed for reuse');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to void cheque');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      {/* Module Navigation Tabs */}
      <ChequeTabs />

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-2xs">
            <ListChecks className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Cheque Book Register
            </h1>
            <p className="text-xs text-muted-foreground">
              Master audit register of all prepared, printed, and disbursed cheques
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/cheques/prepare/direct')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="size-4" />
            <span>Prepare Cheque</span>
          </button>
        </div>
      </div>

      {/* Register Table Component */}
      <RegisterTable
        records={prepared}
        onVoid={handleVoidCheque}
        isLoading={loading}
      />
    </div>
  );
};
