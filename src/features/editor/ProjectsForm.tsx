import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/persistence/resumeStore';
import { projectSchema } from '@/domain/resume/schemas';
import { Project } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { formatYearMonth } from '@/features/timeline/timelineUtils';
import { Trash, Plus, ChevronDown, ChevronUp, FolderCode } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for ProjectItemEditor.
 */
interface ProjectItemEditorProps {
  project: Project;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Editor form sub-component for a single project.
 */
function ProjectItemEditor({
  project,
  isExpanded,
  onToggleExpand,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ProjectItemEditorProps) {
  const { updateProject } = useResumeStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: project,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray<Project>({
    control,
    name: 'highlights',
  });

  React.useEffect(() => {
    reset(project);
  }, [project, reset]);

  const isCurrent = watch('isCurrent');
  const keywordsValue = watch('keywords') || [];
  const [kwInput, setKwInput] = React.useState(() => keywordsValue.join(', '));

  React.useEffect(() => {
    if (Array.isArray(keywordsValue)) {
      const text = keywordsValue.join(', ');
      if (text !== kwInput && document.activeElement !== document.getElementById(`proj-kw-${project.id}`)) {
        setKwInput(text);
      }
    }
  }, [keywordsValue]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateProject(project.id, {
          ...value,
          highlights: Array.isArray(value.highlights) ? value.highlights.filter(Boolean) : [],
        } as Partial<Project>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, project.id, updateProject]);

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKwInput(val);
    const keywords = val
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    updateProject(project.id, { keywords });
  };

  return (
    <Card className={cn("border shadow-2xs overflow-hidden transition-all duration-250", isExpanded && "ring-1 ring-primary/20 bg-muted/5")}>
      <div
        onClick={onToggleExpand}
        className="p-4 flex items-center justify-between cursor-pointer select-none bg-card hover:bg-muted/10"
      >
        <div className="flex items-center gap-3 min-w-0">
          <FolderCode className="size-4.5 text-primary shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate text-foreground">
              {project.name || 'Untitled Project'}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {project.startDate ? `${formatYearMonth(project.startDate)} - ${project.isCurrent ? 'Present' : formatYearMonth(project.endDate)}` : 'No dates set'}
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
              <Label className="text-xs">Project Name</Label>
              <Input
                placeholder="e.g. OpenResume Engine"
                className="h-9"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Project URL (e.g., GitHub, live link)</Label>
              <Input
                placeholder="e.g. https://github.com/..."
                className="h-9"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-[10px] text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Start Date (Optional)</Label>
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">End Date (Optional)</Label>
                <div className="flex items-center gap-1.5">
                  <Controller
                    control={control}
                    name="isCurrent"
                    render={({ field }) => (
                      <Switch
                        id={`proj-current-${project.id}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={`proj-current-${project.id}`} className="text-[10px] cursor-pointer text-muted-foreground">Ongoing Project</Label>
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
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Technologies Used (comma separated)</Label>
              <Input
                id={`proj-kw-${project.id}`}
                placeholder="e.g. React, Python, Docker"
                className="h-9"
                value={kwInput}
                onChange={handleKeywordsChange}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Short Description</Label>
              <Textarea
                placeholder="Describe the core purpose and functionality of the project..."
                rows={2}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Key Achievements / Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append('')}
                className="h-7 text-xs gap-1"
              >
                <Plus className="size-3" />
                Add Bullet
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="e.g. Shipped a serverless REST API processing 1k requests/min."
                    className="h-9 flex-1 text-sm"
                    {...register(`highlights.${index}` as any)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Main Projects list editor.
 */
export function ProjectsForm() {
  const {
    resume,
    addProject,
    removeProject,
    reorderProjects,
    selectedProjectId,
    setSelectedProjectId,
  } = useResumeStore();

  const handleAdd = () => {
    addProject({
      name: '',
      description: '',
      highlights: [],
      keywords: [],
      startDate: new Date().toISOString().slice(0, 7),
      isCurrent: false,
      url: '',
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderProjects(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < resume.projects.length - 1) reorderProjects(index, index + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Projects</h2>
          <p className="text-xs text-muted-foreground">List key personal or professional software/hardware projects.</p>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-1.5 h-9"
        >
          <Plus className="size-4" />
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {resume.projects.map((project, index) => (
          <ProjectItemEditor
            key={project.id}
            project={project}
            isExpanded={selectedProjectId === project.id}
            onToggleExpand={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
            onRemove={() => removeProject(project.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === resume.projects.length - 1}
          />
        ))}

        {resume.projects.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No projects added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="size-3.5" />
              Add Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
