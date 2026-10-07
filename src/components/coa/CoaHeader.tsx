import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Upload,
  TableProperties,
  ListTree,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { COMPANY } from '../../constants/accountsTypeTree';

interface CoaHeaderProps {
  onOpenUpload: () => void;
  onOpenCreate?: () => void;
  totalAccounts?: number;
}

export const CoaHeader: React.FC<CoaHeaderProps> = ({
  onOpenUpload,
  onOpenCreate,
  totalAccounts = 0,
}) => {
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') === 'tree' ? 'tree' : 'list';

  return (
    <div className="space-y-3.5 pb-2">
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
        <span>Home</span>
        <ChevronRight className="size-3 text-muted-foreground/40" />
        <span>Accounts Configuration</span>
        <ChevronRight className="size-3 text-muted-foreground/40" />
        <span className="text-primary font-black">Chart of Accounts</span>
      </div>

      {/* ── Title & Global Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shadow-2xs">
              <FolderTree className="size-4.5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <span>Chart of Accounts</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {totalAccounts} Accounts
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Multi-tier financial chart taxonomy, account codes, and general ledger structures.
              </p>
            </div>
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Scope */}
          <div className="hidden lg:flex items-center gap-1.5 bg-card px-2.5 py-1.5 rounded-lg border border-border/70 shadow-2xs text-xs font-semibold text-muted-foreground">
            <Building2 className="size-3.5 text-primary" />
            <span className="text-foreground font-bold">{COMPANY}</span>
          </div>

          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted/70 text-foreground text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Upload className="size-3.5 text-muted-foreground" />
            <span>Chart Upload</span>
          </button>

          {onOpenCreate ? (
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Create New</span>
            </button>
          ) : (
            <Link
              to="/chart-of-accounts/new"
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Create New</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Tab Strip ── */}
      <div className="flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-1 -mb-px">
          <Link
            to="/chart-of-accounts"
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              currentView === 'list'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <TableProperties className="size-3.5" />
            <span>List View</span>
          </Link>

          <Link
            to="/chart-of-accounts?view=tree"
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              currentView === 'tree'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <ListTree className="size-3.5" />
            <span>Tree View</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
