import { create } from 'zustand';
import { Resume } from '@/domain/resume/types';
import { sampleResume } from '@/domain/resume/sampleData';

/**
 * Key under which the resume data is saved in localStorage.
 */
const STORAGE_KEY = 'antigravity-resume-data';

/**
 * Key under which the template selection is saved in localStorage.
 */
const TEMPLATE_KEY = 'antigravity-resume-template';

/**
 * Allowed template keys.
 */
export type ResumeTemplateType = 'classic' | 'modern' | 'executive';

/**
 * State and actions for the resume builder store.
 */
interface ResumeState {
  resume: Resume;
  template: ResumeTemplateType;
  selectedWorkId: string | null;
  selectedEducationId: string | null;
  selectedProjectId: string | null;
  
  // Actions
  updateResume: (newResume: Resume) => void;
  updateBasics: (basics: Resume['basics']) => void;
  
  // Work Actions
  addWork: (work: Omit<Resume['work'][number], 'id'>) => void;
  updateWork: (id: string, work: Partial<Resume['work'][number]>) => void;
  removeWork: (id: string) => void;
  reorderWork: (startIndex: number, endIndex: number) => void;
  setSelectedWorkId: (id: string | null) => void;

  // Education Actions
  addEducation: (edu: Omit<Resume['education'][number], 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Resume['education'][number]>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  setSelectedEducationId: (id: string | null) => void;

  // Skill Actions
  addSkill: (skill: Omit<Resume['skills'][number], 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Resume['skills'][number]>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;

  // Project Actions
  addProject: (project: Omit<Resume['projects'][number], 'id'>) => void;
  updateProject: (id: string, project: Partial<Resume['projects'][number]>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  setSelectedProjectId: (id: string | null) => void;

  // Certificate Actions
  addCertificate: (cert: Omit<Resume['certificates'][number], 'id'>) => void;
  updateCertificate: (id: string, cert: Partial<Resume['certificates'][number]>) => void;
  removeCertificate: (id: string) => void;

  // Award Actions
  addAward: (award: Omit<Resume['awards'][number], 'id'>) => void;
  updateAward: (id: string, award: Partial<Resume['awards'][number]>) => void;
  removeAward: (id: string) => void;

  // Section visibility and ordering Actions
  toggleSectionVisibility: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, newTitle: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;

  // Template action
  setTemplate: (template: ResumeTemplateType) => void;
  
  // Reset Action
  resetResume: () => void;
  loadSampleData: () => void;
}

/**
 * Loads the initial resume state from localStorage, falling back to sampleResume.
 */
const loadInitialResume = (): Resume => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.basics) {
        return {
          ...sampleResume,
          ...parsed,
          sectionsMeta: { ...sampleResume.sectionsMeta, ...(parsed.sectionsMeta || {}) },
          sectionsOrder: parsed.sectionsOrder || sampleResume.sectionsOrder,
        };
      }
    }
  } catch (error) {
    console.error('Failed to parse saved resume data, falling back to sample', error);
  }
  return sampleResume;
};

/**
 * Loads the initial template state from localStorage, falling back to 'classic'.
 */
const loadInitialTemplate = (): ResumeTemplateType => {
  try {
    const saved = localStorage.getItem(TEMPLATE_KEY);
    if (saved === 'classic' || saved === 'modern' || saved === 'executive') {
      return saved;
    }
  } catch {}
  return 'classic';
};

const isEqual = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right);

/**
 * Zustand store implementation for managing resume editing state.
 */
export const useResumeStore = create<ResumeState>((set) => ({
  resume: loadInitialResume(),
  template: loadInitialTemplate(),
  selectedWorkId: null,
  selectedEducationId: null,
  selectedProjectId: null,

  updateResume: (newResume) => set((state) => {
    if (isEqual(state.resume, newResume)) return state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newResume));
    return { resume: newResume };
  }),

  updateBasics: (basics) => set((state) => {
    if (isEqual(state.resume.basics, basics)) return state;
    const nextResume = { ...state.resume, basics };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  addWork: (work) => set((state) => {
    const newEntry = { ...work, id: `work-${Date.now()}` };
    const nextResume = {
      ...state.resume,
      work: [...state.resume.work, newEntry],
    };
    nextResume.work.sort((a, b) => b.startDate.localeCompare(a.startDate));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume, selectedWorkId: newEntry.id };
  }),

  updateWork: (id, updatedFields) => set((state) => {
    const currentWork = state.resume.work.find((w) => w.id === id);
    if (!currentWork) return state;
    const updatedWork = { ...currentWork, ...updatedFields };
    if (isEqual(currentWork, updatedWork)) return state;
    const nextWork = state.resume.work.map((w) =>
      w.id === id ? updatedWork : w
    );
    nextWork.sort((a, b) => b.startDate.localeCompare(a.startDate));
    const nextResume = { ...state.resume, work: nextWork };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  removeWork: (id) => set((state) => {
    const nextResume = {
      ...state.resume,
      work: state.resume.work.filter((w) => w.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return {
      resume: nextResume,
      selectedWorkId: state.selectedWorkId === id ? null : state.selectedWorkId,
    };
  }),

  reorderWork: (startIndex, endIndex) => set((state) => {
    const nextWork = Array.from(state.resume.work);
    const [removed] = nextWork.splice(startIndex, 1);
    nextWork.splice(endIndex, 0, removed);
    const nextResume = { ...state.resume, work: nextWork };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  setSelectedWorkId: (id) => set({ selectedWorkId: id }),

  addEducation: (edu) => set((state) => {
    const newEntry = { ...edu, id: `edu-${Date.now()}` };
    const nextResume = {
      ...state.resume,
      education: [...state.resume.education, newEntry],
    };
    nextResume.education.sort((a, b) => b.startDate.localeCompare(a.startDate));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume, selectedEducationId: newEntry.id };
  }),

  updateEducation: (id, updatedFields) => set((state) => {
    const currentEducation = state.resume.education.find((e) => e.id === id);
    if (!currentEducation) return state;
    const updatedEducation = { ...currentEducation, ...updatedFields };
    if (isEqual(currentEducation, updatedEducation)) return state;
    const nextEducation = state.resume.education.map((e) =>
      e.id === id ? updatedEducation : e
    );
    nextEducation.sort((a, b) => b.startDate.localeCompare(a.startDate));
    const nextResume = { ...state.resume, education: nextEducation };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  removeEducation: (id) => set((state) => {
    const nextResume = {
      ...state.resume,
      education: state.resume.education.filter((e) => e.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return {
      resume: nextResume,
      selectedEducationId: state.selectedEducationId === id ? null : state.selectedEducationId,
    };
  }),

  reorderEducation: (startIndex, endIndex) => set((state) => {
    const nextEducation = Array.from(state.resume.education);
    const [removed] = nextEducation.splice(startIndex, 1);
    nextEducation.splice(endIndex, 0, removed);
    const nextResume = { ...state.resume, education: nextEducation };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  setSelectedEducationId: (id) => set({ selectedEducationId: id }),

  addSkill: (skill) => set((state) => {
    const newEntry = { ...skill, id: `skill-${Date.now()}` };
    const nextResume = {
      ...state.resume,
      skills: [...state.resume.skills, newEntry],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  updateSkill: (id, updatedFields) => set((state) => {
    const currentSkill = state.resume.skills.find((s) => s.id === id);
    if (!currentSkill) return state;
    const updatedSkill = { ...currentSkill, ...updatedFields };
    if (isEqual(currentSkill, updatedSkill)) return state;
    const nextResume = {
      ...state.resume,
      skills: state.resume.skills.map((s) =>
        s.id === id ? updatedSkill : s
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  removeSkill: (id) => set((state) => {
    const nextResume = {
      ...state.resume,
      skills: state.resume.skills.filter((s) => s.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  reorderSkills: (startIndex, endIndex) => set((state) => {
    const nextSkills = Array.from(state.resume.skills);
    const [removed] = nextSkills.splice(startIndex, 1);
    nextSkills.splice(endIndex, 0, removed);
    const nextResume = { ...state.resume, skills: nextSkills };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  addProject: (project) => set((state) => {
    const newEntry = { ...project, id: `proj-${Date.now()}` };
    const nextResume = {
      ...state.resume,
      projects: [...state.resume.projects, newEntry],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume, selectedProjectId: newEntry.id };
  }),

  updateProject: (id, updatedFields) => set((state) => {
    const currentProject = state.resume.projects.find((p) => p.id === id);
    if (!currentProject) return state;
    const updatedProject = { ...currentProject, ...updatedFields };
    if (isEqual(currentProject, updatedProject)) return state;
    const nextResume = {
      ...state.resume,
      projects: state.resume.projects.map((p) =>
        p.id === id ? updatedProject : p
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  removeProject: (id) => set((state) => {
    const nextResume = {
      ...state.resume,
      projects: state.resume.projects.filter((p) => p.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return {
      resume: nextResume,
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
    };
  }),

  reorderProjects: (startIndex, endIndex) => set((state) => {
    const nextProjects = Array.from(state.resume.projects);
    const [removed] = nextProjects.splice(startIndex, 1);
    nextProjects.splice(endIndex, 0, removed);
    const nextResume = { ...state.resume, projects: nextProjects };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  addCertificate: (cert) => set((state) => {
    const newEntry = { ...cert, id: `cert-${Date.now()}` };
    const nextResume = {
      ...state.resume,
      certificates: [...state.resume.certificates, newEntry],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  updateCertificate: (id, updatedFields) => set((state) => {
    const currentCertificate = state.resume.certificates.find((c) => c.id === id);
    if (!currentCertificate) return state;
    const updatedCertificate = { ...currentCertificate, ...updatedFields };
    if (isEqual(currentCertificate, updatedCertificate)) return state;
    const nextResume = {
      ...state.resume,
      certificates: state.resume.certificates.map((c) =>
        c.id === id ? updatedCertificate : c
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  removeCertificate: (id) => set((state) => {
    const nextResume = {
      ...state.resume,
      certificates: state.resume.certificates.filter((c) => c.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  addAward: (award) => set((state) => {
    const newEntry = { ...award, id: `award-${Date.now()}` };
    const nextResume = {
      ...state.resume,
      awards: [...state.resume.awards, newEntry],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  updateAward: (id, updatedFields) => set((state) => {
    const currentAward = state.resume.awards.find((a) => a.id === id);
    if (!currentAward) return state;
    const updatedAward = { ...currentAward, ...updatedFields };
    if (isEqual(currentAward, updatedAward)) return state;
    const nextResume = {
      ...state.resume,
      awards: state.resume.awards.map((a) =>
        a.id === id ? updatedAward : a
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  removeAward: (id) => set((state) => {
    const nextResume = {
      ...state.resume,
      awards: state.resume.awards.filter((a) => a.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  toggleSectionVisibility: (sectionId) => set((state) => {
    const currentMeta = state.resume.sectionsMeta[sectionId];
    if (!currentMeta) return {};
    const nextResume = {
      ...state.resume,
      sectionsMeta: {
        ...state.resume.sectionsMeta,
        [sectionId]: { ...currentMeta, visible: !currentMeta.visible },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  updateSectionTitle: (sectionId, newTitle) => set((state) => {
    const currentMeta = state.resume.sectionsMeta[sectionId];
    if (!currentMeta) return {};
    const nextResume = {
      ...state.resume,
      sectionsMeta: {
        ...state.resume.sectionsMeta,
        [sectionId]: { ...currentMeta, title: newTitle },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  reorderSections: (startIndex, endIndex) => set((state) => {
    const nextOrder = Array.from(state.resume.sectionsOrder);
    const [removed] = nextOrder.splice(startIndex, 1);
    nextOrder.splice(endIndex, 0, removed);
    const nextResume = { ...state.resume, sectionsOrder: nextOrder };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    return { resume: nextResume };
  }),

  setTemplate: (template) => set(() => {
    localStorage.setItem(TEMPLATE_KEY, template);
    return { template };
  }),

  resetResume: () => set(() => {
    const emptyResume: Resume = {
      basics: {
        name: '',
        label: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: { city: '', region: '' },
        profiles: [],
      },
      work: [],
      education: [],
      skills: [],
      projects: [],
      certificates: [],
      awards: [],
      sectionsOrder: sampleResume.sectionsOrder,
      sectionsMeta: sampleResume.sectionsMeta,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyResume));
    return {
      resume: emptyResume,
      selectedWorkId: null,
      selectedEducationId: null,
      selectedProjectId: null,
    };
  }),

  loadSampleData: () => set(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleResume));
    return {
      resume: sampleResume,
      selectedWorkId: null,
      selectedEducationId: null,
      selectedProjectId: null,
    };
  }),
}));
