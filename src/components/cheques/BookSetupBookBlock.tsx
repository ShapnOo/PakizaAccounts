import React from 'react';
import { BookMarked, ChevronsRight } from 'lucide-react';

interface BookSetupBookBlockProps {
  bookName: string;
  firstChequeNo: string;
  noOfCheque: number;
  onBookNameChange: (val: string) => void;
  onFirstChequeNoChange: (val: string) => void;
  onNoOfChequeChange: (val: number) => void;
  onAddClick: () => void;
  errors?: Record<string, string | undefined>;
}

export const BookSetupBookBlock: React.FC<BookSetupBookBlockProps> = ({
  bookName,
  firstChequeNo,
  noOfCheque,
  onBookNameChange,
  onFirstChequeNoChange,
  onNoOfChequeChange,
  onAddClick,
  errors = {},
}) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-2xs p-4.5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/70">
        <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <BookMarked className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Cheque Book Definition & Range
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Enter book title and starting cheque serial to auto-generate leaves
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Book Name */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Book Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Test Book, Main Operation Book"
            value={bookName}
            onChange={(e) => onBookNameChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
              errors.bookName ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
          {errors.bookName && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.bookName}</p>
          )}
        </div>

        {/* First Cheque No */}
        <div className="md:col-span-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              First Cheque No. <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-muted-foreground font-mono">e.g. CQ26000001</span>
          </div>
          <input
            type="text"
            placeholder="e.g. CQ26000001"
            value={firstChequeNo}
            onChange={(e) => onFirstChequeNoChange(e.target.value.toUpperCase())}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold tracking-wider text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
              errors.firstChequeNo ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
          {errors.firstChequeNo && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.firstChequeNo}</p>
          )}
        </div>

        {/* No of Cheque */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Number of Cheques <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={noOfCheque || ''}
            onChange={(e) => onNoOfChequeChange(parseInt(e.target.value, 10) || 0)}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
              errors.noOfCheque ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
          {errors.noOfCheque && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.noOfCheque}</p>
          )}
        </div>

        {/* ADD >> Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={onAddClick}
            className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            title="Auto-generate sequential cheque rows"
          >
            <span>ADD</span>
            <ChevronsRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
