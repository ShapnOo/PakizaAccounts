import {
  X,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  Layout,
  Sparkles,
} from 'lucide-react';
import { ALL_WIDGETS, useDashboardStore } from '../../stores/useDashboardStore';
import { DashboardWidgetId } from '../../types/dashboard';
import { toast } from 'sonner';

export function DashboardCustomizerDrawer() {
  const {
    customizerOpen,
    setCustomizerOpen,
    widgets,
    toggleWidget,
    enableAllWidgets,
    resetToDefaults,
    density,
    setDensity,
  } = useDashboardStore();

  if (!customizerOpen) return null;

  const handleReset = () => {
    resetToDefaults();
    toast.success('Dashboard layout & widgets reset to defaults');
  };

  const handleEnableAll = () => {
    enableAllWidgets();
    toast.success('All dashboard widgets enabled');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sliders className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Customize Dashboard
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Toggle widgets & personalize layout
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCustomizerOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto sidebar-scroll p-4 space-y-5">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnableAll}
              className="flex-1 py-1.5 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="size-3.5 text-primary" />
              <span>Show All</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-1.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Density Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layout className="size-3.5 text-primary" />
              <span>Display Density</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-all capitalize ${
                    density === d
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Widget List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide text-muted-foreground">
              Dashboard Widgets
            </label>

            <div className="space-y-2">
              {ALL_WIDGETS.map((widget) => {
                const isEnabled = widgets[widget.id] ?? true;

                return (
                  <div
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isEnabled
                        ? 'border-primary/40 bg-primary/5 shadow-xs'
                        : 'border-border bg-muted/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {widget.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-muted text-muted-foreground">
                          {widget.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {widget.description}
                      </p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`size-5 rounded-md flex items-center justify-center transition-colors ${
                          isEnabled
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border bg-card'
                        }`}
                      >
                        {isEnabled && <CheckCircle2 className="size-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/40 shrink-0 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Changes save automatically
          </span>
          <button
            type="button"
            onClick={() => setCustomizerOpen(false)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
