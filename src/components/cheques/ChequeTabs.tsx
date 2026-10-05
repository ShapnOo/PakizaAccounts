import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Banknote, ListChecks } from 'lucide-react';
import { SOURCE_TYPES } from '../../types/cheque';

export const ChequeTabs: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isPrepare = currentPath.includes('/cheques/prepare');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
      {/* Primary Module Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border w-fit">
        <NavLink
          to="/cheques/books"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive || currentPath === '/cheques' || currentPath.startsWith('/cheques/books')
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <BookOpen className="size-3.5 text-indigo-500" />
          <span>Cheque Books</span>
        </NavLink>

        <NavLink
          to="/cheques/prepare/direct"
          className={() =>
            `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isPrepare
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <Banknote className="size-3.5 text-indigo-500" />
          <span>Prepare Cheque</span>
        </NavLink>

        <NavLink
          to="/cheques/register"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <ListChecks className="size-3.5 text-indigo-500" />
          <span>Cheque Register</span>
        </NavLink>
      </div>

      {/* Prepare Sub-pills (When on prepare screens) */}
      {isPrepare && (
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/60">
          <span className="text-[11px] font-semibold text-muted-foreground px-2 hidden md:inline">
            Source Mode:
          </span>
          {SOURCE_TYPES.map((st) => (
            <NavLink
              key={st.value}
              to={st.route}
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              {st.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
