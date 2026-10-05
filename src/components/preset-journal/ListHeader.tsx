import { Link } from 'react-router-dom';
import { Bookmark, Plus, Sparkles, BookOpen, Layers } from 'lucide-react';

interface ListHeaderProps {
  totalCount: number;
}

export function ListHeader({ totalCount }: ListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
            <Bookmark className="size-4.5" />
          </div>
          <div className="flex items-center gap-2">
            <h1
              className="text-xl md:text-2xl font-black tracking-tight text-foreground"
              data-raw-sheet-tab="Preset Jornal"
            >
              Preset Journals
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
              {totalCount} Templates
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Reusable voucher templates for fast entry — consumed via{' '}
          <span className="text-foreground font-semibold">"Choose Form Preset"</span> in Journal Entries.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/journal-entries"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-xs"
        >
          <BookOpen className="size-3.5 text-indigo-600" />
          <span>Journal Entries</span>
        </Link>

        <Link
          to="/preset-journal/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>New Preset</span>
        </Link>
      </div>
    </div>
  );
}
