import React from 'react';
import { MOCK_COMPANIES } from '../../mock/companies';

interface CompanyChipsProps {
  companyIds: string[];
  maxVisible?: number;
  className?: string;
  size?: 'xs' | 'sm';
}

export const CompanyChips: React.FC<CompanyChipsProps> = ({
  companyIds,
  maxVisible = 3,
  className = '',
  size = 'sm',
}) => {
  if (!companyIds || companyIds.length === 0) {
    return <span className="text-slate-400 italic text-xs">All Companies</span>;
  }

  const visible = companyIds.slice(0, maxVisible);
  const remaining = companyIds.length - maxVisible;

  const getCompanyDetails = (id: string) => {
    return MOCK_COMPANIES.find((c) => c.id === id) || { id, name: id };
  };

  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {visible.map((id) => {
        const comp = getCompanyDetails(id);
        return (
          <span
            key={id}
            title={comp.name}
            className={[
              'inline-flex items-center rounded-full font-medium transition-colors border',
              size === 'xs'
                ? 'px-1.5 py-0.5 text-[10px]'
                : 'px-2 py-0.5 text-[11px]',
              'bg-slate-100/90 text-slate-700 border-slate-200/80 hover:bg-slate-200/70',
            ].join(' ')}
          >
            <span className="font-bold text-slate-800 mr-1">{comp.id}</span>
            <span className="max-w-[110px] truncate text-slate-600 hidden sm:inline">
              {comp.name.replace(/Pakiza\s*/i, '')}
            </span>
          </span>
        );
      })}

      {remaining > 0 && (
        <span
          title={companyIds
            .slice(maxVisible)
            .map((id) => getCompanyDetails(id).name)
            .join(', ')}
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
};
