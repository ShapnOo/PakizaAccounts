import React from 'react';

interface ZoomControlProps {
  zoom: number; // 0.75, 1.0, 1.25
  onZoomChange: (z: number) => void;
}

export const ZoomControl: React.FC<ZoomControlProps> = ({ zoom, onZoomChange }) => {
  const zoomOptions = [0.75, 1.0, 1.25];

  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 shadow-2xs">
      {zoomOptions.map((z) => {
        const isActive = zoom === z;
        return (
          <button
            key={z}
            type="button"
            onClick={() => onZoomChange(z)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {Math.round(z * 100)}%
          </button>
        );
      })}
    </div>
  );
};

