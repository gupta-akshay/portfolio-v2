import path from 'node:path';

export interface ResumeBasics {
  name: string;
  title: string;
  summary: string[];
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
}

export interface ResumeSkillCategory {
  label: string;
  items: string[];
}

export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  period: string;
  location: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  skills: ResumeSkillCategory[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
}

export const resumePdfPath = path.resolve(
  process.cwd(),
  'public/assets/Akshay_Gupta_CV.pdf',
);

const createBasics = (): ResumeBasics => ({
  name: 'Akshay Gupta',
  title: 'Senior Staff Engineer',
  summary: [
    'Hands-on staff engineer shipping resilient, low-latency systems across Node, TypeScript, and cloud-native stacks for 7+ years.',
    'Pair architecture docs with real ops automation—mentoring squads, squeezing perf, and sneaking in delightful DX touches wherever possible.',
  ],
  email: 'akshaygupta.live@gmail.com',
  phone: '+91 88199 45982',
  location: 'Mumbai, India',
  website: 'https://www.akshaygupta.live',
  linkedin: 'https://www.linkedin.com/in/akshayguptaujn',
  github: 'https://github.com/gupta-akshay',
  resumeUrl: 'https://akshaygupta.live/assets/Akshay_Gupta_CV.pdf',
});

const createSkills = (): ResumeSkillCategory[] => [
  {
    label: 'Technologies',
    items: ['JavaScript', 'TypeScript', 'Python'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL', 'ElasticSearch', 'Redis', 'Firestore', 'BigQuery'],
  },
  {
    label: 'Frameworks',
    items: ['Express.js', 'Sails.js', 'Next.js'],
  },
  {
    label: 'Frontend',
    items: ['HTML', 'CSS', 'React', 'Redux', 'SASS', 'React Query', 'Jotai'],
  },
  {
    label: 'Messaging',
    items: ['RabbitMQ', 'Google Pub/Sub', 'AWS SQS'],
  },
  {
    label: 'DevOps',
    items: ['Docker', 'ArgoCD', 'GitHub Actions'],
  },
  {
    label: 'Google Cloud',
    items: [
      'Cloud Storage',
      'CDN',
      'Cloud SQL',
      'Functions',
      'Cloud Tasks',
      'Scheduler',
      'Cloud Logging',
    ],
  },
  {
    label: 'AWS',
    items: ['S3', 'CloudFront', 'RDS', 'Lambda', 'CloudWatch'],
  },
  {
    label: 'Observability',
    items: ['Kibana', 'New Relic', 'Sentry'],
  },
  {
    label: 'Integrations',
    items: ['SendGrid', 'Postmark', 'Resend', 'Twilio', 'Plivo', 'Stripe', 'Zapier'],
  },
];

const createExperience = (): ResumeExperience[] => [
  {
    title: 'Senior Staff Engineer',
    company: 'PeopleGrove',
    period: 'Mar 2019 - Present',
    location: 'Remote, India',
    highlights: [
      'Built a RAG support copilot that auto-triages noisy tickets so humans stay focused on gnarly bugs.',
      'Standardized logging like a SRE—stripped noisy levels and slashed Google Cloud Logging costs by 40%.',
      'Merged Student Opportunity Center with zero downtime by migrating Firestore workloads into PostgreSQL.',
      'Streamed BigQuery facts into Customer.io in near real-time, upping lifecycle campaign lift by ~15%.',
      'Refactored crusty REST endpoints with better SQL, caches, and async workers—20s responses now land under 50 ms.',
      'Shipped a newsletter pipeline backed by Pub/Sub + SendGrid that reliably fan-outs 1M+ personalized emails each month.',
      'Designed a weighted mentor/mentee matcher that behaves like a constraint solver and nudged revenue +15%.',
      'Rolled a homegrown feature-flag service so product can safely toggle without paging ops; rollback rate halved.',
      'Led a squad of three, codified delivery rituals, and chiseled tech debt down by roughly 40%.',
    ],
  },
  {
    title: 'Assistant System Engineer',
    company: 'Tata Consultancy Services',
    period: 'Sep 2017 - Mar 2019',
    location: 'Hyderabad, India',
    highlights: [
      'Delivered 10+ React enablement sprints so the org stopped copy/pasting jQuery into new apps.',
      'Built a React + SAP OData control tower that became the sales org’s daily driver dashboard.',
      'Juggled Tableau, Power BI, and SAP BusinessObjects inside one React UI so stakeholders stopped alt-tabbing.',
    ],
  },
];

const createEducation = (): ResumeEducation[] => [
  {
    degree: 'Bachelor of Engineering, Computer Science',
    school: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    period: '2013 - 2017',
    location: 'Indore, India',
  },
];

export const resumeData: ResumeData = {
  basics: createBasics(),
  skills: createSkills(),
  experience: createExperience(),
  education: createEducation(),
};

