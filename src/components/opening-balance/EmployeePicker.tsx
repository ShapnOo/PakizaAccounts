import React, { useState, useEffect, useRef } from 'react';
import { SimpleMasterOption } from '../../types/openingBalance';
import { listEmployees } from '../../services/employeesService';
import { ChevronDown, Check, X, Search, Users } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface EmployeePickerProps {
  value?: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export const EmployeePicker: React.FC<EmployeePickerProps> = ({
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<SimpleMasterOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 220,
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    listEmployees().then((data) => {
      if (active) {
        setEmployees(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedEmployee = employees.find((e) => e.id === value);

  // Helper to format employee id badge / bracket text
  const getEmpCodeOrId = (emp: SimpleMasterOption) => emp.code || emp.id;

  // Filter items matching either name or id/code (or department/designation)
  const filtered = employees.filter((emp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const nameMatch = emp.name.toLowerCase().includes(q);
    const idMatch = emp.id.toLowerCase().includes(q);
    const codeMatch = emp.code ? emp.code.toLowerCase().includes(q) : false;
    const desigMatch = emp.designation ? emp.designation.toLowerCase().includes(q) : false;
    const deptMatch = emp.department ? emp.department.toLowerCase().includes(q) : false;
    return nameMatch || idMatch || codeMatch || desigMatch || deptMatch;
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-8 px-2.5 rounded-md border text-left text-xs font-semibold flex items-center justify-between gap-1.5 transition-all outline-none cursor-pointer ${
          disabled
            ? 'opacity-60 bg-muted cursor-not-allowed border-border'
            : error
            ? 'border-rose-400 bg-rose-50/20 text-rose-800'
            : isOpen
            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-background text-foreground'
            : 'border-border/80 bg-background text-foreground hover:border-foreground/40'
        }`}
      >
        <span className="truncate flex-1 flex items-center gap-1.5">
          {selectedEmployee ? (
            <span className="truncate font-medium text-foreground">
              {selectedEmployee.name}{' '}
              <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                ({getEmpCodeOrId(selectedEmployee)})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-normal">Select Employee...</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {selectedEmployee && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Clear employee"
              className="p-0.5 hover:text-foreground rounded cursor-pointer transition-colors"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 left-0 w-full min-w-[260px] max-w-[360px] bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          {/* Search Input Bar */}
          <div className="relative mb-1.5">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7 pl-8 pr-2.5 text-xs bg-muted/40 rounded-md border border-border/80 outline-none focus:ring-1 focus:ring-indigo-500 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto sidebar-scroll space-y-0.5">
            {loading ? (
              <div className="py-3 text-center text-xs text-muted-foreground">Loading employees...</div>
            ) : filtered.length === 0 ? (
              <div className="py-3 text-center text-xs text-muted-foreground">
                No employees found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filtered.map((emp) => {
                const isSelected = emp.id === value;
                const empIdDisplay = getEmpCodeOrId(emp);

                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      onChange(emp.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-md text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-medium text-slate-800 dark:text-foreground">
                          {emp.name}
                        </span>
                        <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1 py-0.2 rounded font-semibold border border-indigo-200/60 dark:border-indigo-800/40 shrink-0">
                          ({empIdDisplay})
                        </span>
                      </div>
                      {(emp.designation || emp.department) && (
                        <div className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
                          {[emp.designation, emp.department].filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="size-3.5 text-indigo-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
