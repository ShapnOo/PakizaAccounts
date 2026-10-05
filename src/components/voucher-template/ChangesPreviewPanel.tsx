import React, { useState } from 'react';
import { VoucherTemplate } from '../../types/voucherTemplate';
import { PaperCanvas } from './PaperCanvas';
import { ZoomControl } from './ZoomControl';
import { RulerUnit } from './RulerBar';
import {
  Ruler,
  Sparkles,
  RefreshCw,
  Eye,
  Grid,
  Crosshair,
  Printer,
  Layers,
  ChevronDown,
  Sliders,
  Check,
  Maximize2,
  FileSpreadsheet,
} from 'lucide-react';
import { PAPER_SIZES_MM } from '../../types/voucherTemplate';

interface ChangesPreviewPanelProps {
  template: VoucherTemplate;
  company: any;
  previewLines: any[];
  zoom: number;
  onZoomChange: (zoom: number) => void;
  livePreviewEnabled: boolean;
  onRefresh?: () => void;
}

type ViewMode = 'standard' | 'alignment' | 'grid';

export const ChangesPreviewPanel: React.FC<ChangesPreviewPanelProps> = ({
  template,
  company,
  previewLines: defaultLines,
  zoom,
  onZoomChange,
  livePreviewEnabled,
  onRefresh,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('alignment');
  const [showRulers, setShowRulers] = useState(true);
  const [rulerUnit, setRulerUnit] = useState<RulerUnit>('mm');
  const [showMarginGuides, setShowMarginGuides] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showCenterAxes, setShowCenterAxes] = useState(true);
  const [showSectionOutlines, setShowSectionOutlines] = useState(true);
  const [sampleDatasetKey, setSampleDatasetKey] = useState<'standard' | 'multicurrency' | 'payment' | 'receive'>('standard');
  const [guidesDropdownOpen, setGuidesDropdownOpen] = useState(false);

  // Switch view mode presets
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'standard') {
      setShowRulers(false);
      setShowMarginGuides(false);
      setShowGrid(false);
      setShowCenterAxes(false);
      setShowSectionOutlines(false);
    } else if (mode === 'alignment') {
      setShowRulers(true);
      setShowMarginGuides(true);
      setShowGrid(false);
      setShowCenterAxes(true);
      setShowSectionOutlines(true);
    } else if (mode === 'grid') {
      setShowRulers(true);
      setShowMarginGuides(true);
      setShowGrid(true);
      setShowCenterAxes(true);
      setShowSectionOutlines(true);
    }
  };

  // Sample data presets
  const sampleDatasets = {
    standard: defaultLines,
    multicurrency: [
      {
        accountHead: 'Standard Chartered USD Account',
        costCenter: 'Head Office - Treasury',
        subsidiary: 'SCB Bangladesh',
        employee: '',
        vehicles: '',
        reference: 'SWIFT-99120',
        description: 'Export proceeds remittance received',
        currency: 'USD',
        exchangeRate: 118.5,
        debit: 10000,
        credit: 0,
        debitBDT: 1185000,
        creditBDT: 0,
      },
      {
        accountHead: 'Trade Receivables (Export)',
        costCenter: 'Head Office',
        subsidiary: 'Nordic Apparel Inc. (USA)',
        employee: '',
        vehicles: '',
        reference: 'INV-2026-88',
        description: 'Settlement of export invoice #88',
        currency: 'USD',
        exchangeRate: 118.0,
        debit: 0,
        credit: 10000,
        debitBDT: 0,
        creditBDT: 1180000,
      },
      {
        accountHead: 'Foreign Exchange Gain / Loss',
        costCenter: 'Finance & Accounts',
        subsidiary: '',
        employee: '',
        vehicles: '',
        reference: 'JV-FX-001',
        description: 'Realized exchange rate gain on settlement',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 0,
        creditBDT: 5000,
      },
    ],
    payment: [
      {
        accountHead: 'Raw Materials Inventory',
        costCenter: 'Factory - Unit 1',
        subsidiary: 'Square Yarns Ltd.',
        employee: '',
        vehicles: '',
        reference: 'BILL-4412',
        description: 'Procurement of 100% Cotton 30/1 Yarn',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 450000,
        creditBDT: 0,
      },
      {
        accountHead: 'Tax Deducted at Source (TDS)',
        costCenter: 'Factory - Unit 1',
        subsidiary: 'NBR Tax Authority',
        employee: '',
        vehicles: '',
        reference: 'TDS-2026',
        description: 'TDS @ 3% on raw material supply',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 0,
        creditBDT: 13500,
      },
      {
        accountHead: 'Dutch-Bangla Bank Ltd. (CD A/C)',
        costCenter: 'Head Office',
        subsidiary: 'DBBL Principal Branch',
        employee: '',
        vehicles: '',
        reference: 'CHQ-981204',
        description: 'Account payee cheque issued to supplier',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 0,
        creditBDT: 436500,
      },
    ],
    receive: [
      {
        accountHead: 'City Bank Ltd. (Collection A/C)',
        costCenter: 'Head Office',
        subsidiary: 'City Bank Gulshan',
        employee: '',
        vehicles: '',
        reference: 'EFT-8841',
        description: 'BEFTN electronic fund transfer from customer',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 250000,
        creditBDT: 0,
      },
      {
        accountHead: 'Accounts Receivable (Local)',
        costCenter: 'Sales & Marketing',
        subsidiary: 'Dhaka Fashion Mart',
        employee: 'Shakil Ahmed',
        vehicles: '',
        reference: 'MR-0042',
        description: 'Money receipt against invoice #1042',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 0,
        creditBDT: 250000,
      },
    ],
  };

  const activeLines = sampleDatasets[sampleDatasetKey] || defaultLines;

  const handlePrint = () => {
    window.print();
  };

  const paperBaseMm = PAPER_SIZES_MM[template.paper.size] || PAPER_SIZES_MM.A4;
  const paperWidthMm = template.paper.orientation === 'Portrait' ? paperBaseMm.w : paperBaseMm.h;
  const paperHeightMm = template.paper.orientation === 'Portrait' ? paperBaseMm.h : paperBaseMm.w;

  return (
    <div className="h-full flex flex-col bg-slate-100/70 dark:bg-muted/15 border-l border-border/80">
      {/* ── Floating Preview & Alignment Control Bar ── */}
      <div className="px-3 py-2 bg-card/95 backdrop-blur-md border-b border-border/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-2xs z-30">
        {/* Left: View Mode Pills & Sample Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => handleSetViewMode('standard')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'standard'
                  ? 'bg-card text-foreground shadow-2xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="size-3 text-indigo-600" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetViewMode('alignment')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'alignment'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Crosshair className="size-3" />
              <span>Alignment View</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetViewMode('grid')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="size-3" />
              <span>Grid Mode</span>
            </button>
          </div>

          {/* Sample Voucher Switcher */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-muted-foreground">Sample:</span>
            <select
              value={sampleDatasetKey}
              onChange={(e) => setSampleDatasetKey(e.target.value as any)}
              className="h-7.5 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            >
              <option value="standard">Standard JV (2 Lines)</option>
              <option value="multicurrency">Multi-Currency JV (3 Lines · USD/BDT)</option>
              <option value="payment">Supplier Payment (3 Lines · TDS/Bank)</option>
              <option value="receive">Customer Receipt (2 Lines · BEFTN)</option>
            </select>
          </div>
        </div>

        {/* Right: Alignment Toggles, Zoom & Print */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Detailed Guidelines Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setGuidesDropdownOpen(!guidesDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
            >
              <Sliders className="size-3 text-indigo-600" />
              <span>Guides</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {guidesDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setGuidesDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-56 p-2 rounded-xl bg-card border border-border shadow-lg z-50 space-y-1 text-xs">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                    Alignment Guidelines
                  </div>

                  {/* Rulers */}
                  <button
                    type="button"
                    onClick={() => setShowRulers(!showRulers)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Ruler className="size-3.5 text-indigo-600" />
                      <span>Rulers ({rulerUnit})</span>
                    </span>
                    {showRulers && <Check className="size-3.5 text-indigo-600" />}
                  </button>

                  {/* Ruler Unit Toggle */}
                  {showRulers && (
                    <div className="flex items-center justify-between px-2 py-1 bg-muted/40 rounded-lg">
                      <span className="text-[11px] text-muted-foreground">Unit:</span>
                      <div className="flex gap-1">
                        {(['mm', 'in', 'px'] as RulerUnit[]).map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setRulerUnit(u)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer uppercase ${
                              rulerUnit === u
                                ? 'bg-indigo-600 text-white'
                                : 'text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Margins */}
                  <button
                    type="button"
                    onClick={() => setShowMarginGuides(!showMarginGuides)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="size-3.5 text-indigo-600" />
                      <span>Margin Bounds</span>
                    </span>
                    {showMarginGuides && <Check className="size-3.5 text-indigo-600" />}
                  </button>

                  {/* Center Axes */}
                  <button
                    type="button"
                    onClick={() => setShowCenterAxes(!showCenterAxes)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Crosshair className="size-3.5 text-rose-500" />
                      <span>Center Axes (50%)</span>
                    </span>
                    {showCenterAxes && <Check className="size-3.5 text-indigo-600" />}
                  </button>

                  {/* Section Outlines */}
                  <button
                    type="button"
                    onClick={() => setShowSectionOutlines(!showSectionOutlines)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="size-3.5 text-emerald-600" />
                      <span>Section Outlines</span>
                    </span>
                    {showSectionOutlines && <Check className="size-3.5 text-indigo-600" />}
                  </button>

                  {/* Grid */}
                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Grid className="size-3.5 text-indigo-600" />
                      <span>Drafting Grid (10mm)</span>
                    </span>
                    {showGrid && <Check className="size-3.5 text-indigo-600" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Zoom Control */}
          <ZoomControl zoom={zoom} onZoomChange={onZoomChange} />

          {/* Direct Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            title="Print or Save as PDF (Ctrl+P)"
          >
            <Printer className="size-3.5" />
            <span>Print / PDF</span>
          </button>

          {/* Refresh button if live updates paused */}
          {!livePreviewEnabled && onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-bold cursor-pointer shadow-2xs"
            >
              <RefreshCw className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Drafting Workspace with Canvas & Rulers ── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex items-start justify-center sidebar-scroll">
        <PaperCanvas
          template={template}
          company={company}
          previewLines={activeLines}
          zoom={zoom}
          showMarginGuides={showMarginGuides}
          showRulers={showRulers}
          rulerUnit={rulerUnit}
          onRulerUnitChange={setRulerUnit}
          showGrid={showGrid}
          showCenterAxes={showCenterAxes}
          showSectionOutlines={showSectionOutlines}
        />
      </div>

      {/* ── Bottom Dimension Status Bar ── */}
      <div className="px-4 py-1.5 bg-card border-t border-border/80 flex items-center justify-between text-[11px] font-mono text-muted-foreground shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-foreground">
            {template.paper.size} ({template.paper.orientation})
          </span>
          <span>
            {paperWidthMm} × {paperHeightMm} mm ({(paperWidthMm / 25.4).toFixed(2)}" × {(paperHeightMm / 25.4).toFixed(2)}")
          </span>
          <span className="hidden sm:inline">
            Margins: T:{template.margin.top}" B:{template.margin.bottom}" L:{template.margin.left}" R:{template.margin.right}"
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-muted text-foreground font-bold">
            Zoom: {zoom}%
          </span>
          <span className="hidden md:inline text-indigo-600 font-bold uppercase tracking-wider text-[10px]">
            Alignment View Active
          </span>
        </div>
      </div>
    </div>
  );
};
