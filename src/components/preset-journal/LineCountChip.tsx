import { Layers } from 'lucide-react';

interface LineCountChipProps {
  count: number;
}

export function LineCountChip({ count }: LineCountChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] font-semibold whitespace-nowrap">
      <Layers className="size-3 text-muted-foreground/70" />
      <span>{count} {count === 1 ? 'line' : 'lines'}</span>
    </span>
  );
}
