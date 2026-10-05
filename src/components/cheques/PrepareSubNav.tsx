import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, FileText, Receipt, ArrowLeft } from 'lucide-react';
import { SOURCE_TYPES, SourceType } from '../../types/chequePrepare';

interface PrepareSubNavProps {
  activeType?: SourceType;
  showBackToRegister?: boolean;
}

export const PrepareSubNav: React.FC<PrepareSubNavProps> = ({
  activeType,
  showBackToRegister = true,
}) => {
  const getIcon = (type: SourceType) => {
    switch (type) {
      case 'direct':
        return <CreditCard className="size-3.5" />;
      case 'bill':
        return <FileText className="size-3.5" />;
      case 'iou':
        return <Receipt className="size-3.5" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
      {/* Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/50 dark:bg-muted/20 border border-border/80 rounded-xl overflow-x-auto">
        {SOURCE_TYPES.map((t) => {
          const isActive = activeType === t.value;
          return (
            <NavLink
              key={t.value}
              to={t.route}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                isActive
                  ? 'bg-card text-foreground shadow-sm border border-border font-extrabold ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  t.value === 'direct'
                    ? 'bg-sky-500'
                    : t.value === 'bill'
                    ? 'bg-amber-500'
                    : 'bg-violet-500'
                }`}
              />
              {getIcon(t.value)}
              <span>{t.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Back button */}
      {showBackToRegister && (
        <NavLink
          to="/cheques/register"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Cheque Register</span>
        </NavLink>
      )}
    </div>
  );
};
