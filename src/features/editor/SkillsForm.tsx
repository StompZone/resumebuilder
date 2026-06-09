import * as React from 'react';
import { useResumeStore } from '@/persistence/resumeStore';
import { Skill } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash, Plus, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Props for the SkillItemEditor.
 */
interface SkillItemEditorProps {
  skill: Skill;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Sub-editor for a single skill category.
 */
function SkillItemEditor({
  skill,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SkillItemEditorProps) {
  const { updateSkill } = useResumeStore();
  const [inputValue, setInputValue] = React.useState(() => 
    skill.keywords.join(', ')
  );

  React.useEffect(() => {
    const currentText = skill.keywords.join(', ');
    // Only set if textually different to prevent cursor jumps
    if (currentText !== inputValue && document.activeElement !== document.getElementById(`skills-input-${skill.id}`)) {
      setInputValue(currentText);
    }
  }, [skill.id, skill.keywords, inputValue]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSkill(skill.id, { name: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSkill(skill.id, { level: e.target.value });
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const keywords = val
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    updateSkill(skill.id, { keywords });
  };

  return (
    <Card className="border shadow-2xs bg-card">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 w-full">
          <div className="space-y-1 md:col-span-4">
            <Label className="text-xs">Category / Group Name</Label>
            <Input
              placeholder="e.g. Languages, Frameworks"
              className="h-9 font-medium"
              value={skill.name}
              onChange={handleNameChange}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Level (Optional)</Label>
            <Input
              placeholder="e.g. Advanced"
              className="h-9"
              value={skill.level || ''}
              onChange={handleLevelChange}
            />
          </div>

          <div className="space-y-1 md:col-span-6">
            <Label className="text-xs">Skills / Keywords (comma separated)</Label>
            <Input
              id={`skills-input-${skill.id}`}
              placeholder="e.g. React, TypeScript, Node.js"
              className="h-9"
              value={inputValue}
              onChange={handleKeywordsChange}
            />
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
 * Main Skills list editor component.
 */
export function SkillsForm() {
  const { resume, addSkill, removeSkill, reorderSkills } = useResumeStore();

  const handleAdd = () => {
    addSkill({
      name: '',
      keywords: [],
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderSkills(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < resume.skills.length - 1) reorderSkills(index, index + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Skills</h2>
          <p className="text-xs text-muted-foreground">Group your technical skills and list keywords for recruiter database matching (ATS).</p>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-1.5 h-9"
        >
          <Plus className="size-4" />
          Add Skill Group
        </Button>
      </div>

      <div className="space-y-3">
        {resume.skills.map((skill, index) => (
          <SkillItemEditor
            key={skill.id}
            skill={skill}
            onRemove={() => removeSkill(skill.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === resume.skills.length - 1}
          />
        ))}

        {resume.skills.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="size-3.5" />
              Add Your First Skill Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
