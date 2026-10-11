import { useState, useEffect, RefObject } from 'react';

interface DropdownPositionOptions {
  triggerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  minMenuHeight?: number;
}

export interface DropdownPositionResult {
  openUpward: boolean;
  maxHeight: number;
  coords: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
  };
}

/**
 * Smart dropdown positioning hook.
 * Detects viewport collision: if space below the trigger element is insufficient
 * (e.g. near the bottom of the page/screen), it flips the dropdown to open upwards.
 * Also returns accurate screen coordinates for React Portal rendering to avoid clipping.
 */
export function useDropdownPosition({
  triggerRef,
  isOpen,
  minMenuHeight = 220,
}: DropdownPositionOptions): DropdownPositionResult {
  const [openUpward, setOpenUpward] = useState(false);
  const [maxHeight, setMaxHeight] = useState(240);
  const [coords, setCoords] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
  });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const checkPosition = () => {
      const el = triggerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If space below is less than required menu height, and space above has more room, flip upward!
      const shouldOpenUp = spaceBelow < minMenuHeight && spaceAbove > spaceBelow;
      setOpenUpward(shouldOpenUp);

      const availableSpace = shouldOpenUp ? spaceAbove - 16 : spaceBelow - 16;
      setMaxHeight(Math.max(140, Math.min(340, availableSpace)));

      setCoords({
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
      });
    };

    checkPosition();

    // Recheck on scroll and window resize
    window.addEventListener('scroll', checkPosition, true);
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('scroll', checkPosition, true);
      window.removeEventListener('resize', checkPosition);
    };
  }, [isOpen, triggerRef, minMenuHeight]);

  return { openUpward, maxHeight, coords };
}
