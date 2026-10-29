import React from 'react';

interface LetterCodeChipProps {
  code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  className?: string;
}

export const LetterCodeChip: React.FC<LetterCodeChipProps> = ({ code, className = '' }) => {
  return (
    <span
      className={`size-5 rounded-md bg-indigo-600 text-white font-bold text-[11px] inline-flex items-center justify-center mr-2 shadow-xs shrink-0 select-none font-sans ${className}`}
      title={`Section Anchor Code (${code})`}
    >
      {code}
    </span>
  );
};
