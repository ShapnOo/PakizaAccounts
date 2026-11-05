import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DualDateRangePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: 'left' | 'right';
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate years range e.g. 2015 to 2035
const START_YEAR = 2015;
const END_YEAR = 2035;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

const pad = (n: number) => n.toString().padStart(2, '0');

export function formatToMMDDYYYY(d: Date): string {
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

export function parseDateString(str: string): Date | null {
  if (!str) return null;
  const cleaned = str.trim();

  // Match MM/DD/YYYY or DD/MM/YYYY or YYYY-MM-DD
  const m1 = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m1) {
    const p1 = parseInt(m1[1], 10);
    const p2 = parseInt(m1[2], 10);
    const yr = parseInt(m1[3], 10);
    if (p1 > 12) {
      // p1 is day, p2 is month
      return new Date(yr, p2 - 1, p1);
    }
    if (p2 > 12) {
      // p1 is month, p2 is day
      return new Date(yr, p1 - 1, p2);
    }
    // Default to MM/DD/YYYY as per screenshot 09/27/2016
    return new Date(yr, p1 - 1, p2);
  }

  const m2 = cleaned.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (m2) {
    return new Date(parseInt(m2[1], 10), parseInt(m2[2], 10) - 1, parseInt(m2[3], 10));
  }

  const parsed = new Date(cleaned);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function parseRange(rangeStr: string): { start: Date | null; end: Date | null } {
  if (!rangeStr) return { start: null, end: null };
  const parts = rangeStr.split(/\s*-\s*|\s+to\s+/i);
  if (parts.length >= 2) {
    const start = parseDateString(parts[0]);
    const end = parseDateString(parts[1]);
    return { start, end };
  } else if (parts.length === 1) {
    const single = parseDateString(parts[0]);
    return { start: single, end: single };
  }
  return { start: null, end: null };
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isBetween(target: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t > s && t < e;
}

export const DualDateRangePicker: React.FC<DualDateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'MM/DD/YYYY - MM/DD/YYYY',
  disabled = false,
  className = '',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal input value when prop value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Parsed initial dates
  const parsedDates = useMemo(() => parseRange(inputValue), [inputValue]);

  const [startDate, setStartDate] = useState<Date | null>(parsedDates.start);
  const [endDate, setEndDate] = useState<Date | null>(parsedDates.end);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Month navigation: Left calendar month & year
  const defaultBaseDate = parsedDates.start || new Date();
  const [leftYear, setLeftYear] = useState(defaultBaseDate.getFullYear());
  const [leftMonth, setLeftMonth] = useState(defaultBaseDate.getMonth());

  // Right calendar month & year is always 1 month after left
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;

  // Sync state when value changes
  useEffect(() => {
    const parsed = parseRange(value);
    setStartDate(parsed.start);
    setEndDate(parsed.end);
    if (parsed.start) {
      setLeftYear(parsed.start.getFullYear());
      setLeftMonth(parsed.start.getMonth());
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear((y) => y - 1);
    } else {
      setLeftMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear((y) => y + 1);
    } else {
      setLeftMonth((m) => m + 1);
    }
  };

  const handleMonthSelect = (newMonth: number, isLeft: boolean) => {
    if (isLeft) {
      setLeftMonth(newMonth);
    } else {
      setLeftMonth(newMonth === 0 ? 11 : newMonth - 1);
      if (newMonth === 0) setLeftYear((y) => y - 1);
    }
  };

  const handleYearSelect = (newYear: number, isLeft: boolean) => {
    if (isLeft) {
      setLeftYear(newYear);
    } else {
      setLeftYear(rightMonth === 0 ? newYear - 1 : newYear);
    }
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      let finalStart = startDate;
      let finalEnd = date;
      if (date < startDate) {
        finalStart = date;
        finalEnd = startDate;
      }
      setStartDate(finalStart);
      setEndDate(finalEnd);
      const formatted = `${formatToMMDDYYYY(finalStart)} - ${formatToMMDDYYYY(finalEnd)}`;
      setInputValue(formatted);
      onChange(formatted);
    }
  };

  const handleDone = () => {
    if (startDate && endDate) {
      const formatted = `${formatToMMDDYYYY(startDate)} - ${formatToMMDDYYYY(endDate)}`;
      setInputValue(formatted);
      onChange(formatted);
    } else if (startDate) {
      const formatted = `${formatToMMDDYYYY(startDate)} - ${formatToMMDDYYYY(startDate)}`;
      setInputValue(formatted);
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setLeftYear(today.getFullYear());
    setLeftMonth(today.getMonth());
    const formatted = `${formatToMMDDYYYY(today)} - ${formatToMMDDYYYY(today)}`;
    setInputValue(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setInputValue('');
    onChange('');
    setIsOpen(false);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);
    const parsed = parseRange(val);
    if (parsed.start) {
      setStartDate(parsed.start);
      setEndDate(parsed.end);
      setLeftYear(parsed.start.getFullYear());
      setLeftMonth(parsed.start.getMonth());
    }
  };

  // Helper to generate 42 calendar grid cells for a given month/year
  const getDaysArray = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean; dayOfWeek: number }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      cells.push({
        date: d,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const d = new Date(year, month, day);
      cells.push({
        date: d,
        isCurrentMonth: true,
        dayOfWeek: d.getDay(),
      });
    }

    // Next month filler days (fill up to 42 cells)
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      cells.push({
        date: d,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
      });
    }

    return cells;
  };

  const leftDays = useMemo(() => getDaysArray(leftYear, leftMonth), [leftYear, leftMonth]);
  const rightDays = useMemo(() => getDaysArray(rightYear, rightMonth), [rightYear, rightMonth]);

  const activeEnd =
    endDate || (startDate && hoverDate && hoverDate >= startDate ? hoverDate : null);
  const today = useMemo(() => new Date(), []);

  const renderMonthCalendar = (
    year: number,
    month: number,
    days: { date: Date; isCurrentMonth: boolean; dayOfWeek: number }[],
    isLeft: boolean
  ) => {
    return (
      <div className="w-[250px] p-2 select-none">
        {/* Month & Year header */}
        <div className="flex items-center justify-between gap-1 mb-2">
          {isLeft ? (
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="size-4" />
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Month & Year Selectable Dropdowns ("alada kore month and date pick kora jabe") */}
          <div className="flex items-center gap-1">
            <select
              value={month}
              onChange={(e) => handleMonthSelect(parseInt(e.target.value, 10), isLeft)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer outline-none transition"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => handleYearSelect(parseInt(e.target.value, 10), isLeft)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer outline-none transition"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {!isLeft ? (
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-500 mb-1">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 text-center text-xs">
          {days.map((item, idx) => {
            const isStart = isSameDay(item.date, startDate);
            const isEnd = isSameDay(item.date, activeEnd);
            const inRange = isBetween(item.date, startDate, activeEnd);
            const isTodayDate = isSameDay(item.date, today);
            const isWeekend = item.dayOfWeek === 0 || item.dayOfWeek === 6;

            let textClass = 'text-slate-700';
            if (!item.isCurrentMonth) {
              textClass = 'text-slate-300';
            } else if (isWeekend) {
              textClass = 'text-[#0284c7] font-semibold';
            }

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoverDate(item.date)}
                onClick={() => handleDateClick(item.date)}
                className={`py-1.5 my-0.5 text-xs font-medium cursor-pointer transition-colors relative ${inRange ? 'bg-[#bbf7d0] text-slate-900' : ''
                  } ${isStart
                    ? 'bg-[#16a34a] text-white font-bold rounded-l-md z-10 shadow-xs'
                    : ''
                  } ${isEnd
                    ? 'bg-[#16a34a] text-white font-bold rounded-r-md z-10 shadow-xs'
                    : ''
                  } ${isStart && isEnd ? 'rounded-md' : ''
                  } ${!isStart && !isEnd && !inRange
                    ? `${textClass} hover:bg-slate-100 rounded-md`
                    : ''
                  } ${isTodayDate && !isStart && !isEnd && !inRange
                    ? 'border border-[#16a34a] rounded-md font-bold'
                    : ''
                  }`}
              >
                {item.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
      {/* Input box trigger */}
      <div
        className={`flex items-center justify-between border ${isOpen ? 'border-[#0284c7] ring-1 ring-[#0284c7]/30' : 'border-slate-300 hover:border-slate-400'
          } rounded-md bg-white px-2 py-1 h-8.5 shadow-2xs transition-all relative ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
          }`}
      >
        <input
          type="text"
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(true)}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleDone();
            }
          }}
          className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none cursor-pointer placeholder:text-slate-400"
        />

        {/* Sky-blue calendar icon badge matching screenshot */}
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setIsOpen(!isOpen);
          }}
          className="ml-1.5 size-6 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition"
          title="Open dual calendar date range picker"
        >
          <Calendar className="size-3.5" />
        </button>
      </div>

      {/* Popover Dual-Month Calendar */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2.5 z-50 bg-white border border-slate-300 rounded-lg shadow-xl p-3 font-sans w-[540px] animate-in fade-in-50 zoom-in-95 duration-100 ${align === 'right' ? 'right-0' : 'left-0'
            }`}
        >
          {/* Arrow indicator at top pointing to trigger */}
          <div
            className={`absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-slate-300 transform rotate-45 ${align === 'right' ? 'right-6' : 'left-6'
              }`}
          />

          {/* Dual calendars side-by-side */}
          <div className="flex divide-x divide-slate-100">
            {renderMonthCalendar(leftYear, leftMonth, leftDays, true)}
            {renderMonthCalendar(rightYear, rightMonth, rightDays, false)}
          </div>

          {/* Action Footer matching screenshot */}
          <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between px-2">
            <div className="w-16" />

            {/* Center Done button */}
            <button
              type="button"
              onClick={handleDone}
              className="px-8 py-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Done
            </button>

            {/* Right Today & Clear links */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <button
                type="button"
                onClick={handleToday}
                className="hover:text-indigo-600 hover:underline transition cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-rose-600 hover:underline transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
