import React, { useState, useEffect } from 'react';
import type {
  TemplateId,
  TemplateCustomization,
  VoucherPreviewData,
} from '../../types/voucherTemplate';
import { ZoomControl } from './ZoomControl';
import { TemplateRenderer } from '../voucher-templates/TemplateRenderer';
import { computePaperSize } from '../../lib/voucherPreviewMath';
import { Eye, Printer } from 'lucide-react';

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
    const timer = setTimeout(() => {
      setDebouncedCustom(customization);
    }, 80);
    return () => clearTimeout(timer);
  }, [customization]);

  const { widthPx, heightPx } = computePaperSize(
    debouncedCustom.paperSize,
    debouncedCustom.orientation
  );

  // Margins in inches converted to pixels (96 DPI / scale)
  const topMarginPx = debouncedCustom.margin.top * 96;
  const bottomMarginPx = debouncedCustom.margin.bottom * 96;
  const leftMarginPx = debouncedCustom.margin.left * 96;
  const rightMarginPx = debouncedCustom.margin.right * 96;

  const handlePrint = () => {
    window.print();
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
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
            ({debouncedCustom.paperSize} · {debouncedCustom.orientation})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ZoomControl zoom={zoom} onZoomChange={setZoom} />
          <button
            type="button"
            onClick={handlePrint}
            title="Print Preview Paper"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="size-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100/70 rounded-xl border border-slate-200/80 my-3 flex items-start justify-center min-h-[500px]">
        <div
          className="relative transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Paper Canvas */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white shadow-xl ring-1 ring-slate-200 relative transition-all"
            style={{
              width: `${widthPx}px`,
              minHeight: `${heightPx}px`,
              fontFamily: debouncedCustom.fontFamily || 'Inter',
            }}
          >
            {/* Hover Margin Guides */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none border border-dashed border-indigo-400/50 transition-opacity z-20"
                style={{
                  top: `${topMarginPx}px`,
                  bottom: `${bottomMarginPx}px`,
                  left: `${leftMarginPx}px`,
                  right: `${rightMarginPx}px`,
                }}
              />
            )}

            {/* Template Render Content */}
            <div
              className="w-full h-full"
              style={{
                paddingTop: `${topMarginPx}px`,
                paddingBottom: `${bottomMarginPx}px`,
                paddingLeft: `${leftMarginPx}px`,
                paddingRight: `${rightMarginPx}px`,
              }}
            >
              <TemplateRenderer
                templateId={templateId}
                data={previewData}
                custom={debouncedCustom}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="text-center text-[11px] text-slate-400">
        Preview uses sample data. Actual print uses the live voucher being printed.
      </div>
    </div>
  );
};

