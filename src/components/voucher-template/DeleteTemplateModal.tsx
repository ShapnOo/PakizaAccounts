import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { VoucherTemplate } from '../../types/voucherTemplate';

interface DeleteTemplateModalProps {
  template: VoucherTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = React.useState(false);

  if (!isOpen || !template) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(template.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-border/80 flex items-start gap-3 bg-rose-50/40 dark:bg-rose-950/20">
          <div className="size-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 grid place-items-center shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground">Delete Template</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Are you sure you want to delete this voucher template?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{template.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted border border-border">
                {template.voucherType}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Paper: {template.paper.size} ({template.paper.orientation}) · Font: {template.font.family}
            </p>
          </div>

          {template.isDefault && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
              <strong>Notice:</strong> This is currently the default template for {template.voucherType} vouchers. Deleting it will designate another template as default.
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            This action cannot be undone. Custom column arrangements and margin setups will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-3.5 border-t border-border/80 bg-muted/20 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Trash2 className="size-3.5" />
            <span>{deleting ? 'Deleting...' : 'Delete Template'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
