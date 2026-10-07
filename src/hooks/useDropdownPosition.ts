import { useState, useEffect, RefObject } from 'react';

interface DropdownPositionOptions {
  triggerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  minMenuHeight?: number;
}

export interface DropdownPositionResult {
  openUpward: boolean;
  maxHeight: number;
}

/**
 * Smart dropdown positioning hook.
 * Detects viewport collision: if space below the trigger element is insufficient
 * (e.g. near the bottom of the page/screen), it flips the dropdown to open upwards.
 */
export function useDropdownPosition({
  triggerRef,
  isOpen,
  minMenuHeight = 220,
}: DropdownPositionOptions): DropdownPositionResult {
  const [openUpward, setOpenUpward] = useState(false);
  const [maxHeight, setMaxHeight] = useState(240);

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
      setMaxHeight(Math.max(140, Math.min(320, availableSpace)));
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

  return { openUpward, maxHeight };
}
