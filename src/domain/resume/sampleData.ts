import { Resume } from './types';

/**
 * Premium sample resume data for demonstration and development.
 */
export const sampleResume: Resume = {
  basics: {
    name: 'Sophia Vance',
    label: 'Senior Full Stack Software Engineer',
    email: 'sophia.vance@example.com',
    phone: '+1 (555) 019-2834',
    url: 'https://sophiavance.dev',
    summary: 'Lead Full Stack Engineer with 8+ years of experience specializing in building highly scalable React applications, robust Node.js microservices, and distributed cloud architectures. Passionate about engineering excellence, mentoring developers, and cultivating collaborative Agile environments.',
    location: {
      address: '100 Innovation Way',
      postalCode: '94016',
      city: 'San Francisco',
      region: 'California',
      countryCode: 'US',
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'sophiavance',
        url: 'https://github.com/sophiavance',
      },
      {
        network: 'LinkedIn',
        username: 'sophiavance-dev',
        url: 'https://linkedin.com/in/sophiavance-dev',
      },
    ],
  },
  work: [
    {
      id: 'work-1',
      name: 'TechNovus Systems',
      position: 'Lead Full Stack Engineer',
      url: 'https://technovus.example.com',
      startDate: '2023-03',
      isCurrent: true,
      summary: 'Directing the engineering team to modernize a legacy cloud platform, serving over 500,000 active monthly business users.',
      highlights: [
        'Led the migration of a monolithic PHP service to a serverless Node.js/TypeScript architecture, improving API response times by 40% and saving $15k/month in infrastructure costs.',
        'Architected a custom design system with React, Tailwind CSS, and Radix Primitives, boosting frontend deployment speed across 4 sub-teams by 35%.',
        'Introduced automated CI/CD pipelines using GitHub Actions, decreasing developer deployment cycle times from 2 days to under 15 minutes.',
        'Mentored 6 junior/mid-level developers, conducting weekly pair programming sessions and tech talks on React 19 concurrent features.'
      ],
    },
    {
      id: 'work-2',
      name: 'CloudScale Solutions',
      position: 'Senior Software Engineer',
      url: 'https://cloudscale.example.com',
      startDate: '2020-06',
      endDate: '2023-02',
      isCurrent: false,
      summary: 'Designed and deployed high-performance distributed real-time dashboard analytics systems for enterprise clients.',
      highlights: [
        'Designed real-time telemetry analytics using WebSockets and Redis, processing over 10,000 events/second with sub-50ms visual updates.',
        'Refactored internal dashboard state management using Zustand, reducing memory leaks by 25% and reducing CPU overhead during high load.',
        'Collaborated with product designers to implement responsive layouts matching strict WCAG 2.1 AA accessibility guidelines.',
        'Optimized PostgreSQL queries and database indexing strategies, reducing heavy report-generation query latency from 8 seconds to 250 milliseconds.'
      ],
    },
    {
      id: 'work-3',
      name: 'InnoApp Labs',
      position: 'Software Engineer',
      url: 'https://innoapp.example.com',
      startDate: '2018-05',
      endDate: '2020-05',
      isCurrent: false,
      summary: 'Maintained and shipped cross-platform hybrid mobile and web applications using React and React Native.',
      highlights: [
        'Developed and released 3 hybrid React Native applications available on iOS App Store and Google Play Store with 4.7+ star ratings.',
        'Implemented offline-first synchronization protocols using SQLite and CouchDB, preserving user edits during low connectivity.',
        'Created a shared components package, reducing styling duplications by 50% across mobile and web interfaces.'
      ],
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      url: 'https://berkeley.edu',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: '2014-09',
      endDate: '2018-05',
      isCurrent: false,
      score: '3.82 / 4.00',
    }
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'Languages',
      keywords: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Go', 'SQL', 'HTML5/CSS3'],
    },
    {
      id: 'skill-2',
      name: 'Frameworks & Libraries',
      keywords: ['React 19', 'Next.js', 'Vite', 'Node.js', 'Express', 'Zustand', 'Tailwind CSS', 'Radix UI'],
    },
    {
      id: 'skill-3',
      name: 'Tools & Cloud',
      keywords: ['Docker', 'AWS (S3, Lambda, RDS)', 'Git', 'GitHub Actions', 'PostgreSQL', 'Redis', 'Cloudflare Pages'],
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenResume Engine',
      description: 'An open-source resume parser and optimizer utilizing local LLMs for parsing resume structures.',
      highlights: [
        'Engineered an offline-capable resume parsing pipeline in Node.js, achieving 92% accuracy on standard PDF resumes.',
        'Published a client-side parser React component downloaded over 5,000 times monthly on npm.'
      ],
      keywords: ['TypeScript', 'React', 'Local LLMs', 'Node.js'],
      startDate: '2024-01',
      isCurrent: true,
      url: 'https://github.com/sophiavance/openresume-engine',
    }
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      date: '2022-11',
      issuer: 'Amazon Web Services',
      url: 'https://aws.amazon.com',
    }
  ],
  awards: [
    {
      id: 'award-1',
      title: 'Top Engineering Innovator of the Year',
      date: '2024-01',
      awarder: 'TechNovus Systems',
      summary: 'Awarded for leading the migration to serverless infrastructure, saving major cloud costs and boosting application latency.',
    }
  ],
  sectionsOrder: ['basics', 'work', 'education', 'skills', 'projects', 'certificates', 'awards'],
  sectionsMeta: {
    basics: { id: 'basics', title: 'Personal Information', visible: true },
    work: { id: 'work', title: 'Professional Experience', visible: true },
    education: { id: 'education', title: 'Education', visible: true },
    skills: { id: 'skills', title: 'Technical Skills', visible: true },
    projects: { id: 'projects', title: 'Key Projects', visible: true },
    certificates: { id: 'certificates', title: 'Certifications', visible: true },
    awards: { id: 'awards', title: 'Honors & Awards', visible: true },
  },
};
