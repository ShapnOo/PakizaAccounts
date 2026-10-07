import React, { useState, useMemo } from 'react';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { RateRow } from './RateRow';
import { TableSkeleton } from './TableSkeleton';
import { EmptyState } from './EmptyState';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface RateTableProps {
  setups: CurrencySetup[];
  rates: ExchangeRate[];
  loading: boolean;
  onUpdateRate: (currencyId: string, rate: number, effectiveDate: string) => Promise<void>;
  onSetBase: (currencyId: string) => Promise<void>;
  onDelete: (currencyId: string) => Promise<void>;
  onOpenHistory: (setup: CurrencySetup) => void;
  onEdit?: (setup: CurrencySetup) => void;
}

export const RateTable: React.FC<RateTableProps> = ({
  setups,
  rates,
  loading,
  onUpdateRate,
  onSetBase,
  onDelete,
  onOpenHistory,
  onEdit,
}) => {
  const [search, setSearch] = useState('');
  const [baseFilter, setBaseFilter] = useState<'All' | 'Base' | 'NonBase'>('All');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Rates map for fast lookup
  const ratesMap = useMemo(() => {
    const map = new Map<string, ExchangeRate>();
    rates.forEach((r) => map.set(r.currencyId, r));
    return map;
  }, [rates]);

  // Filtering
  const filteredSetups = useMemo(() => {
    return setups.filter((s) => {
      const rate = ratesMap.get(s.id);
      const isBase = Boolean(rate?.isBase);

      if (baseFilter === 'Base' && !isBase) return false;
      if (baseFilter === 'NonBase' && isBase) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const codeMatch = s.code.toLowerCase().includes(q);
        const nameMatch = s.name.toLowerCase().includes(q);
        const countryMatch = s.country.toLowerCase().includes(q);
        return codeMatch || nameMatch || countryMatch;
      }
      return true;
    });
  }, [setups, ratesMap, baseFilter, search]);

  return (
    <div className="space-y-3">
      {/* ── Toolbar: Search & Filters ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by code, country, or currency name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Right: Filters & Density */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Base Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <Filter className="size-3 text-muted-foreground" />
            <select
              value={baseFilter}
              onChange={(e: any) => setBaseFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Currencies</option>
              <option value="Base">Base Currency Only</option>
              <option value="NonBase">Foreign Currencies</option>
            </select>
          </div>

          {/* Density Switcher */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                density === 'comfortable'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                density === 'compact'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* ── Table Container (Full width, responsive) ── */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 border-b border-border/80 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-4 font-black">Currency Name</th>
                <th className="py-2.5 px-4 font-black text-right w-44">Exchange Rate</th>
                <th className="py-2.5 px-4 font-bold w-36">Effective Date</th>
                <th className="py-2.5 px-4 font-bold w-20 text-center">History</th>
                <th className="py-2.5 px-4 font-bold min-w-[140px] text-center whitespace-nowrap">Base Currency</th>
                <th className="py-2.5 px-4 font-bold w-14 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : filteredSetups.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                filteredSetups.map((setup) => (
                  <RateRow
                    key={setup.id}
                    setup={setup}
                    rate={ratesMap.get(setup.id)}
                    onUpdateRate={onUpdateRate}
                    onSetBase={onSetBase}
                    onDelete={onDelete}
                    onOpenHistory={onOpenHistory}
                    onEdit={onEdit}
                    density={density}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
