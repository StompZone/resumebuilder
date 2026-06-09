import { EditorPanel } from '@/features/editor/EditorPanel';
import { PreviewPanel } from '@/features/preview/PreviewPanel';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FileDown, ShieldCheck } from 'lucide-react';

/**
 * Main App container component. Sets up the full split-pane viewport layout
 * for the resume editor and preview panels.
 */
function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b bg-card shadow-3xs shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground shadow-xs">
              <FileDown className="size-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-950">
                StompZone Resume Builder
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-0.5">
                <ShieldCheck className="size-3 text-emerald-500 shrink-0" />
                Polished PDF & DOCX Exports
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium hidden md:inline">
              Professional Resume Studio
            </span>
          </div>
        </header>

        {/* Workspace Split Pane */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
          <div className="flex-1 md:w-1/2 h-full overflow-hidden">
            <EditorPanel />
          </div>
          <div className="flex-1 md:w-1/2 h-full overflow-hidden">
            <PreviewPanel />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

export default App;
