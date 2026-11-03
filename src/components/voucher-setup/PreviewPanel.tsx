import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type {
  TemplateId,
  TemplateCustomization,
  VoucherPreviewData,
} from '../../types/voucherTemplate';
import { PAPER_SIZES_MM } from '../../types/voucherTemplate';
import { ZoomControl } from './ZoomControl';
import { TemplateRenderer } from '../voucher-templates/TemplateRenderer';
import { computePaperSize } from '../../lib/voucherPreviewMath';
import { Eye, Printer, Scissors } from 'lucide-react';

interface PreviewPanelProps {
  templateId: TemplateId;
  previewData: VoucherPreviewData;
  customization: TemplateCustomization;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  templateId,
  previewData,
  customization,
}) => {
  const [zoom, setZoom] = useState<number>(1.0);
  const [debouncedCustom, setDebouncedCustom] =
    useState<TemplateCustomization>(customization);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 80ms debounce on customization changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCustom(customization);
    }, 80);
    return () => clearTimeout(handler);
  }, [customization]);

  const isLandscape = debouncedCustom.orientation === 'Landscape';
  const paperInfo =
    PAPER_SIZES_MM[debouncedCustom.paperSize] || PAPER_SIZES_MM.A4;

  const isHalfPage = debouncedCustom.pageCoverage === 'half';
  const halfOption = debouncedCustom.halfPageOption || 'single';
  const showCutLine = debouncedCustom.showCutLine ?? true;

  // Exact physical print millimeter dimensions
  const pageWidthMm = isLandscape ? paperInfo.h : paperInfo.w;
  const pageHeightMm = isLandscape ? paperInfo.w : paperInfo.h;

  // Screen canvas pixel dimensions
  const { widthPx, heightPx } = computePaperSize(
    debouncedCustom.paperSize,
    debouncedCustom.orientation
  );

  const canvasPadding = isHalfPage
    ? '12px 14px'
    : isLandscape
    ? '16px 20px'
    : '20px 20px';

  const handlePrint = () => {
    document.body.classList.add('voucher-print-active');
    setTimeout(() => {
      window.print();
    }, 60);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-indigo-600" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            Live Preview
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            ({debouncedCustom.paperSize} · {debouncedCustom.orientation}
            {isHalfPage ? ' · Half Page' : ''})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ZoomControl zoom={zoom} onZoomChange={setZoom} />
          <button
            type="button"
            onClick={handlePrint}
            title={`Print Voucher in ${debouncedCustom.paperSize} ${debouncedCustom.orientation}${isHalfPage ? ' (Half Page)' : ''}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[12px] font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="size-3.5 text-indigo-600" />
            <span>
              Print {debouncedCustom.orientation}
              {isHalfPage ? (halfOption === 'duplicate' ? ' (2-in-1)' : ' (Half)') : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Screen Canvas Viewport */}
      <div className="flex-1 min-h-[480px] lg:max-h-[calc(100vh-130px)] overflow-auto p-4 sm:p-6 bg-slate-100/70 rounded-xl border border-slate-200/80 my-2.5 flex items-start justify-center">
        <div
          className="relative transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Paper Canvas for on-screen inspection */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white shadow-xl ring-1 ring-slate-200 relative transition-all box-border"
            style={{
              width: `${widthPx}px`,
              height: `${heightPx}px`,
              fontFamily: debouncedCustom.fontFamily || 'Inter',
              padding: canvasPadding,
              boxSizing: 'border-box',
            }}
          >
            {/* Hover Margin Guides */}
            {isHovered && (
              <div
                className="absolute pointer-events-none border border-dashed border-indigo-400/50 transition-opacity z-20"
                style={{ inset: canvasPadding }}
              />
            )}

            {/* Template Render Content */}
            {!isHalfPage ? (
              <div className="w-full h-full flex flex-col justify-between box-border">
                <TemplateRenderer
                  templateId={templateId}
                  data={previewData}
                  custom={debouncedCustom}
                />
              </div>
            ) : halfOption === 'duplicate' ? (
              /* Half Page: 2 Vouchers on 1 Sheet (2-in-1) */
              <div className="w-full h-full flex flex-col justify-between box-border">
                <div className="w-full h-[calc(50%-8px)] flex flex-col justify-between box-border">
                  <TemplateRenderer
                    templateId={templateId}
                    data={previewData}
                    custom={debouncedCustom}
                  />
                </div>

                {showCutLine && (
                  <div className="w-full py-1 flex items-center gap-2 select-none shrink-0">
                    <div className="flex-1 border-b border-dashed border-slate-300" />
                    <span className="text-[9.5px] text-slate-400 font-semibold flex items-center gap-1">
                      <Scissors className="size-3 text-slate-400" /> Cut along line
                    </span>
                    <div className="flex-1 border-b border-dashed border-slate-300" />
                  </div>
                )}

                <div className="w-full h-[calc(50%-8px)] flex flex-col justify-between box-border">
                  <TemplateRenderer
                    templateId={templateId}
                    data={previewData}
                    custom={debouncedCustom}
                  />
                </div>
              </div>
            ) : (
              /* Half Page: Single Copy (Top Half) */
              <div className="w-full h-full flex flex-col justify-between box-border">
                <div className="w-full h-[calc(50%-8px)] flex flex-col justify-between box-border">
                  <TemplateRenderer
                    templateId={templateId}
                    data={previewData}
                    custom={debouncedCustom}
                  />
                </div>

                {showCutLine && (
                  <div className="w-full py-1 flex items-center gap-2 select-none shrink-0">
                    <div className="flex-1 border-b border-dashed border-slate-300" />
                    <span className="text-[9.5px] text-slate-400 font-semibold flex items-center gap-1">
                      <Scissors className="size-3 text-slate-400" /> Half Page Cut Line
                    </span>
                    <div className="flex-1 border-b border-dashed border-slate-300" />
                  </div>
                )}

                <div className="w-full h-[calc(50%-8px)] rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 text-[11px] select-none gap-0.5">
                  <span className="font-semibold text-slate-400">Lower Half Sheet</span>
                  <span className="text-[10px] text-slate-400">
                    Blank for paper cutting or A5 feeding
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="text-center text-[11px] text-slate-400">
        Preview adjusts for <strong>{debouncedCustom.paperSize} ({debouncedCustom.orientation})</strong>
        {isHalfPage ? ' in Half Page format' : ''}. Click "Print" for 1-page output.
      </div>

      {/* ── Hidden Print Portal: Mounted directly to document.body for 1:1 single-page printing ── */}
      {createPortal(
        <div id="voucher-print-portal" className="hidden">
          {/* Exact @page size and orientation definition for browser print dialog */}
          <style>{`
            @media print {
              @page {
                size: ${pageWidthMm}mm ${pageHeightMm}mm;
                margin: 0;
              }
            }
          `}</style>
          <div
            className="voucher-print-sheet"
            style={{
              width: `${pageWidthMm}mm`,
              height: `${pageHeightMm}mm`,
              maxWidth: `${pageWidthMm}mm`,
              maxHeight: `${pageHeightMm}mm`,
              padding: isHalfPage ? '3mm 5mm' : isLandscape ? '4mm 6mm' : '5mm 6mm',
              boxSizing: 'border-box',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              color: debouncedCustom.primaryColor,
              fontFamily: debouncedCustom.fontFamily || 'Inter',
              fontSize: `${debouncedCustom.fontSize}pt`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {!isHalfPage ? (
              <div className="w-full h-full flex flex-col justify-between box-border">
                <TemplateRenderer
                  templateId={templateId}
                  data={previewData}
                  custom={debouncedCustom}
                />
              </div>
            ) : halfOption === 'duplicate' ? (
              <div className="w-full h-full flex flex-col justify-between box-border">
                {/* Top Voucher */}
                <div
                  style={{
                    height: showCutLine ? 'calc(50% - 3mm)' : '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}
                >
                  <TemplateRenderer
                    templateId={templateId}
                    data={previewData}
                    custom={debouncedCustom}
                  />
                </div>

                {/* Scissor Cut Line */}
                {showCutLine && (
                  <div
                    style={{
                      height: '6mm',
                      borderBottom: '1px dashed #94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8pt',
                      color: '#94a3b8',
                      boxSizing: 'border-box',
                    }}
                  >
                    ✄ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  </div>
                )}

                {/* Bottom Duplicate Voucher */}
                <div
                  style={{
                    height: showCutLine ? 'calc(50% - 3mm)' : '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}
                >
                  <TemplateRenderer
                    templateId={templateId}
                    data={previewData}
                    custom={debouncedCustom}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-between box-border">
                {/* Single Top Half Voucher */}
                <div
                  style={{
                    height: showCutLine ? 'calc(50% - 3mm)' : '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}
                >
                  <TemplateRenderer
                    templateId={templateId}
                    data={previewData}
                    custom={debouncedCustom}
                  />
                </div>

                {showCutLine && (
                  <div
                    style={{
                      height: '6mm',
                      borderBottom: '1px dashed #94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8pt',
                      color: '#94a3b8',
                      boxSizing: 'border-box',
                    }}
                  >
                    ✄ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  </div>
                )}

                {/* Blank lower half */}
                <div style={{ height: 'calc(50% - 3mm)' }} />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
