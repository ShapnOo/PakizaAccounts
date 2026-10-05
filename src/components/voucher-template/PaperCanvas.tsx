import React, { useState } from 'react';
import { VoucherTemplate } from '../../types/voucherTemplate';
import { getPaperDimensions, inchToPx } from '../../lib/paperMath';
import { MarginGuides } from './MarginGuides';
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
}

export const PaperCanvas: React.FC<PaperCanvasProps> = ({
  template,
  company,
  previewLines,
  zoom = 100,
  showMarginGuides = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative transition-all duration-150 mx-auto select-none"
      style={{
        width: `${dimensions.widthPx}px`,
        minHeight: `${dimensions.heightPx}px`,
        backgroundColor: template.font.backgroundColor || '#ffffff',
        color: template.font.color || '#0f172a',
        fontFamily: template.font.family || 'Inter, sans-serif',
        boxShadow:
          '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* ── Hover / Active Margin Guides Overlay ── */}
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
        className="flex flex-col justify-between h-full space-y-4"
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

          {/* 2. Main Line Items Table */}
          <PreviewTable
            columns={template.table.columns}
            columnOrder={columnOrder}
            showBorder={template.table.showBorder}
            fontSize={template.table.fontSize || template.font.size}
            textColor={template.font.color}
            previewLines={previewLines}
          />

          {/* 3. Totals Block */}
          <PreviewTotals
            totalDebit={15000}
            totalCredit={15000}
            fontSize={template.font.size}
            textColor={template.font.color}
          />

          {/* 4. Ruled Narration */}
          <PreviewNarration
            fontSize={template.font.size}
            textColor={template.font.color}
          />
        </div>

        {/* Bottom Section: Signatures & Footer Strip */}
        <div className="space-y-2 pt-6">
          {/* 5. Approval Signatures */}
          <PreviewSignatures
            visible={template.table.showApprovalSignature}
            fontSize={template.font.size}
            textColor={template.font.color}
          />

          {/* 6. Footer Meta Strip */}
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
  );
};
