import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

/**
 * Props for the MonthYearPicker component.
 */
interface MonthYearPickerProps {
  value?: string; // Format: YYYY-MM
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * List of months with their numeric string value and full label.
 */
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

/**
 * MonthYearPicker provides a clean twin-dropdown select interface for months and years.
 * This is standard and preferred for resume builder date selection instead of day calendars.
 */
export function MonthYearPicker({ value, onChange, disabled }: MonthYearPickerProps) {
  const [year, month] = React.useMemo(() => {
    if (!value) return ['', ''];
    const parts = value.split('-');
    if (parts.length === 2) {
      return [parts[0], parts[1]];
    }
    return ['', ''];
  }, [value]);

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result: string[] = [];
    for (let y = currentYear + 5; y >= 1970; y--) {
      result.push(y.toString());
    }
    return result;
  }, []);

  const handleMonthChange = (newMonth: string) => {
    const activeYear = year || new Date().getFullYear().toString();
    onChange(`${activeYear}-${newMonth}`);
  };

  const handleYearChange = (newYear: string) => {
    const activeMonth = month || '01';
    onChange(`${newYear}-${activeMonth}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={month}
        onValueChange={handleMonthChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year}
        onValueChange={handleYearChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
