import { Work } from '@/domain/resume/types';
import { differenceInMonths, parse, format, addMonths } from 'date-fns';

/**
 * Parses a YYYY-MM string into a Date object.
 * Falls back to current date if parsing fails.
 * 
 * @param dateStr Date string in YYYY-MM format.
 * @returns Parsed Date object.
 */
export function parseYearMonth(dateStr: string): Date {
  try {
    if (!dateStr) return new Date();
    return parse(dateStr, 'yyyy-MM', new Date());
  } catch {
    return new Date();
  }
}

/**
 * Formats a YYYY-MM date string into a user-friendly month/year display.
 * E.g., "2023-03" -> "Mar 2023".
 * 
 * @param dateStr Date string in YYYY-MM format.
 * @param isCurrent Whether the role is current.
 * @returns Formatted date string, or "Present" if current.
 */
export function formatYearMonth(dateStr?: string, isCurrent?: boolean): string {
  if (isCurrent) return 'Present';
  if (!dateStr) return '';
  try {
    const date = parseYearMonth(dateStr);
    return format(date, 'MMM yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Calculates the number of months between a start and end date string.
 * If no end date is provided or the role is current, the current month is used.
 * 
 * @param startDate Start date in YYYY-MM format.
 * @param endDate Optional end date in YYYY-MM format.
 * @param isCurrent Whether the role is current.
 * @returns Total duration in months (minimum 1).
 */
export function getDurationInMonths(startDate: string, endDate?: string, isCurrent?: boolean): number {
  if (!startDate) return 0;
  const start = parseYearMonth(startDate);
  const end = isCurrent || !endDate ? new Date() : parseYearMonth(endDate);
  
  // Add 1 month to represent inclusive months (e.g. June to June is 1 month)
  const diff = differenceInMonths(end, start) + 1;
  return Math.max(1, diff);
}

/**
 * Formats a duration in months to a readable year/month string.
 * E.g. 14 -> "1 yr 2 mos", 12 -> "1 yr", 5 -> "5 mos".
 * 
 * @param totalMonths Duration in months.
 * @returns Formatted duration string.
 */
export function formatDuration(totalMonths: number): string {
  if (totalMonths <= 0) return '';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  }

  return parts.join(' ');
}

/**
 * Analysis issue structure.
 */
export interface TimelineIssue {
  id: string;
  type: 'gap' | 'overlap';
  message: string;
  itemIds: string[];
}

/**
 * Analyzes work experience entries to detect gaps greater than 2 months or date overlaps.
 * 
 * @param work List of work experiences.
 * @returns Array of timeline issues (gaps and overlaps).
 */
export function analyzeTimeline(work: Work[]): TimelineIssue[] {
  if (work.length < 2) return [];

  // Sort work experiences by start date ascending
  const sortedWork = [...work].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const issues: TimelineIssue[] = [];

  for (let i = 0; i < sortedWork.length - 1; i++) {
    const current = sortedWork[i];
    const next = sortedWork[i + 1];

    const currentEndStr = current.isCurrent || !current.endDate ? format(new Date(), 'yyyy-MM') : current.endDate;
    const currentEnd = parseYearMonth(currentEndStr);
    
    // We add 1 month to currentEnd to check consecutive months (e.g., end 2023-02 and start 2023-03 have no gap)
    const consecutiveStart = addMonths(currentEnd, 1);
    const nextStart = parseYearMonth(next.startDate);

    // Difference in months between next job start and current job end + 1 month
    const gapMonths = differenceInMonths(nextStart, consecutiveStart);

    if (gapMonths > 1) {
      // Gap detected (more than 1 full month gap between positions)
      issues.push({
        id: `gap-${current.id}-${next.id}`,
        type: 'gap',
        message: `There is a gap of ${formatDuration(gapMonths)} between "${current.name}" and "${next.name}".`,
        itemIds: [current.id, next.id],
      });
    } else if (nextStart < currentEnd) {
      // Overlap detected (next job starts before current job ends)
      const overlapMonths = differenceInMonths(currentEnd, nextStart) + 1;
      issues.push({
        id: `overlap-${current.id}-${next.id}`,
        type: 'overlap',
        message: `"${current.name}" and "${next.name}" overlap by ${formatDuration(overlapMonths)}.`,
        itemIds: [current.id, next.id],
      });
    }
  }

  return issues;
}
