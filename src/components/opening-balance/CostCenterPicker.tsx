import React, { useState, useEffect } from 'react';
import { SimpleMasterOption } from '../../types/openingBalance';
import { listCostCenters } from '../../services/costCentersService';

interface CostCenterPickerProps {
  value?: string;
  onChange: (id: string) => void;
}

export const CostCenterPicker: React.FC<CostCenterPickerProps> = ({ value, onChange }) => {
  const [items, setItems] = useState<SimpleMasterOption[]>([]);

  useEffect(() => {
    let active = true;
    listCostCenters().then((data) => {
      if (active) setItems(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
    >
      <option value="">Select Cost Center...</option>
      {items.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} {c.code ? `(${c.code})` : ''}
        </option>
      ))}
    </select>
  );
};
