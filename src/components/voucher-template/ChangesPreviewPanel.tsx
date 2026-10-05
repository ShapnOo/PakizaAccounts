import React, { useState } from 'react';
import { VoucherTemplate } from '../../types/voucherTemplate';
import { PaperCanvas } from './PaperCanvas';
import { ZoomControl } from './ZoomControl';
import { Ruler, Sparkles, RefreshCw, Eye } from 'lucide-react';

interface ChangesPreviewPanelProps {
  template: VoucherTemplate;
  company: any;
  previewLines: any[];
  zoom: number;
  onZoomChange: (zoom: number) => void;
  livePreviewEnabled: boolean;
  onRefresh?: () => void;
}

export const ChangesPreviewPanel: React.FC<ChangesPreviewPanelProps> = ({
  template,
  company,
  previewLines,
  zoom,
  onZoomChange,
  livePreviewEnabled,
  onRefresh,
}) => {
  const [showMarginGuides, setShowMarginGuides] = useState(false);

  return (
    <div className="h-full flex flex-col bg-slate-100/70 dark:bg-muted/15 border-l border-border/80">
      {/* ── Floating Preview Control Bar ── */}
      <div className="px-4 py-2.5 bg-card/90 backdrop-blur-md border-b border-border/80 flex items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Eye className="size-3.5 text-indigo-600" />
            <span>Changes Preview</span>
          </div>

          <span className="hidden sm:inline-flex text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/50">
            {template.paper.size} {template.paper.orientation}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Margin Guides Toggle */}
          <button
            type="button"
            onClick={() => setShowMarginGuides(!showMarginGuides)}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              showMarginGuides
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
            title="Toggle margin guidelines"
          >
            <Ruler className="size-3" />
            <span className="hidden md:inline">Guides</span>
          </button>

          {/* Zoom Control */}
          <ZoomControl zoom={zoom} onZoomChange={onZoomChange} />

          {/* Refresh button if live updates paused */}
          {!livePreviewEnabled && onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-xs"
            >
              <RefreshCw className="size-3" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Drafting Workspace ── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex items-start justify-center sidebar-scroll">
        <PaperCanvas
          template={template}
          company={company}
          previewLines={previewLines}
          zoom={zoom}
          showMarginGuides={showMarginGuides}
        />
      </div>
    </div>
  );
};
