import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Resume } from '@/domain/resume/types';
import { formatYearMonth } from '@/features/timeline/timelineUtils';

/**
 * PDF stylesheet configuration for Classic, Modern, and Executive designs.
 */
const styles = StyleSheet.create({
  // Global page settings
  page: {
    padding: 40,
    fontSize: 10,
    lineHeight: 1.4,
    color: '#1a1a1a',
  },
  
  // Section layout markers
  section: {
    marginBottom: 12,
  },
  
  // 1. Classic Serif styles
  classicTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 3,
  },
  classicSubtitle: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 6,
  },
  classicContactBar: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    color: '#4a4a4a',
    marginBottom: 10,
  },
  classicSummary: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    borderTop: '1px solid #000000',
    paddingTop: 8,
    marginBottom: 10,
  },
  classicSectionHeader: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1px solid #000000',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 8,
  },
  classicEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  classicEntryTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    fontWeight: 'bold',
  },
  classicEntryDate: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    color: '#333333',
  },
  classicBulletList: {
    marginTop: 2,
    paddingLeft: 10,
  },
  classicBullet: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    marginBottom: 2,
  },

  // 2. Modern Sans styles
  modernHeaderGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 12,
    marginBottom: 14,
  },
  modernTitleBlock: {
    maxWidth: '70%',
  },
  modernTitle: {
    fontFamily: 'Helvetica',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modernSubtitle: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#2563eb',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  modernContactBlock: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'right',
    gap: 3,
  },
  modernGridRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  modernLeftCol: {
    width: '25%',
  },
  modernRightCol: {
    width: '75%',
    borderLeft: '1px solid #f1f5f9',
    paddingLeft: 12,
  },
  modernSectionHeader: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#2563eb',
  },
  modernEntryTitle: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modernBullet: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },

  // 3. Executive styles
  execTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 22,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1c1917',
  },
  execSubtitle: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#78350f',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  execContactBar: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    color: '#78716c',
    marginBottom: 12,
  },
  execSummary: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    fontStyle: 'italic',
    textAlign: 'center',
    borderTop: '1px solid #d6d3d1',
    borderBottom: '1px solid #d6d3d1',
    paddingVertical: 6,
    marginBottom: 12,
    color: '#44403c',
  },
  execSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  execSectionHeader: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#78350f',
    marginRight: 10,
  },
  execHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e7e5e4',
  },
  execEntryTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  execBullet: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#44403c',
    marginBottom: 2,
  },
});

/**
 * Props for PdfResumeDocument component.
 */
interface PdfResumeDocumentProps {
  resume: Resume;
  templateType: 'classic' | 'modern' | 'executive';
}

/**
 * React PDF Document component that renders classical, modern, or executive styles.
 */
export function PdfResumeDocument({ resume, templateType }: PdfResumeDocumentProps) {
  const { basics, work, education, skills, projects, certificates, awards, sectionsOrder, sectionsMeta } = resume;

  // Render text element helper for bullet lists
  const renderHighlights = (highlights: string[], fontStyle: any) => {
    return (
      <View style={styles.classicBulletList}>
        {highlights.map((h, i) => (
          <Text key={i} style={fontStyle}>
            •  {h}
          </Text>
        ))}
      </View>
    );
  };

  const renderSection = (sectionId: string) => {
    const meta = sectionsMeta[sectionId];
    if (!meta || !meta.visible) return null;

    // Font selection based on template
    const titleFont = templateType === 'classic' ? styles.classicEntryTitle : (templateType === 'modern' ? styles.modernEntryTitle : styles.execEntryTitle);
    const bodyFont = templateType === 'classic' ? styles.classicBullet : (templateType === 'modern' ? styles.modernBullet : styles.execBullet);

    switch (sectionId) {
      case 'work':
        if (work.length === 0) return null;
        return (
          <View>
            {work.map((w) => (
              <View key={w.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={titleFont}>{w.position} – {w.name}</Text>
                  <Text style={styles.classicEntryDate}>
                    {formatYearMonth(w.startDate)} – {w.isCurrent ? 'Present' : formatYearMonth(w.endDate)}
                  </Text>
                </View>
                {w.summary ? <Text style={[bodyFont, { fontStyle: 'italic', marginBottom: 3 }]}>{w.summary}</Text> : null}
                {w.highlights.length > 0 ? renderHighlights(w.highlights, bodyFont) : null}
              </View>
            ))}
          </View>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <View style={{ gap: 6 }}>
            {education.map((e) => (
              <View key={e.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={bodyFont}>
                  <Text style={{ fontWeight: 'bold' }}>{e.institution}</Text> — {e.studyType} in {e.area} {e.score ? `(GPA: ${e.score})` : ''}
                </Text>
                <Text style={styles.classicEntryDate}>
                  {formatYearMonth(e.startDate)} – {e.isCurrent ? 'Present' : formatYearMonth(e.endDate)}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <View style={{ gap: 4 }}>
            {skills.map((s) => (
              <Text key={s.id} style={bodyFont}>
                <Text style={{ fontWeight: 'bold' }}>{s.name}:</Text> {s.keywords.join(', ')}
              </Text>
            ))}
          </View>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <View>
            {projects.map((p) => (
              <View key={p.id} style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 }}>
                  <Text style={titleFont}>{p.name} {p.url ? `(${p.url})` : ''}</Text>
                  {p.startDate ? (
                    <Text style={styles.classicEntryDate}>
                      {formatYearMonth(p.startDate)} – {p.isCurrent ? 'Present' : formatYearMonth(p.endDate)}
                    </Text>
                  ) : null}
                </View>
                {p.description ? <Text style={bodyFont}>{p.description}</Text> : null}
                {p.highlights.length > 0 ? renderHighlights(p.highlights, bodyFont) : null}
              </View>
            ))}
          </View>
        );

      case 'certificates':
        if (certificates.length === 0) return null;
        return (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {certificates.map((c) => (
              <View key={c.id} style={{ width: '48%', marginBottom: 4 }}>
                <Text style={bodyFont}>
                  <Text style={{ fontWeight: 'bold' }}>{c.name}</Text> ({c.issuer}) — {formatYearMonth(c.date)}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'awards':
        if (awards.length === 0) return null;
        return (
          <View style={{ gap: 6 }}>
            {awards.map((a) => (
              <View key={a.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ maxWidth: '80%' }}>
                  <Text style={bodyFont}>
                    <Text style={{ fontWeight: 'bold' }}>{a.title}</Text> ({a.awarder}) — {a.summary}
                  </Text>
                </View>
                <Text style={styles.classicEntryDate}>{formatYearMonth(a.date)}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  // 1. Classic Serif Template Layout
  const renderClassicLayout = () => (
    <Page size="LETTER" style={styles.page}>
      {/* Basics Info */}
      <View style={styles.section}>
        <Text style={styles.classicTitle}>{basics.name}</Text>
        <Text style={styles.classicSubtitle}>{basics.label}</Text>
        <View style={styles.classicContactBar}>
          {basics.email ? <Text>{basics.email}</Text> : null}
          {basics.phone ? <Text>{basics.phone}</Text> : null}
          {basics.location?.city ? <Text>{basics.location.city}, {basics.location.region}</Text> : null}
          {basics.url ? <Text>{basics.url.replace(/https?:\/\/(www\.)?/, '')}</Text> : null}
        </View>
        {basics.summary ? <Text style={styles.classicSummary}>{basics.summary}</Text> : null}
      </View>

      {/* Dynamic Sections */}
      {sectionsOrder
        .filter((id) => id !== 'basics')
        .map((sectionId) => {
          const meta = sectionsMeta[sectionId];
          if (!meta || !meta.visible) return null;
          const content = renderSection(sectionId);
          if (!content) return null;

          return (
            <View key={sectionId} style={styles.section}>
              <Text style={styles.classicSectionHeader}>{meta.title}</Text>
              {content}
            </View>
          );
        })}
    </Page>
  );

  // 2. Modern Sans Template Layout
  const renderModernLayout = () => (
    <Page size="LETTER" style={styles.page}>
      {/* Basics Info Header */}
      <View style={styles.modernHeaderGrid}>
        <View style={styles.modernTitleBlock}>
          <Text style={styles.modernTitle}>{basics.name}</Text>
          <Text style={styles.modernSubtitle}>{basics.label}</Text>
          {basics.summary ? <Text style={{ fontSize: 8.5, color: '#4a5568', marginTop: 6, lineHeight: 1.3 }}>{basics.summary}</Text> : null}
        </View>
        <View style={styles.modernContactBlock}>
          {basics.email ? <Text>{basics.email}</Text> : null}
          {basics.phone ? <Text>{basics.phone}</Text> : null}
          {basics.location?.city ? <Text>{basics.location.city}, {basics.location.region}</Text> : null}
          {basics.url ? <Text>{basics.url.replace(/https?:\/\/(www\.)?/, '')}</Text> : null}
        </View>
      </View>

      {/* Dynamic Grid Layout */}
      {sectionsOrder
        .filter((id) => id !== 'basics')
        .map((sectionId) => {
          const meta = sectionsMeta[sectionId];
          if (!meta || !meta.visible) return null;
          const content = renderSection(sectionId);
          if (!content) return null;

          return (
            <View key={sectionId} style={styles.modernGridRow}>
              <View style={styles.modernLeftCol}>
                <Text style={styles.modernSectionHeader}>{meta.title}</Text>
              </View>
              <View style={styles.modernRightCol}>
                {content}
              </View>
            </View>
          );
        })}
    </Page>
  );

  // 3. Executive Serif/Sans Template Layout
  const renderExecutiveLayout = () => (
    <Page size="LETTER" style={styles.page}>
      {/* Basics Header */}
      <View style={styles.section}>
        <Text style={styles.execTitle}>{basics.name}</Text>
        <Text style={styles.execSubtitle}>{basics.label}</Text>
        <View style={styles.execContactBar}>
          {basics.email ? <Text>{basics.email}</Text> : null}
          {basics.phone ? <Text>{basics.phone}</Text> : null}
          {basics.location?.city ? <Text>{basics.location.city}, {basics.location.region}</Text> : null}
          {basics.url ? <Text>{basics.url.replace(/https?:\/\/(www\.)?/, '')}</Text> : null}
        </View>
        {basics.summary ? <Text style={styles.execSummary}>{basics.summary}</Text> : null}
      </View>

      {/* Dynamic Sections */}
      {sectionsOrder
        .filter((id) => id !== 'basics')
        .map((sectionId) => {
          const meta = sectionsMeta[sectionId];
          if (!meta || !meta.visible) return null;
          const content = renderSection(sectionId);
          if (!content) return null;

          return (
            <View key={sectionId} style={styles.section}>
              <View style={styles.execSectionHeaderRow}>
                <Text style={styles.execSectionHeader}>{meta.title}</Text>
                <View style={styles.execHeaderLine} />
              </View>
              <View style={{ paddingTop: 2 }}>
                {content}
              </View>
            </View>
          );
        })}
    </Page>
  );

  if (templateType === 'classic') return renderClassicLayout();
  if (templateType === 'modern') return renderModernLayout();
  return renderExecutiveLayout();
}

/**
 * Core export function to compile the PDF document and download it in the browser.
 * 
 * @param resume The application resume state.
 * @param template The selected template type.
 */
export async function downloadPdfFile(resume: Resume, template: 'classic' | 'modern' | 'executive') {
  try {
    const doc = <Document><PdfResumeDocument resume={resume} templateType={template} /></Document>;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.basics.name.trim().replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate and download PDF', error);
  }
}
