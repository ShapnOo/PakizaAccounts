import React, { useState } from 'react';
import {
  X,
  Printer,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { VoucherTemplate } from '../../types/voucherTemplate';
import { PaperCanvas } from './PaperCanvas';
import { ZoomControl } from './ZoomControl';
import { useNavigate } from 'react-router-dom';

interface ViewTemplateModalProps {
  template: VoucherTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  company: any;
  previewLines: any[];
}

export const ViewTemplateModal: React.FC<ViewTemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  company,
  previewLines,
}) => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(70);
  const [showRulers, setShowRulers] = useState(true);
  const [showMarginGuides, setShowMarginGuides] = useState(true);
  const [showCenterAxes, setShowCenterAxes] = useState(false);

  if (!isOpen || !template) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    onClose();
    navigate(`/voucher-template/${template.id}/edit`);
  };

  const visibleColsCount = Object.values(template.table.columns).filter((c) => c.visible).length;

  const typeColorMap: Record<string, string> = {
    Journal: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    Payment: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Receive: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    Contra: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border/90 rounded-2xl shadow-2xl flex flex-col w-full max-w-6xl h-[92vh] max-h-[950px] overflow-hidden">
        {/* ── Modal Header ── */}
        <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between gap-3 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                typeColorMap[template.voucherType] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {template.voucherType}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                  {template.name}
                </h3>
                {template.isDefault && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
                {template.paper.size} · {template.paper.orientation} · Margins L/R: {template.margin.left}" · {visibleColsCount} Columns
              </p>
            </div>
          </div>

          {/* Action buttons & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Print test */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
              title="Print voucher layout"
            >
              <Printer className="size-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Edit / Modify button */}
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Edit3 className="size-3.5 stroke-[2.5]" />
              <span>Modify Template</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ── Toolbar / Controls ── */}
        <div className="px-5 py-2 border-b border-border/60 bg-card flex items-center justify-between gap-3 shrink-0 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground">View Controls:</span>
            <button
              type="button"
              onClick={() => setShowMarginGuides(!showMarginGuides)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                showMarginGuides
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Margin Guides
            </button>
            <button
              type="button"
              onClick={() => setShowRulers(!showRulers)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                showRulers
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Rulers
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5">
            <ZoomControl zoom={zoom} onZoomChange={setZoom} />
            <button
              type="button"
              onClick={() => setZoom(70)}
              className="px-2 py-1 rounded-md text-[11px] font-semibold border border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Fit
            </button>
          </div>
        </div>

        {/* ── Paper Canvas Container ── */}
        <div className="flex-1 overflow-auto bg-slate-100/80 dark:bg-slate-950/40 p-4 sm:p-8 flex items-start justify-center sidebar-scroll">
          <div className="transition-all duration-150 shadow-xl rounded-sm">
            <PaperCanvas
              template={template}
              company={company}
              previewLines={previewLines}
              zoom={zoom}
              showMarginGuides={showMarginGuides}
              showRulers={showRulers}
              showCenterAxes={showCenterAxes}
            />
          </div>
        </div>

        {/* ── Footer Info Strip ── */}
        <div className="px-5 py-2.5 border-t border-border/80 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <div className="flex items-center gap-3">
            <span>Font: <strong className="text-foreground">{template.font.family} ({template.font.size}pt)</strong></span>
            <span>·</span>
            <span>Theme: <strong className="text-foreground">{template.font.theme}</strong></span>
            <span>·</span>
            <span>Table: <strong className="text-foreground">{template.table.density || 'normal'} density</strong></span>
          </div>
          <div>
            <span>Zoom: {zoom}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
