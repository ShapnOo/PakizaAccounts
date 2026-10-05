import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const ZoomControl: React.FC<ZoomControlProps> = ({
  zoom,
  onZoomChange,
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 15, 150));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 15, 60));
  };

  const handleReset = () => {
    onZoomChange(100);
  };

  return (
    <div className="flex items-center gap-1 bg-card border border-border/80 rounded-lg p-0.5 shadow-2xs">
      <button
        type="button"
        onClick={handleZoomOut}
        disabled={zoom <= 60}
        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
        title="Zoom Out"
      >
        <ZoomOut className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="px-1.5 py-0.5 text-[11px] font-mono font-bold text-foreground hover:bg-muted rounded cursor-pointer"
        title="Reset Zoom to 100%"
      >
        {zoom}%
      </button>

      <button
        type="button"
        onClick={handleZoomIn}
        disabled={zoom >= 150}
        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
        title="Zoom In"
      >
        <ZoomIn className="size-3.5" />
      </button>
    </div>
  );
};
