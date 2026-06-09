import * as React from 'react';
import { useResumeStore, ResumeTemplateType } from '@/persistence/resumeStore';
import { HtmlTemplateRenderer } from '@/templates/HtmlTemplateRenderer';
import { downloadPdfFile } from '@/renderers/pdf/PdfResumeRenderer';
import { downloadDocxFile } from '@/renderers/docx/DocxResumeRenderer';
import { exportToJSONResume, importFromJSONResume } from '@/renderers/json/jsonResumeConverter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Download,
  Upload,
  FileCode,
  RotateCcw,
  Sparkles,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PreviewPanel manages the right-side of the application, rendering the real-time preview,
 * template selectors, and export/import operations for PDF, DOCX, and JSON formats.
 */
export function PreviewPanel() {
  const { resume, template, setTemplate, updateResume, resetResume, loadSampleData } = useResumeStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Trigger download of app-native JSON
  const handleExportNativeJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.basics.name.trim().replace(/\s+/g, '_')}_resume_native.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  // Trigger download of standard JSON Resume schema format
  const handleExportJsonResume = () => {
    const jsonResume = exportToJSONResume(resume);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonResume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.basics.name.trim().replace(/\s+/g, '_')}_jsonresume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  // Handles importing a JSON file (either app-native or JSON Resume schema)
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === 'string') {
          const parsed = JSON.parse(text);
          
          // Check if it is native or standard JSON Resume
          if (parsed.basics && (Array.isArray(parsed.work) || parsed.sectionsOrder)) {
            let nextResume;
            if (parsed.sectionsOrder && parsed.sectionsMeta) {
              // App Native format
              nextResume = parsed;
            } else {
              // Standard JSON Resume format
              nextResume = importFromJSONResume(parsed, resume);
            }
            updateResume(nextResume);
            alert('Resume imported successfully!');
          } else {
            alert('Invalid file format. Please upload a valid JSON Resume or App Native file.');
          }
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse the JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be uploaded again
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border rounded-xl overflow-hidden shadow-xs">
      {/* Top Header Actions */}
      <div className="border-b bg-card p-4 space-y-4 shrink-0 shadow-2xs">
        {/* Template Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Layers className="size-4.5 text-primary" />
            <span className="text-sm font-semibold">Templates</span>
          </div>

          <div className="flex bg-muted p-1 rounded-lg gap-1 select-none">
            {(['classic', 'modern', 'executive'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize cursor-pointer",
                  template === t
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-wrap gap-2 justify-between items-center border-t pt-3">
          {/* Main Downloads */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => downloadPdfFile(resume, template)}
              className="h-8.5 text-xs font-medium gap-1.5 shadow-xs"
            >
              <Download className="size-3.5" />
              Export PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadDocxFile(resume)}
              className="h-8.5 text-xs font-medium gap-1.5"
            >
              <FileText className="size-3.5 text-blue-600" />
              Export Word (DOCX)
            </Button>
          </div>

          {/* Import / Extras */}
          <div className="flex gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleExportJsonResume}
              title="Export to JSON Resume compatible format"
              className="h-8.5 text-[11px] gap-1 px-2.5 text-slate-600 hover:text-slate-900"
            >
              <FileCode className="size-3.5" />
              JSON Resume
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleExportNativeJson}
              title="Export App Native JSON configuration"
              className="h-8.5 text-[11px] gap-1 px-2.5 text-slate-600 hover:text-slate-900"
            >
              <FileSpreadsheet className="size-3.5" />
              Native JSON
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Import JSON Resume or Native JSON"
              className="h-8.5 text-[11px] gap-1 px-2.5 text-slate-600 hover:text-slate-900"
            >
              <Upload className="size-3.5" />
              Import
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Demo data management */}
        <div className="flex justify-between items-center border-t pt-3 text-[10px]">
          <span className="text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3 text-amber-500 animate-pulse" />
            Autosaved locally
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadSampleData}
              className="text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <RotateCcw className="size-2.5" />
              Load Sample Data
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to clear all resume content?')) {
                  resetResume();
                }
              }}
              className="text-destructive hover:underline font-semibold cursor-pointer"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>

      {/* Sheet Preview Container */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-md border border-slate-200/80">
          <HtmlTemplateRenderer resume={resume} templateType={template} />
        </div>
      </div>
    </div>
  );
}
