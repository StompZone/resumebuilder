import { useResumeStore } from '@/persistence/resumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Eye, EyeOff, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SectionLayoutForm provides visual customization for section names, section visibility, 
 * and control over the order of sections on the final resume.
 */
export function SectionLayoutForm() {
  const { resume, toggleSectionVisibility, updateSectionTitle, reorderSections } = useResumeStore();
  const { sectionsOrder, sectionsMeta } = resume;

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderSections(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < sectionsOrder.length - 1) reorderSections(index, index + 1);
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <LayoutGrid className="size-4.5 text-primary" />
          Section Layout & Titles
        </h2>
        <p className="text-xs text-muted-foreground">
          Customize the names of each section, toggle visibility, and adjust the order they appear on your resume.
        </p>
      </div>

      <div className="space-y-3">
        {sectionsOrder.map((sectionId, index) => {
          const meta = sectionsMeta[sectionId];
          if (!meta) return null;

          const isFirst = index === 0;
          const isLast = index === sectionsOrder.length - 1;

          // Don't allow toggling visibility or reordering basics, it always goes at the top!
          const isBasics = sectionId === 'basics';

          return (
            <Card
              key={sectionId}
              className={cn(
                "border shadow-2xs bg-card transition-all duration-200",
                !meta.visible && "opacity-60 bg-muted/30"
              )}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Status indicator */}
                  <div className="shrink-0">
                    {meta.visible ? (
                      <Eye className="size-4.5 text-primary" />
                    ) : (
                      <EyeOff className="size-4.5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-center">
                    <div>
                      <p className="text-xs font-semibold text-foreground capitalize">
                        Default: {sectionId}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {isBasics ? 'Mandatory header section' : 'Adjust label and position'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Input
                        value={meta.title}
                        onChange={(e) => updateSectionTitle(sectionId, e.target.value)}
                        disabled={!meta.visible}
                        placeholder={`Custom title for ${sectionId}`}
                        className="h-8 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Visibility toggle switch */}
                  {!isBasics && (
                    <div className="flex items-center gap-1.5 border-r pr-3">
                      <Switch
                        id={`vis-${sectionId}`}
                        checked={meta.visible}
                        onCheckedChange={() => toggleSectionVisibility(sectionId)}
                      />
                      <Label htmlFor={`vis-${sectionId}`} className="text-[10px] cursor-pointer text-muted-foreground font-normal">
                        {meta.visible ? 'Visible' : 'Hidden'}
                      </Label>
                    </div>
                  )}

                  {/* Ordering arrows */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveUp(index)}
                      disabled={isFirst || isBasics}
                      className="h-7 w-7 text-muted-foreground"
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveDown(index)}
                      disabled={isLast || isBasics || (index === 0 && sectionsOrder[1] === 'basics')}
                      className="h-7 w-7 text-muted-foreground"
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
