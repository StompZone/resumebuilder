import { Resume } from '@/domain/resume/types';
import { formatYearMonth } from '@/features/timeline/timelineUtils';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

/**
 * Props for the HtmlTemplateRenderer.
 */
interface HtmlTemplateRendererProps {
  resume: Resume;
  templateType: 'classic' | 'modern' | 'executive';
}

/**
 * Formats a profile url to a shorter name.
 */
function formatProfileUrl(url: string): string {
  if (!url) return '';
  return url.replace(/https?:\/\/(www\.)?/, '');
}

/**
 * HtmlTemplateRenderer renders a pixel-perfect, highly styled HTML preview of the resume
 * matching one of three layouts: ATS Classic, Modern Professional, or Executive/Senior.
 */
export function HtmlTemplateRenderer({ resume, templateType }: HtmlTemplateRendererProps) {
  const { basics, work, education, skills, projects, certificates, awards, sectionsOrder, sectionsMeta } = resume;

  // Render a section's contents by its ID
  const renderSectionContent = (sectionId: string) => {
    const meta = sectionsMeta[sectionId];
    if (!meta || !meta.visible) return null;

    switch (sectionId) {
      case 'work':
        if (work.length === 0) return null;
        return (
          <div className="space-y-4">
            {work.map((w) => (
              <div key={w.id} className="group">
                <div className="flex justify-between items-baseline font-semibold text-sm">
                  <span>
                    {w.position} <span className="font-normal text-muted-foreground">at</span> {w.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatYearMonth(w.startDate)} – {w.isCurrent ? 'Present' : formatYearMonth(w.endDate)}
                  </span>
                </div>
                {w.summary && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {w.summary}
                  </p>
                )}
                {w.highlights.length > 0 && (
                  <ul className="list-disc list-inside mt-1.5 space-y-1 pl-2">
                    {w.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed pl-1 -indent-3.5 ml-3">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div className="space-y-3">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between items-baseline text-sm">
                <div>
                  <span className="font-semibold">{e.institution}</span>
                  <span className="text-muted-foreground"> — {e.studyType} in {e.area}</span>
                  {e.score && <span className="text-xs text-muted-foreground block md:inline md:before:content-['•'] md:before:mx-2">GPA: {e.score}</span>}
                </div>
                <span className="text-xs text-muted-foreground font-medium shrink-0">
                  {formatYearMonth(e.startDate)} – {e.isCurrent ? 'Present' : formatYearMonth(e.endDate)}
                </span>
              </div>
            ))}
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div className="space-y-2">
            {skills.map((s) => (
              <div key={s.id} className="text-xs">
                <span className="font-semibold text-sm mr-2">{s.name}:</span>
                <span className="text-muted-foreground leading-relaxed">
                  {s.keywords.join(', ')}
                </span>
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline font-semibold text-sm">
                  <span>
                    {p.name}
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs font-normal text-primary ml-2 hover:underline">
                        Link
                      </a>
                    )}
                  </span>
                  {p.startDate && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatYearMonth(p.startDate)} – {p.isCurrent ? 'Present' : formatYearMonth(p.endDate)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {p.description}
                </p>
                {p.highlights && p.highlights.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5 pl-2">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed pl-1 -indent-3.5 ml-3">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'certificates':
        if (certificates.length === 0) return null;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {certificates.map((c) => (
              <div key={c.id} className="flex justify-between items-baseline border-b border-border/20 pb-1">
                <div>
                  <span className="font-semibold text-sm">{c.name}</span>
                  <span className="text-muted-foreground block text-[11px]">{c.issuer}</span>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{formatYearMonth(c.date)}</span>
              </div>
            ))}
          </div>
        );

      case 'awards':
        if (awards.length === 0) return null;
        return (
          <div className="space-y-2 text-xs">
            {awards.map((a) => (
              <div key={a.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-sm">{a.title}</span>
                  <span className="text-muted-foreground"> by {a.awarder}</span>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">{a.summary}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{formatYearMonth(a.date)}</span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // 1. ATS Classic Template (Serif, parser-friendly, high density)
  if (templateType === 'classic') {
    return (
      <div className="p-8 md:p-12 bg-white text-black font-serif shadow-md border rounded-md max-w-4xl mx-auto text-left leading-normal text-sm space-y-4">
        {/* Header Basics */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold uppercase tracking-wide">{basics.name}</h1>
          <p className="text-sm font-semibold tracking-wide italic">{basics.label}</p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-sans mt-2">
            {basics.email && <span className="flex items-center gap-1"><Mail className="size-3" />{basics.email}</span>}
            {basics.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{basics.phone}</span>}
            {basics.location?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {basics.location.city}, {basics.location.region}
              </span>
            )}
            {basics.url && <span className="flex items-center gap-1"><Globe className="size-3" />{formatProfileUrl(basics.url)}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {basics.summary && (
          <div className="text-xs leading-relaxed text-slate-800 border-t pt-3 mt-3">
            {basics.summary}
          </div>
        )}

        {/* Dynamic sections ordered and toggled */}
        {sectionsOrder
          .filter((id) => id !== 'basics')
          .map((sectionId) => {
            const meta = sectionsMeta[sectionId];
            if (!meta || !meta.visible) return null;
            const content = renderSectionContent(sectionId);
            if (!content) return null;

            return (
              <div key={sectionId} className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 mt-4 text-black font-sans">
                  {meta.title}
                </h3>
                {content}
              </div>
            );
          })}
      </div>
    );
  }

  // 2. Modern Professional Template (Sans-serif, elegant column margins, Slate color accents)
  if (templateType === 'modern') {
    return (
      <div className="p-8 md:p-12 bg-white text-slate-800 font-sans shadow-md border rounded-md max-w-4xl mx-auto text-left leading-relaxed text-sm space-y-6">
        {/* Header Basics */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b pb-5 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{basics.name}</h1>
            <p className="text-base font-medium text-primary uppercase tracking-wider">{basics.label}</p>
            {basics.summary && <p className="text-xs text-slate-600 mt-3 max-w-2xl">{basics.summary}</p>}
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-slate-500 shrink-0 font-medium md:text-right">
            {basics.email && <span className="flex md:justify-end items-center gap-1.5"><Mail className="size-3.5 text-primary" />{basics.email}</span>}
            {basics.phone && <span className="flex md:justify-end items-center gap-1.5"><Phone className="size-3.5 text-primary" />{basics.phone}</span>}
            {basics.location?.city && (
              <span className="flex md:justify-end items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                {basics.location.city}, {basics.location.region}
              </span>
            )}
            {basics.url && <span className="flex md:justify-end items-center gap-1.5"><Globe className="size-3.5 text-primary" />{formatProfileUrl(basics.url)}</span>}
          </div>
        </div>

        {/* Dynamic sections ordered and toggled */}
        <div className="space-y-5">
          {sectionsOrder
            .filter((id) => id !== 'basics')
            .map((sectionId) => {
              const meta = sectionsMeta[sectionId];
              if (!meta || !meta.visible) return null;
              const content = renderSectionContent(sectionId);
              if (!content) return null;

              return (
                <div key={sectionId} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                      {meta.title}
                    </h3>
                  </div>
                  <div className="md:col-span-9 border-l border-slate-100 pl-4 space-y-3">
                    {content}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // 3. Executive/Senior Template (Centered header, serif/sans-serif mix, elegant margins)
  return (
    <div className="p-8 md:p-12 bg-white text-stone-900 font-sans shadow-md border rounded-md max-w-4xl mx-auto text-left leading-normal text-sm space-y-6">
      {/* Header Basics */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-light font-serif tracking-wide text-stone-950 uppercase">{basics.name}</h1>
        <p className="text-xs font-bold tracking-widest text-amber-800 uppercase">{basics.label}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-stone-500 font-medium">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location?.city && <span>{basics.location.city}, {basics.location.region}</span>}
          {basics.url && <a href={basics.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-amber-800">{formatProfileUrl(basics.url)}</a>}
        </div>
      </div>

      {/* Professional Summary */}
      {basics.summary && (
        <div className="text-xs italic text-stone-600 border-y border-stone-200 py-3 text-center leading-relaxed">
          "{basics.summary}"
        </div>
      )}

      {/* Dynamic sections ordered and toggled */}
      <div className="space-y-6">
        {sectionsOrder
          .filter((id) => id !== 'basics')
          .map((sectionId) => {
            const meta = sectionsMeta[sectionId];
            if (!meta || !meta.visible) return null;
            const content = renderSectionContent(sectionId);
            if (!content) return null;

            return (
              <div key={sectionId} className="space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-900 font-serif shrink-0">
                    {meta.title}
                  </h3>
                  <div className="h-px bg-stone-200 flex-1" />
                </div>
                <div className="pt-1">
                  {content}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
