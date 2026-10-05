import React, { useState, useRef } from 'react';
import { VoucherTemplate } from '../../types/voucherTemplate';
import { getPaperDimensions, inchToPx } from '../../lib/paperMath';
import { MarginGuides } from './MarginGuides';
import { AlignmentOverlay } from './AlignmentOverlay';
import { RulerBar, RulerUnit } from './RulerBar';
import { PreviewHeader } from './PreviewHeader';
import { PreviewTable } from './PreviewTable';
import { PreviewTotals } from './PreviewTotals';
import { PreviewNarration } from './PreviewNarration';
import { PreviewSignatures } from './PreviewSignatures';
import { PreviewFooterStrip } from './PreviewFooterStrip';

interface PaperCanvasProps {
  template: VoucherTemplate;
  company: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    website: string;
  };
  previewLines: any[];
  zoom: number; // e.g. 100
  showMarginGuides?: boolean;
  showRulers?: boolean;
  rulerUnit?: RulerUnit;
  onRulerUnitChange?: (unit: RulerUnit) => void;
  showGrid?: boolean;
  showCenterAxes?: boolean;
  showSectionOutlines?: boolean;
  showColumnGuides?: boolean;
}

export const PaperCanvas: React.FC<PaperCanvasProps> = ({
  template,
  company,
  previewLines,
  zoom = 100,
  showMarginGuides = false,
  showRulers = true,
  rulerUnit = 'mm',
  onRulerUnitChange = () => {},
  showGrid = false,
  showCenterAxes = false,
  showSectionOutlines = false,
  showColumnGuides = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const scale = zoom / 100;
  const dimensions = getPaperDimensions(
    template.paper.size,
    template.paper.orientation,
    scale,
    template.paper.customWidthMm,
    template.paper.customHeightMm
  );

  // Margins in px (1 inch = 96px scaled)
  const topPad = inchToPx(template.margin.top, scale);
  const bottomPad = inchToPx(template.margin.bottom, scale);
  const leftPad = inchToPx(template.margin.left, scale);
  const rightPad = inchToPx(template.margin.right, scale);

  const columnOrder =
    template.table.columnOrder && template.table.columnOrder.length > 0
      ? template.table.columnOrder
      : Object.keys(template.table.columns);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorPos(null);
  };

  const RULER_OFFSET = showRulers ? 22 : 0;

  return (
    <div
      className="relative flex flex-col items-center justify-center p-4"
      style={{
        paddingTop: `${RULER_OFFSET + 16}px`,
        paddingLeft: `${RULER_OFFSET + 16}px`,
      }}
    >
      {/* ── Precision Rulers (Top & Left) ── */}
      {showRulers && (
        <RulerBar
          unit={rulerUnit}
          onUnitChange={onRulerUnitChange}
          widthPx={dimensions.widthPx}
          heightPx={dimensions.heightPx}
          widthMm={dimensions.widthMm}
          heightMm={dimensions.heightMm}
          scale={scale}
          marginTopInch={template.margin.top}
          marginBottomInch={template.margin.bottom}
          marginLeftInch={template.margin.left}
          marginRightInch={template.margin.right}
          cursorX={cursorPos?.x}
          cursorY={cursorPos?.y}
        />
      )}

      {/* ── Main Printable Paper Sheet Canvas ── */}
      <div
        ref={canvasRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative transition-all duration-150 select-none shadow-xl rounded-xs ring-1 ring-black/5 dark:ring-white/10"
        style={{
          width: `${dimensions.widthPx}px`,
          minHeight: `${dimensions.heightPx}px`,
          backgroundColor: template.font.backgroundColor || '#ffffff',
          color: template.font.color || '#0f172a',
          fontFamily: template.font.family || 'Inter, sans-serif',
        }}
      >
        {/* ── Alignment Overlay (Grid, Center Crosshairs, Coordinates) ── */}
        <AlignmentOverlay
          widthPx={dimensions.widthPx}
          heightPx={dimensions.heightPx}
          widthMm={dimensions.widthMm}
          heightMm={dimensions.heightMm}
          scale={scale}
          showGrid={showGrid}
          showCenterAxes={showCenterAxes}
          showSectionOutlines={showSectionOutlines}
          showColumnGuides={showColumnGuides}
          unit={rulerUnit}
          cursorX={cursorPos?.x}
          cursorY={cursorPos?.y}
        />

        {/* ── Margin Guides Overlay ── */}
        <MarginGuides
          topInch={template.margin.top}
          bottomInch={template.margin.bottom}
          leftInch={template.margin.left}
          rightInch={template.margin.right}
          scale={scale}
          visible={isHovered || showMarginGuides}
        />

        {/* ── Actual Printable Voucher Content with Margins Applied ── */}
        <div
          className="flex flex-col justify-between h-full space-y-4 relative z-10"
          style={{
            paddingTop: `${topPad}px`,
            paddingBottom: `${bottomPad}px`,
            paddingLeft: `${leftPad}px`,
            paddingRight: `${rightPad}px`,
            fontSize: `${template.font.size}px`,
          }}
        >
          <div className="space-y-4">
            {/* 1. Header (Company Info & Document Title) */}
            <div
              className={`transition-all rounded-xs ${
                showSectionOutlines
                  ? 'ring-1 ring-indigo-500/50 p-1 relative group/sec'
                  : ''
              }`}
            >
              {showSectionOutlines && (
                <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-1 rounded shadow-2xs border border-indigo-200">
                  Header Section ({template.header.align} Aligned)
                </span>
              )}
              <PreviewHeader
                company={company}
                voucherType={template.voucherType}
                variant={template.variant}
                companyNameSize={template.header.companyNameSize}
                addressSize={template.header.addressSize}
                align={template.header.align}
                showLogo={template.header.showLogo ?? true}
                logoUrl={template.header.logoUrl || (company as any)?.logoUrl || '/company_logo.png'}
                logoWidth={template.header.logoWidth ?? 70}
                logoPosition={template.header.logoPosition ?? 'left'}
                baseFontSize={template.font.size}
                textColor={template.font.color}
              />
            </div>

            {/* 2. Main Line Items Table */}
            <div
              className={`transition-all rounded-xs ${
                showSectionOutlines
                  ? 'ring-1 ring-emerald-500/50 p-1 relative'
                  : ''
              }`}
            >
              {showSectionOutlines && (
                <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 rounded shadow-2xs border border-emerald-200">
                  Data Table ({columnOrder.filter(k => template.table.columns[k]?.visible).length} Columns)
                </span>
              )}
              <PreviewTable
                columns={template.table.columns}
                columnOrder={columnOrder}
                showBorder={template.table.showBorder}
                fontSize={template.table.fontSize || template.font.size}
                textColor={template.font.color}
                previewLines={previewLines}
              />
            </div>

            {/* 3. Totals Block */}
            <div
              className={`transition-all rounded-xs ${
                showSectionOutlines
                  ? 'ring-1 ring-amber-500/50 p-1 relative'
                  : ''
              }`}
            >
              {showSectionOutlines && (
                <span className="absolute -top-3 right-1 text-[8px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1 rounded shadow-2xs border border-amber-200">
                  Totals Summary
                </span>
              )}
              <PreviewTotals
                totalDebit={15000}
                totalCredit={15000}
                fontSize={template.font.size}
                textColor={template.font.color}
              />
            </div>

            {/* 4. Ruled Narration */}
            <div
              className={`transition-all rounded-xs ${
                showSectionOutlines
                  ? 'ring-1 ring-purple-500/50 p-1 relative'
                  : ''
              }`}
            >
              {showSectionOutlines && (
                <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-1 rounded shadow-2xs border border-purple-200">
                  Narration Lines
                </span>
              )}
              <PreviewNarration
                fontSize={template.font.size}
                textColor={template.font.color}
              />
            </div>
          </div>

          {/* Bottom Section: Signatures & Footer Strip */}
          <div className="space-y-2 pt-6">
            {/* 5. Approval Signatures */}
            <div
              className={`transition-all rounded-xs ${
                showSectionOutlines && template.table.showApprovalSignature
                  ? 'ring-1 ring-rose-500/50 p-1 relative'
                  : ''
              }`}
            >
              {showSectionOutlines && template.table.showApprovalSignature && (
                <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1 rounded shadow-2xs border border-rose-200">
                  Signatory Grid (4 Columns)
                </span>
              )}
              <PreviewSignatures
                visible={template.table.showApprovalSignature}
                fontSize={template.font.size}
                textColor={template.font.color}
              />
            </div>

            {/* 6. Footer Meta Strip */}
            <div
              className={`transition-all rounded-xs ${
                showSectionOutlines
                  ? 'ring-1 ring-slate-500/50 p-1 relative'
                  : ''
              }`}
            >
              {showSectionOutlines && (
                <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-1 rounded shadow-2xs border border-slate-300">
                  Footer Metadata
                </span>
              )}
              <PreviewFooterStrip
                showPrintDateTime={template.footer.showPrintDateTime}
                showPageNumber={template.footer.showPageNumber}
                footerName={template.footer.name || company.website}
                fontSize={template.font.size}
                textColor={template.font.color}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
