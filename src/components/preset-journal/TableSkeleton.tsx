export function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs divide-y divide-border/60">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 w-44 bg-muted rounded-md" />
              <div className="h-3 w-28 bg-muted/60 rounded-md" />
            </div>
          </div>
          <div className="h-6 w-24 bg-muted rounded-full" />
          <div className="h-4 w-16 bg-muted rounded-md hidden md:block" />
          <div className="h-4 w-32 bg-muted rounded-md hidden lg:block" />
          <div className="h-8 w-8 bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  );
}
