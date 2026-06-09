import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BasicsForm } from './BasicsForm';
import { WorkForm } from './WorkForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificatesForm } from './CertificatesForm';
import { AwardsForm } from './AwardsForm';
import { SectionLayoutForm } from './SectionLayoutForm';
import { CareerTimeline } from '@/features/timeline/CareerTimeline';
import { User, Briefcase, GraduationCap, Code, FolderCode, LayoutGrid, Trophy } from 'lucide-react';

/**
 * EditorPanel aggregates all the resume section editor forms into a unified tabbed interface.
 */
export function EditorPanel() {
  const [activeTab, setActiveTab] = React.useState('basics');

  return (
    <div className="flex flex-col h-full bg-card border rounded-xl overflow-hidden shadow-xs">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Scrollable list of tabs */}
        <div className="border-b bg-muted/20 px-4 pt-2 shrink-0">
          <TabsList className="flex w-full justify-start overflow-x-auto gap-1 bg-transparent p-0 h-10 select-none no-scrollbar">
            <TabsTrigger
              value="basics"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <User className="size-3.5" />
              Basics
            </TabsTrigger>
            <TabsTrigger
              value="work"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <Briefcase className="size-3.5" />
              Experience
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <GraduationCap className="size-3.5" />
              Education
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <Code className="size-3.5" />
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <FolderCode className="size-3.5" />
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="extras"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <Trophy className="size-3.5" />
              Certs & Awards
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="data-[state=active]:bg-background data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all gap-1.5 cursor-pointer"
            >
              <LayoutGrid className="size-3.5" />
              Layout
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable content pane for forms */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="p-5 space-y-6">
              <TabsContent value="basics" className="outline-none m-0">
                <BasicsForm />
              </TabsContent>

              <TabsContent value="work" className="outline-none m-0 space-y-6">
                {/* Visual timeline integrated at the top of experience editing */}
                <CareerTimeline />
                <WorkForm />
              </TabsContent>

              <TabsContent value="education" className="outline-none m-0">
                <EducationForm />
              </TabsContent>

              <TabsContent value="skills" className="outline-none m-0">
                <SkillsForm />
              </TabsContent>

              <TabsContent value="projects" className="outline-none m-0">
                <ProjectsForm />
              </TabsContent>

              <TabsContent value="extras" className="outline-none m-0 space-y-6">
                <CertificatesForm />
                <AwardsForm />
              </TabsContent>

              <TabsContent value="layout" className="outline-none m-0">
                <SectionLayoutForm />
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}
