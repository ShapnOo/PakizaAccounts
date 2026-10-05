import React, { useState, useEffect } from 'react';
import { SimpleMasterOption } from '../../types/openingBalance';
import { listEmployees } from '../../services/employeesService';

interface EmployeePickerProps {
  value?: string;
  onChange: (id: string) => void;
}

export const EmployeePicker: React.FC<EmployeePickerProps> = ({ value, onChange }) => {
  const [items, setItems] = useState<SimpleMasterOption[]>([]);

  useEffect(() => {
    let active = true;
    listEmployees().then((data) => {
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
      <option value="">Select Employee...</option>
      {items.map((emp) => (
        <option key={emp.id} value={emp.id}>
          {emp.name} {emp.code ? `(${emp.code})` : ''}
        </option>
      ))}
    </select>
  );
};
