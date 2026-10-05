import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Banknote, ListChecks } from 'lucide-react';
import { SOURCE_TYPES } from '../../types/chequePrepare';

export const ChequeTabs: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isPrepare = currentPath.includes('/cheques/prepare');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
      {/* Primary Module Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/50 dark:bg-muted/20 rounded-xl border border-border/80 w-fit">
        <NavLink
          to="/cheques/books"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isActive || currentPath === '/cheques' || currentPath.startsWith('/cheques/books')
                ? 'bg-card text-foreground shadow-sm border border-border font-extrabold ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`
          }
        >
          <BookOpen className="size-3.5 text-primary" />
          <span>Cheque Books</span>
        </NavLink>

        <NavLink
          to="/cheques/prepare/direct"
          className={() =>
            `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isPrepare
                ? 'bg-card text-foreground shadow-sm border border-border font-extrabold ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`
          }
        >
          <Banknote className="size-3.5 text-primary" />
          <span>Prepare Cheque</span>
        </NavLink>

        <NavLink
          to="/cheques/register"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isActive
                ? 'bg-card text-foreground shadow-sm border border-border font-extrabold ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`
          }
        >
          <ListChecks className="size-3.5 text-primary" />
          <span>Cheque Register</span>
        </NavLink>
      </div>

      {/* Prepare Sub-pills (When on prepare screens) */}
      {isPrepare && (
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
          <span className="text-[11px] font-bold text-muted-foreground px-2 hidden md:inline">
            Mode:
          </span>
          {SOURCE_TYPES.map((st) => (
            <NavLink
              key={st.value}
              to={st.route}
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
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
