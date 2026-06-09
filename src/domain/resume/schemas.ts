import { z } from 'zod';

/**
 * Regex validator for YYYY-MM dates.
 */
export const dateSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
  message: 'Date must be in YYYY-MM format',
});

/**
 * Helper schema for optional URL that allows empty string.
 */
export const optionalUrlSchema = z.union([
  z.string().url({ message: 'Must be a valid URL' }),
  z.literal(''),
]).optional();

/**
 * Zod schema for social profiles.
 */
export const profileSchema = z.object({
  network: z.string().min(1, 'Network is required'),
  username: z.string().min(1, 'Username is required'),
  url: optionalUrlSchema,
});

/**
 * Zod schema for geographic location.
 */
export const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'State/Region is required'),
  countryCode: z.string().optional(),
});

/**
 * Zod schema for basic details.
 */
export const basicsSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  label: z.string().min(1, 'Professional title is required'),
  image: optionalUrlSchema,
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  url: optionalUrlSchema,
  summary: z.string().min(10, 'Professional summary should be at least 10 characters'),
  location: locationSchema,
  profiles: z.array(profileSchema),
});

/**
 * Zod schema for work experience.
 */
export const workSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  url: optionalUrlSchema,
  startDate: dateSchema,
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  summary: z.string().min(1, 'Summary of achievements is required'),
  highlights: z.array(z.string()),
}).refine(
  (data) => {
    if (data.isCurrent) return true;
    if (!data.endDate) return false;
    return data.endDate >= data.startDate;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Zod schema for education.
 */
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required'),
  url: optionalUrlSchema,
  area: z.string().min(1, 'Field of study is required'),
  studyType: z.string().min(1, 'Degree/Certificate type is required'),
  startDate: dateSchema,
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  score: z.string().optional(),
}).refine(
  (data) => {
    if (data.isCurrent) return true;
    if (!data.endDate) return false;
    return data.endDate >= data.startDate;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Zod schema for skills.
 */
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill category name is required'),
  level: z.string().optional(),
  keywords: z.array(z.string()).min(1, 'Provide at least one skill keyword'),
});

/**
 * Zod schema for projects.
 */
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string()),
  keywords: z.array(z.string()),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  url: optionalUrlSchema,
}).refine(
  (data) => {
    if (data.isCurrent) return true;
    if (!data.startDate || !data.endDate) return true;
    return data.endDate >= data.startDate;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Zod schema for certifications.
 */
export const certificateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  date: dateSchema,
  issuer: z.string().min(1, 'Issuer is required'),
  url: optionalUrlSchema,
});

/**
 * Zod schema for awards.
 */
export const awardSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Award title is required'),
  date: dateSchema,
  awarder: z.string().min(1, 'Awarder is required'),
  summary: z.string().min(1, 'Summary is required'),
});

/**
 * Zod schema for section metadata.
 */
export const sectionMetaSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title cannot be empty'),
  visible: z.boolean(),
});

/**
 * Entire resume validation schema.
 */
export const resumeSchema = z.object({
  basics: basicsSchema,
  work: z.array(workSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  certificates: z.array(certificateSchema),
  awards: z.array(awardSchema),
  sectionsOrder: z.array(z.string()),
  sectionsMeta: z.record(z.string(), sectionMetaSchema),
});
