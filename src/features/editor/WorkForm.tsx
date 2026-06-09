import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/persistence/resumeStore';
import { workSchema } from '@/domain/resume/schemas';
import { Work } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { formatYearMonth, getDurationInMonths, formatDuration } from '@/features/timeline/timelineUtils';
import { Trash, Plus, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for editing a single Work entry.
 */
interface WorkItemEditorProps {
  work: Work;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Sub-editor for a single work experience entry.
 */
function WorkItemEditor({
  work,
  isExpanded,
  onToggleExpand,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: WorkItemEditorProps) {
  const { updateWork } = useResumeStore();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Work>({
    resolver: zodResolver(workSchema),
    defaultValues: work,
    mode: 'onChange',
  });

  // Sync form values if the store state changes from outside
  React.useEffect(() => {
    reset(work);
  }, [work, reset]);

  // Watch for changes and sync to store
  const isCurrent = watch('isCurrent');
  const highlights = watch('highlights') ?? [];

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        // Safe check for highlights structure
        const nextHighlights = Array.isArray(value.highlights)
          ? value.highlights.filter((h): h is string => typeof h === 'string')
          : [];
        
        updateWork(work.id, {
          ...value,
          highlights: nextHighlights,
        } as Partial<Work>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, work.id, updateWork]);

  const durationStr = React.useMemo(() => {
    if (!work.startDate) return '';
    const months = getDurationInMonths(work.startDate, work.endDate, work.isCurrent);
    return formatDuration(months);
  }, [work.startDate, work.endDate, work.isCurrent]);

  return (
    <Card className={cn("border shadow-2xs overflow-hidden transition-all duration-250", isExpanded && "ring-1 ring-primary/20 bg-muted/5")}>
      <div
        onClick={onToggleExpand}
        className="p-4 flex items-center justify-between cursor-pointer select-none bg-card hover:bg-muted/10"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Briefcase className="size-4.5 text-primary shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate text-foreground">
              {work.position || 'Untitled Position'}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {work.name || 'Company Name'} • {formatYearMonth(work.startDate)} - {work.isCurrent ? 'Present' : formatYearMonth(work.endDate)} {durationStr && `(${durationStr})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-8 w-8 text-muted-foreground"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-8 w-8 text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="h-8 w-8"
          >
            <span className={cn("transition-transform duration-200 block", isExpanded && "rotate-180")}>
              <ChevronDown className="size-4" />
            </span>
          </Button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-4 pt-0 border-t border-border/40 space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Company Name</Label>
              <Input
                placeholder="e.g. Google"
                className="h-9"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Job Title / Position</Label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                className="h-9"
                {...register('position')}
              />
              {errors.position && (
                <p className="text-[10px] text-destructive">{errors.position.message}</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Company Website</Label>
              <Input
                placeholder="e.g. https://google.com"
                className="h-9"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-[10px] text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Start Date</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-[10px] text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">End Date</Label>
                <div className="flex items-center gap-1.5">
                  <Controller
                    control={control}
                    name="isCurrent"
                    render={({ field }) => (
                      <Switch
                        id={`current-${work.id}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={`current-${work.id}`} className="text-[10px] cursor-pointer text-muted-foreground">Current Role</Label>
                </div>
              </div>
              {!isCurrent && (
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <MonthYearPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.endDate && (
                <p className="text-[10px] text-destructive">{errors.endDate.message}</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Role Summary</Label>
              <Textarea
                placeholder="Briefly describe your responsibilities and context in this role..."
                rows={3}
                {...register('summary')}
              />
              {errors.summary && (
                <p className="text-[10px] text-destructive">{errors.summary.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Key Achievements / Highlights</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('highlights', [...highlights, ''], { shouldDirty: true, shouldValidate: true })}
                className="h-7 text-xs gap-1"
              >
                <Plus className="size-3" />
                Add Achievement
              </Button>
            </div>

            <div className="space-y-2">
              {highlights.map((_, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="e.g. Led migration of 14 core services to Node.js microservices."
                    className="h-9 flex-1 text-sm"
                    {...register(`highlights.${index}` as const)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setValue('highlights', highlights.filter((_, highlightIndex) => highlightIndex !== index), { shouldDirty: true, shouldValidate: true })}
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              ))}

              {highlights.length === 0 && (
                <p className="text-[11px] text-muted-foreground text-center py-2">
                  No achievements added yet. Bullet points make your achievements highly scannable for recruiters.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Main Work experience list builder section.
 */
export function WorkForm() {
  const {
    resume,
    addWork,
    removeWork,
    reorderWork,
    selectedWorkId,
    setSelectedWorkId,
  } = useResumeStore();

  const handleAdd = () => {
    addWork({
      name: '',
      position: '',
      url: '',
      startDate: new Date().toISOString().slice(0, 7),
      isCurrent: true,
      summary: '',
      highlights: [],
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderWork(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < resume.work.length - 1) reorderWork(index, index + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Work Experience</h2>
          <p className="text-xs text-muted-foreground">List your professional work history starting with the most recent.</p>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-1.5 h-9"
        >
          <Plus className="size-4" />
          Add Job
        </Button>
      </div>

      <div className="space-y-3">
        {resume.work.map((job, index) => (
          <WorkItemEditor
            key={job.id}
            work={job}
            isExpanded={selectedWorkId === job.id}
            onToggleExpand={() => setSelectedWorkId(selectedWorkId === job.id ? null : job.id)}
            onRemove={() => removeWork(job.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === resume.work.length - 1}
          />
        ))}

        {resume.work.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No work experience added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="size-3.5" />
              Add Your First Job
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
