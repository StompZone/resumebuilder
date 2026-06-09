import { Resume } from '@/domain/resume/types';

/**
 * Converts the application's Resume state to a standard JSON Resume document.
 * Removes internal fields like React list IDs.
 * 
 * @param resume The application resume state.
 * @returns A standard JSON Resume schema object.
 */
export function exportToJSONResume(resume: Resume): Record<string, any> {
  const cleanBasics = {
    name: resume.basics.name,
    label: resume.basics.label,
    image: resume.basics.image || undefined,
    email: resume.basics.email,
    phone: resume.basics.phone,
    url: resume.basics.url || undefined,
    summary: resume.basics.summary,
    location: {
      address: resume.basics.location.address || undefined,
      postalCode: resume.basics.location.postalCode || undefined,
      city: resume.basics.location.city,
      region: resume.basics.location.region,
      countryCode: resume.basics.location.countryCode || undefined,
    },
    profiles: resume.basics.profiles.map(p => ({
      network: p.network,
      username: p.username,
      url: p.url || undefined,
    })),
  };

  const cleanWork = resume.work.map(w => ({
    name: w.name,
    position: w.position,
    url: w.url || undefined,
    startDate: w.startDate,
    endDate: w.isCurrent ? undefined : w.endDate,
    summary: w.summary,
    highlights: w.highlights,
  }));

  const cleanEducation = resume.education.map(e => ({
    institution: e.institution,
    url: e.url || undefined,
    area: e.area,
    studyType: e.studyType,
    startDate: e.startDate,
    endDate: e.isCurrent ? undefined : e.endDate,
    score: e.score || undefined,
  }));

  const cleanSkills = resume.skills.map(s => ({
    name: s.name,
    level: s.level || undefined,
    keywords: s.keywords,
  }));

  const cleanProjects = resume.projects.map(p => ({
    name: p.name,
    description: p.description,
    highlights: p.highlights,
    keywords: p.keywords,
    startDate: p.startDate || undefined,
    endDate: p.isCurrent ? undefined : p.endDate,
    url: p.url || undefined,
  }));

  const cleanCertificates = resume.certificates.map(c => ({
    name: c.name,
    date: c.date,
    issuer: c.issuer,
    url: c.url || undefined,
  }));

  const cleanAwards = resume.awards.map(a => ({
    title: a.title,
    date: a.date,
    awarder: a.awarder,
    summary: a.summary,
  }));

  return {
    basics: cleanBasics,
    work: cleanWork,
    education: cleanEducation,
    skills: cleanSkills,
    projects: cleanProjects,
    certificates: cleanCertificates,
    awards: cleanAwards,
  };
}

/**
 * Parses and converts a standard JSON Resume document to the application's Resume state.
 * Generates unique IDs for lists and sets default sections metadata if not present.
 * 
 * @param json The standard JSON Resume parsed object.
 * @param existingResume Optional current state to preserve layout orders.
 * @returns A fully validated application Resume object.
 */
export function importFromJSONResume(json: any, existingResume?: Resume): Resume {
  const b = json?.basics || {};
  const loc = b.location || {};
  
  const basics: Resume['basics'] = {
    name: b.name || '',
    label: b.label || '',
    image: b.image || '',
    email: b.email || '',
    phone: b.phone || '',
    url: b.url || '',
    summary: b.summary || '',
    location: {
      address: loc.address || '',
      postalCode: loc.postalCode || '',
      city: loc.city || '',
      region: loc.region || '',
      countryCode: loc.countryCode || '',
    },
    profiles: Array.isArray(b.profiles)
      ? b.profiles.map((p: any) => ({
          network: p.network || '',
          username: p.username || '',
          url: p.url || '',
        }))
      : [],
  };

  const work: Resume['work'] = Array.isArray(json?.work)
    ? json.work.map((w: any, idx: number) => ({
        id: `work-${Date.now()}-${idx}`,
        name: w.name || w.company || '',
        position: w.position || '',
        url: w.url || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
        isCurrent: !w.endDate,
        summary: w.summary || '',
        highlights: Array.isArray(w.highlights) ? w.highlights : [],
      }))
    : [];

  const education: Resume['education'] = Array.isArray(json?.education)
    ? json.education.map((e: any, idx: number) => ({
        id: `edu-${Date.now()}-${idx}`,
        institution: e.institution || '',
        url: e.url || '',
        area: e.area || '',
        studyType: e.studyType || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        isCurrent: !e.endDate,
        score: e.score || '',
      }))
    : [];

  const skills: Resume['skills'] = Array.isArray(json?.skills)
    ? json.skills.map((s: any, idx: number) => ({
        id: `skill-${Date.now()}-${idx}`,
        name: s.name || '',
        level: s.level || '',
        keywords: Array.isArray(s.keywords) ? s.keywords : [],
      }))
    : [];

  const projects: Resume['projects'] = Array.isArray(json?.projects)
    ? json.projects.map((p: any, idx: number) => ({
        id: `proj-${Date.now()}-${idx}`,
        name: p.name || '',
        description: p.description || '',
        highlights: Array.isArray(p.highlights) ? p.highlights : [],
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        startDate: p.startDate || '',
        endDate: p.endDate || '',
        isCurrent: !p.endDate && !!p.startDate,
        url: p.url || '',
      }))
    : [];

  const certificates: Resume['certificates'] = Array.isArray(json?.certificates)
    ? json.certificates.map((c: any, idx: number) => ({
        id: `cert-${Date.now()}-${idx}`,
        name: c.name || '',
        date: c.date || '',
        issuer: c.issuer || '',
        url: c.url || '',
      }))
    : [];

  const awards: Resume['awards'] = Array.isArray(json?.awards)
    ? json.awards.map((a: any, idx: number) => ({
        id: `award-${Date.now()}-${idx}`,
        title: a.title || '',
        date: a.date || '',
        awarder: a.awarder || '',
        summary: a.summary || '',
      }))
    : [];

  // Sort experience by start date descending
  work.sort((x, y) => y.startDate.localeCompare(x.startDate));
  education.sort((x, y) => y.startDate.localeCompare(x.startDate));

  const sectionsOrder = existingResume?.sectionsOrder || [
    'basics',
    'work',
    'education',
    'skills',
    'projects',
    'certificates',
    'awards',
  ];

  const sectionsMeta = existingResume?.sectionsMeta || {
    basics: { id: 'basics', title: 'Personal Information', visible: true },
    work: { id: 'work', title: 'Professional Experience', visible: true },
    education: { id: 'education', title: 'Education', visible: true },
    skills: { id: 'skills', title: 'Technical Skills', visible: true },
    projects: { id: 'projects', title: 'Key Projects', visible: true },
    certificates: { id: 'certificates', title: 'Certifications', visible: true },
    awards: { id: 'awards', title: 'Honors & Awards', visible: true },
  };

  return {
    basics,
    work,
    education,
    skills,
    projects,
    certificates,
    awards,
    sectionsOrder,
    sectionsMeta,
  };
}
