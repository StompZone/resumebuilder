import * as React from 'react';
import { useResumeStore } from '@/persistence/resumeStore';
import {
  parseYearMonth,
  formatYearMonth,
  getDurationInMonths,
  formatDuration,
  analyzeTimeline,
} from './timelineUtils';
import { AlertTriangle, AlertCircle, Info, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * CareerTimeline displays a horizontal bar chart of the user's work experience.
 * Highlights duration, overlapping roles, gaps, and allows clicking blocks to edit.
 */
export function CareerTimeline() {
  const { resume, selectedWorkId, setSelectedWorkId } = useResumeStore();
  const { work } = resume;

  // Analyze timeline for gaps and overlaps
  const issues = React.useMemo(() => analyzeTimeline(work), [work]);

  // Compute the total time range of all jobs to scale the visual blocks
  const range = React.useMemo(() => {
    if (work.length === 0) return null;

    // Parse all dates to find global min and max
    const dates = work.map((w) => ({
      id: w.id,
      start: parseYearMonth(w.startDate),
      end: w.isCurrent || !w.endDate ? new Date() : parseYearMonth(w.endDate),
    }));

    let minDate = dates[0].start;
    let maxDate = dates[0].end;

    for (let i = 1; i < dates.length; i++) {
      if (dates[i].start < minDate) minDate = dates[i].start;
      if (dates[i].end > maxDate) maxDate = dates[i].end;
    }

    // Add 1 month to maxDate to make spans inclusive
    const totalMonths = Math.max(1, getDurationInMonths(
      minDate.toISOString().slice(0, 7),
      maxDate.toISOString().slice(0, 7)
    ));

    return { minDate, maxDate, totalMonths };
  }, [work]);

  if (work.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl bg-card text-muted-foreground">
        <Calendar className="size-8 mb-2 opacity-50" />
        <p className="text-sm">Add work experiences to see your interactive career timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Timeline Chart */}
      <div className="p-5 border rounded-xl bg-card shadow-xs">
        <h3 className="text-sm font-semibold mb-4 text-foreground flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          Interactive Career Timeline
        </h3>

        <div className="space-y-3 relative pt-2">
          {work.map((job) => {
            if (!range) return null;

            const jobStart = parseYearMonth(job.startDate);
            const jobDuration = getDurationInMonths(job.startDate, job.endDate, job.isCurrent);
            
            // Calculate starting percentage offset
            const startDiffMonths = Math.max(0, getDurationInMonths(
              range.minDate.toISOString().slice(0, 7),
              job.startDate
            ) - 1);
            
            const leftPct = (startDiffMonths / range.totalMonths) * 100;
            const widthPct = (jobDuration / range.totalMonths) * 100;

            const isSelected = selectedWorkId === job.id;

            return (
              <div key={job.id} className="relative h-10 w-full bg-muted/20 rounded-lg overflow-hidden group">
                <button
                  type="button"
                  onClick={() => setSelectedWorkId(job.id)}
                  style={{
                    left: `${Math.max(0, Math.min(leftPct, 95))}%`,
                    width: `${Math.max(5, Math.min(widthPct, 100))}%`,
                  }}
                  className={cn(
                    "absolute top-1 bottom-1 rounded-md px-3 flex flex-col justify-center text-left transition-all duration-200 cursor-pointer overflow-hidden",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 z-10"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary z-0"
                  )}
                >
                  <span className="text-xs font-semibold truncate block">
                    {job.position}
                  </span>
                  <span className="text-[10px] opacity-85 truncate block">
                    {job.name} • {formatDuration(jobDuration)}
                  </span>
                </button>
              </div>
            );
          })}

          {/* Timeline Date Grid Markers */}
          {range && (
            <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t border-border mt-4">
              <span>{formatYearMonth(range.minDate.toISOString().slice(0, 7))}</span>
              <span>{formatYearMonth(range.maxDate.toISOString().slice(0, 7))}</span>
            </div>
          )}
        </div>
        
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          * Click on any job block to expand and edit its details.
        </p>
      </div>

      {/* Timeline Warnings/Alerts */}
      {issues.length > 0 && (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Alert
              key={issue.id}
              variant={issue.type === 'overlap' ? 'destructive' : 'default'}
              className={cn(
                "border shadow-xs",
                issue.type === 'gap' && "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10 text-amber-800 dark:text-amber-300"
              )}
            >
              {issue.type === 'overlap' ? (
                <AlertTriangle className="size-4" />
              ) : (
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
              )}
              <AlertTitle className="font-semibold text-xs capitalize">
                Suspicious Timeline {issue.type}
              </AlertTitle>
              <AlertDescription className="text-xs opacity-90">
                {issue.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
