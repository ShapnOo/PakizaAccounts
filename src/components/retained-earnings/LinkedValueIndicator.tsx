import React, { useState } from 'react';
import { Link2 } from 'lucide-react';

interface LinkedValueIndicatorProps {
  label: string;
  tooltipText: string;
  badgeText?: string;
  isHovered?: boolean;
}

export const LinkedValueIndicator: React.FC<LinkedValueIndicatorProps> = ({
  label,
  tooltipText,
  badgeText,
  isHovered = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5 select-none font-sans">
      <span className="text-xs text-slate-800">{label}</span>

      <div
        className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${
          isHovered
            ? 'text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded'
            : 'text-slate-400 hover:text-emerald-600'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Link2 className="size-3 shrink-0" />
        {badgeText && (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-1 py-0.2 bg-emerald-50 border border-emerald-200/70 text-emerald-700 rounded">
            {badgeText}
          </span>
        )}
      </div>

      {showTooltip && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-30 px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-sans font-medium shadow-md whitespace-nowrap pointer-events-none">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

