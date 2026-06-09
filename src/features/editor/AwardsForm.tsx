import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/persistence/resumeStore';
import { awardSchema } from '@/domain/resume/schemas';
import { Award } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { Trash, Plus, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Props for AwardItemEditor.
 */
interface AwardItemEditorProps {
  award: Award;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Sub-editor for a single award entry.
 */
function AwardItemEditor({
  award,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: AwardItemEditorProps) {
  const { updateAward } = useResumeStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<Award>({
    resolver: zodResolver(awardSchema),
    defaultValues: award,
    mode: 'onChange',
  });

  React.useEffect(() => {
    reset(award);
  }, [award, reset]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateAward(award.id, value as Partial<Award>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, award.id, updateAward]);

  return (
    <Card className="border shadow-2xs bg-card">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 w-full">
          <div className="space-y-1 md:col-span-4">
            <Label className="text-xs">Award Title</Label>
            <Input
              placeholder="e.g. Employee of the Month"
              className="h-9"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-[10px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-3">
            <Label className="text-xs">Awarder / Organization</Label>
            <Input
              placeholder="e.g. TechNovus Inc."
              className="h-9"
              {...register('awarder')}
            />
            {errors.awarder && (
              <p className="text-[10px] text-destructive">{errors.awarder.message}</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Date Received</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <MonthYearPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.date && (
              <p className="text-[10px] text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-3">
            <Label className="text-xs">Short Summary / Description</Label>
            <Input
              placeholder="e.g. Received for engineering leadership"
              className="h-9"
              {...register('summary')}
            />
            {errors.summary && (
              <p className="text-[10px] text-destructive">{errors.summary.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 self-stretch md:self-auto justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-9 w-9 text-muted-foreground"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-9 w-9 text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-9 w-9 text-destructive hover:bg-destructive/10"
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Awards list editor.
 */
export function AwardsForm() {
  const { resume, addAward, removeAward, updateResume } = useResumeStore();

  const handleAdd = () => {
    addAward({
      title: '',
      date: new Date().toISOString().slice(0, 7),
      awarder: '',
      summary: '',
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const nextAwards = Array.from(resume.awards);
      const [removed] = nextAwards.splice(index, 1);
      nextAwards.splice(index - 1, 0, removed);
      updateResume({ ...resume, awards: nextAwards });
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < resume.awards.length - 1) {
      const nextAwards = Array.from(resume.awards);
      const [removed] = nextAwards.splice(index, 1);
      nextAwards.splice(index + 1, 0, removed);
      updateResume({ ...resume, awards: nextAwards });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Awards & Honors</h2>
          <p className="text-xs text-muted-foreground">List scholarship, work recognition, hackathon wins, or key accomplishments.</p>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-1.5 h-9"
        >
          <Plus className="size-4" />
          Add Award
        </Button>
      </div>

      <div className="space-y-3">
        {resume.awards.map((award, index) => (
          <AwardItemEditor
            key={award.id}
            award={award}
            onRemove={() => removeAward(award.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === resume.awards.length - 1}
          />
        ))}

        {resume.awards.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No awards added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="size-3.5" />
              Add Award
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
