import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/persistence/resumeStore';
import { educationSchema } from '@/domain/resume/schemas';
import { Education } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { formatYearMonth } from '@/features/timeline/timelineUtils';
import { Trash, Plus, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the EducationItemEditor component.
 */
interface EducationItemEditorProps {
  edu: Education;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Sub-editor component for a single education entry.
 */
function EducationItemEditor({
  edu,
  isExpanded,
  onToggleExpand,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: EducationItemEditorProps) {
  const { updateEducation } = useResumeStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: edu,
    mode: 'onChange',
  });

  React.useEffect(() => {
    reset(edu);
  }, [edu, reset]);

  const isCurrent = watch('isCurrent');

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateEducation(edu.id, value as Partial<Education>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, edu.id, updateEducation]);

  return (
    <Card className={cn("border shadow-2xs overflow-hidden transition-all duration-250", isExpanded && "ring-1 ring-primary/20 bg-muted/5")}>
      <div
        onClick={onToggleExpand}
        className="p-4 flex items-center justify-between cursor-pointer select-none bg-card hover:bg-muted/10"
      >
        <div className="flex items-center gap-3 min-w-0">
          <GraduationCap className="size-4.5 text-primary shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate text-foreground">
              {edu.studyType ? `${edu.studyType} in ${edu.area || 'Field'}` : 'Untitled Degree'}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {edu.institution || 'Institution'} • {formatYearMonth(edu.startDate)} - {edu.isCurrent ? 'Present' : formatYearMonth(edu.endDate)}
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
              <Label className="text-xs">Institution</Label>
              <Input
                placeholder="e.g. University of California, Berkeley"
                className="h-9"
                {...register('institution')}
              />
              {errors.institution && (
                <p className="text-[10px] text-destructive">{errors.institution.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Degree / Certificate</Label>
              <Input
                placeholder="e.g. Bachelor of Science"
                className="h-9"
                {...register('studyType')}
              />
              {errors.studyType && (
                <p className="text-[10px] text-destructive">{errors.studyType.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Field of Study</Label>
              <Input
                placeholder="e.g. Computer Science"
                className="h-9"
                {...register('area')}
              />
              {errors.area && (
                <p className="text-[10px] text-destructive">{errors.area.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">GPA / Score (Optional)</Label>
              <Input
                placeholder="e.g. 3.8 / 4.0"
                className="h-9"
                {...register('score')}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Institution Website</Label>
              <Input
                placeholder="e.g. https://berkeley.edu"
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
                        id={`edu-current-${edu.id}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={`edu-current-${edu.id}`} className="text-[10px] cursor-pointer text-muted-foreground">Currently Enrolled</Label>
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
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Main Education list editor.
 */
export function EducationForm() {
  const {
    resume,
    addEducation,
    removeEducation,
    reorderEducation,
    selectedEducationId,
    setSelectedEducationId,
  } = useResumeStore();

  const handleAdd = () => {
    addEducation({
      institution: '',
      url: '',
      area: '',
      studyType: '',
      startDate: new Date().toISOString().slice(0, 7),
      isCurrent: false,
      score: '',
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderEducation(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < resume.education.length - 1) reorderEducation(index, index + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Education</h2>
          <p className="text-xs text-muted-foreground">List your academic achievements and degrees.</p>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-1.5 h-9"
        >
          <Plus className="size-4" />
          Add Education
        </Button>
      </div>

      <div className="space-y-3">
        {resume.education.map((edu, index) => (
          <EducationItemEditor
            key={edu.id}
            edu={edu}
            isExpanded={selectedEducationId === edu.id}
            onToggleExpand={() => setSelectedEducationId(selectedEducationId === edu.id ? null : edu.id)}
            onRemove={() => removeEducation(edu.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === resume.education.length - 1}
          />
        ))}

        {resume.education.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No education details added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="size-3.5" />
              Add Your Education
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
