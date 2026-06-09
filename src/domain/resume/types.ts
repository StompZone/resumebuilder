/**
 * Represents social profiles associated with the resume basics.
 */
export interface Profile {
  network: string;
  username: string;
  url?: string;
}

/**
 * Represents geographic location details.
 */
export interface Location {
  address?: string;
  postalCode?: string;
  city: string;
  region: string;
  countryCode?: string;
}

/**
 * Represents basic personal information.
 */
export interface Basics {
  name: string;
  label: string;
  image?: string;
  email: string;
  phone: string;
  url?: string;
  summary: string;
  location: Location;
  profiles: Profile[];
}

/**
 * Represents a work experience entry.
 */
export interface Work {
  id: string;
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  summary: string;
  highlights: string[];
}

/**
 * Represents an education entry.
 */
export interface Education {
  id: string;
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  score?: string;
}

/**
 * Represents a skill category or listing.
 */
export interface Skill {
  id: string;
  name: string;
  level?: string;
  keywords: string[];
}

/**
 * Represents a project entry.
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  url?: string;
}

/**
 * Represents a certification or license.
 */
export interface Certificate {
  id: string;
  name: string;
  date: string;
  issuer: string;
  url?: string;
}

/**
 * Represents an award or honor.
 */
export interface Award {
  id: string;
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

/**
 * Metadata configuration for customizing section titles, visibility, and layout.
 */
export interface SectionMeta {
  id: string;
  title: string;
  visible: boolean;
}

/**
 * Complete structured resume data model, compatible with JSON Resume.
 */
export interface Resume {
  basics: Basics;
  work: Work[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  awards: Award[];
  sectionsOrder: string[];
  sectionsMeta: Record<string, SectionMeta>;
}
