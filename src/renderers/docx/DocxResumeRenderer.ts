import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from 'docx';
import { Resume } from '@/domain/resume/types';
import { formatYearMonth } from '@/features/timeline/timelineUtils';

/**
 * Helper to create a horizontal separator line paragraph in docx.
 * 
 * @returns Paragraph with a bottom border representing a line.
 */
function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    border: {
      bottom: {
        color: '333333',
        space: 4,
        style: BorderStyle.SINGLE,
        size: 8,
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        font: 'Arial',
        size: 20, // 10pt
        color: '1a365d', // Deep blue slate
      }),
    ],
  });
}

/**
 * Formats a profile URL for inclusion in the contact bar.
 */
function formatUrl(url: string): string {
  return url.replace(/https?:\/\/(www\.)?/, '');
}

/**
 * Builds and downloads a Microsoft Word (.docx) file matching the resume content.
 * Follows strict ATS-friendly guidelines (font choice, clean headers, standard bullets).
 * 
 * @param resume The application resume state.
 */
export async function downloadDocxFile(resume: Resume) {
  const { basics, work, education, skills, projects, certificates, awards, sectionsOrder, sectionsMeta } = resume;
  const children: Paragraph[] = [];

  // 1. Basics Info Section (Centered header style)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: basics.name,
          bold: true,
          font: 'Arial',
          size: 36, // 18pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: basics.label,
          bold: true,
          font: 'Arial',
          size: 24, // 12pt
          color: '4a5568',
        }),
      ],
    })
  );

  // Contact Info bar: Email | Phone | City, Region | URL
  const contactParts: string[] = [];
  if (basics.email) contactParts.push(basics.email);
  if (basics.phone) contactParts.push(basics.phone);
  if (basics.location?.city) contactParts.push(`${basics.location.city}, ${basics.location.region}`);
  if (basics.url) contactParts.push(formatUrl(basics.url));

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: contactParts.join('   |   '),
          font: 'Arial',
          size: 18, // 9pt
          color: '4a5568',
        }),
      ],
    })
  );

  // Professional Summary
  if (basics.summary) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: basics.summary,
            font: 'Arial',
            size: 20, // 10pt
          }),
        ],
      })
    );
  }

  // 2. Render sections in custom sectionsOrder
  for (const sectionId of sectionsOrder) {
    if (sectionId === 'basics') continue;

    const meta = sectionsMeta[sectionId];
    if (!meta || !meta.visible) continue;

    switch (sectionId) {
      case 'work':
        if (work.length === 0) break;
        children.push(createSectionHeader(meta.title));
        
        work.forEach((w) => {
          // Company and Position line
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 30 },
              children: [
                new TextRun({
                  text: `${w.position}   —   ${w.name}`,
                  bold: true,
                  font: 'Arial',
                  size: 20,
                }),
                new TextRun({
                  text: `\t${formatYearMonth(w.startDate)} – ${w.isCurrent ? 'Present' : formatYearMonth(w.endDate)}`,
                  font: 'Arial',
                  size: 18,
                  color: '4a5568',
                }),
              ],
              tabStops: [
                {
                  type: 'right',
                  position: 10000, // Flush right
                },
              ],
            })
          );

          // Summary
          if (w.summary) {
            children.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: w.summary,
                    font: 'Arial',
                    size: 18,
                    color: '2d3748',
                    italics: true,
                  }),
                ],
              })
            );
          }

          // Bullet highlights
          w.highlights.forEach((hl) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: hl,
                    font: 'Arial',
                    size: 18,
                  }),
                ],
              })
            );
          });
        });
        break;

      case 'education':
        if (education.length === 0) break;
        children.push(createSectionHeader(meta.title));

        education.forEach((e) => {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `${e.institution}   —   ${e.studyType} in ${e.area}`,
                  bold: true,
                  font: 'Arial',
                  size: 20,
                }),
                new TextRun({
                  text: `\t${formatYearMonth(e.startDate)} – ${e.isCurrent ? 'Present' : formatYearMonth(e.endDate)}`,
                  font: 'Arial',
                  size: 18,
                  color: '4a5568',
                }),
              ],
              tabStops: [
                {
                  type: 'right',
                  position: 10000,
                },
              ],
            })
          );

          if (e.score) {
            children.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: `GPA/Score: ${e.score}`,
                    font: 'Arial',
                    size: 18,
                    color: '4a5568',
                  }),
                ],
              })
            );
          }
        });
        break;

      case 'skills':
        if (skills.length === 0) break;
        children.push(createSectionHeader(meta.title));

        skills.forEach((s) => {
          children.push(
            new Paragraph({
              spacing: { before: 60, after: 40 },
              children: [
                new TextRun({
                  text: `${s.name}:  `,
                  bold: true,
                  font: 'Arial',
                  size: 19,
                }),
                new TextRun({
                  text: s.keywords.join(', '),
                  font: 'Arial',
                  size: 19,
                  color: '2d3748',
                }),
              ],
            })
          );
        });
        break;

      case 'projects':
        if (projects.length === 0) break;
        children.push(createSectionHeader(meta.title));

        projects.forEach((p) => {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: p.name,
                  bold: true,
                  font: 'Arial',
                  size: 20,
                }),
                new TextRun({
                  text: p.startDate ? `\t${formatYearMonth(p.startDate)} – ${p.isCurrent ? 'Present' : formatYearMonth(p.endDate)}` : '',
                  font: 'Arial',
                  size: 18,
                  color: '4a5568',
                }),
              ],
              tabStops: [
                {
                  type: 'right',
                  position: 10000,
                },
              ],
            })
          );

          if (p.description) {
            children.push(
              new Paragraph({
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: p.description,
                    font: 'Arial',
                    size: 18,
                    color: '2d3748',
                  }),
                ],
              })
            );
          }

          p.highlights.forEach((hl) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: hl,
                    font: 'Arial',
                    size: 18,
                  }),
                ],
              })
            );
          });
        });
        break;

      case 'certificates':
        if (certificates.length === 0) break;
        children.push(createSectionHeader(meta.title));

        certificates.forEach((c) => {
          children.push(
            new Paragraph({
              spacing: { before: 60, after: 40 },
              children: [
                new TextRun({
                  text: `${c.name} (${c.issuer})`,
                  bold: true,
                  font: 'Arial',
                  size: 19,
                }),
                new TextRun({
                  text: `\t${formatYearMonth(c.date)}`,
                  font: 'Arial',
                  size: 18,
                  color: '4a5568',
                }),
              ],
              tabStops: [
                {
                  type: 'right',
                  position: 10000,
                },
              ],
            })
          );
        });
        break;

      case 'awards':
        if (awards.length === 0) break;
        children.push(createSectionHeader(meta.title));

        awards.forEach((a) => {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `${a.title} by ${a.awarder}`,
                  bold: true,
                  font: 'Arial',
                  size: 19,
                }),
                new TextRun({
                  text: `\t${formatYearMonth(a.date)}`,
                  font: 'Arial',
                  size: 18,
                  color: '4a5568',
                }),
              ],
              tabStops: [
                {
                  type: 'right',
                  position: 10000,
                },
              ],
            })
          );

          if (a.summary) {
            children.push(
              new Paragraph({
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: a.summary,
                    font: 'Arial',
                    size: 18,
                    color: '2d3748',
                  }),
                ],
              })
            );
          }
        });
        break;
    }
  }

  // Create the Document structure
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: children,
      },
    ],
  });

  // Pack document to a blob and trigger browser download
  try {
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.basics.name.trim().replace(/\s+/g, '_')}_Resume.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate and download DOCX', error);
  }
}
