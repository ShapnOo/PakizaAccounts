import React, { useState, useEffect } from 'react';
import { SubledgerEntry } from '../../types/subledger';
import { listSubledger } from '../../services/subledgerService';

interface ReferenceCenterPickerProps {
  value?: string;
  onChange: (val: string) => void;
}

export const ReferenceCenterPicker: React.FC<ReferenceCenterPickerProps> = ({
  value,
  onChange,
}) => {
  const [items, setItems] = useState<SubledgerEntry[]>([]);

  useEffect(() => {
    let active = true;
    listSubledger('reference-center').then((data) => {
      if (active) {
        setItems(data.filter((d) => d.activeStatus === 'Active'));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const hasCurrentInList = Boolean(value && items.some((it) => it.name === value || it.id === value));

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
    >
      <option value="">Select Reference Center...</option>
      {value && !hasCurrentInList && (
        <option value={value}>
          {value}
        </option>
      )}
      {items.map((rc) => (
        <option key={rc.id} value={rc.name}>
          {rc.name}
        </option>
      ))}
    </select>
  );
};
