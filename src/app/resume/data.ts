import { getYearsOfExperience } from '@/app/utils/helpers/format';

export interface ResumeSkillCategory {
  label: string;
  details: string;
}

export interface ResumeRole {
  position: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeCompany {
  company: string;
  location: string;
  summary?: string;
  roles: ResumeRole[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  area: string;
  location: string;
  date: string;
}

export interface ResumeData {
  name: string;
  headline: string;
  location: string;
  email: string;
  website: string;
  summary: string;
  skills: ResumeSkillCategory[];
  experience: ResumeCompany[];
  education: ResumeEducation[];
}

export const resumeData: ResumeData = {
  name: 'Akshay Gupta',
  headline: 'Senior Staff Engineer',
  location: 'Mumbai, India',
  email: 'akshaygupta.live@gmail.com',
  website: 'https://akshaygupta.live',
  summary: `Senior Staff Engineer with ${getYearsOfExperience()}+ years building scalable backend, platform, and AI-enabled systems on GCP and AWS. Expert in PostgreSQL performance tuning, distributed messaging, zero-downtime migrations, and cloud cost optimization, with a track record of owning platform-level architecture and leading engineering delivery across high-growth SaaS products.`,
  skills: [
    { label: 'Languages', details: 'TypeScript, JavaScript, Python, Go' },
    { label: 'Backend', details: 'Node.js, Express.js, Sails.js, REST APIs' },
    {
      label: 'AI & Tooling',
      details: 'Model Context Protocol (MCP), RAG, vector & semantic search',
    },
    { label: 'Frontend', details: 'React, Next.js, Redux, React-Query' },
    {
      label: 'Databases',
      details: 'PostgreSQL, Redis, Elasticsearch, BigQuery, Firestore',
    },
    {
      label: 'Cloud',
      details:
        'GCP (CloudSQL, Pub/Sub, Functions, Cloud Storage), AWS (RDS, Lambda, S3, SQS, CloudFront)',
    },
    { label: 'Messaging', details: 'RabbitMQ, Google Pub/Sub, AWS SQS' },
    { label: 'DevOps', details: 'Docker, ArgoCD, GitHub Actions' },
    { label: 'Observability', details: 'Sentry, NewRelic, Kibana' },
    { label: 'Testing', details: 'Jest, Mocha, React Testing Library' },
  ],
  experience: [
    {
      company: 'PeopleGrove',
      location: 'Remote, India',
      summary:
        'Career and mentorship SaaS platform serving 200+ university clients and 1M+ users.',
      roles: [
        {
          position: 'Senior Staff Engineer',
          startDate: '2024-01',
          endDate: 'present',
          bullets: [
            'Architected and delivered a RAG-based support chatbot, designing the document ingestion and embedding pipeline, vector retrieval layer, and response-grounding flow over internal docs and ticket history, automating resolution of recurring client issues and reducing manual support load.',
            'Re-architected logging standards across services by eliminating redundant log levels and standardizing structured logging, cutting Google Cloud Logging costs by 40%.',
            'Led the zero-downtime migration of the Student Opportunity Center from Firestore to PostgreSQL, owning rollout strategy and preserving continuity across customer-facing workflows.',
            'Drove a cross-service technical-debt reduction initiative, refactoring core modules and tightening test coverage to reduce reported production issues by 25%.',
            'Built a Go MCP server connecting AI coding assistants directly to PostgreSQL for live EXPLAIN analysis, index simulation, and automated health audits; shipped as a dependency-free 15 MB static binary.',
            'Architected a hybrid (BM25 + vector) code-search MCP server over a multi-repo workspace, designing the indexing pipeline, symbol-graph resolution layer, and unified query interface so AI agents trace features and navigate cross-repo code in one tool call, accelerating navigation and engineer onboarding.',
          ],
        },
        {
          position: 'Engineering Manager',
          startDate: '2022-04',
          endDate: '2023-12',
          bullets: [
            'Mentored 3 engineers through code reviews, architecture guidance, and delivery planning, reducing development cycle time by 15%.',
            'Architected and launched an NLP-powered messaging system that lifted user engagement by 20% and customer satisfaction by 10%.',
            'Built a real-time sync pipeline between BigQuery and Customer.io, increasing marketing campaign effectiveness by 15% through more personalized targeting.',
            'Created a migration tool that transitioned 200+ university customer sites to PeopleGrove V2, reducing manual setup effort while preserving customer continuity.',
          ],
        },
        {
          position: 'SDE I — Senior SDE',
          startDate: '2019-03',
          endDate: '2022-03',
          bullets: [
            'Optimized legacy REST APIs through PostgreSQL query tuning, Redis caching, and RabbitMQ-based async processing, cutting response times from ~20 seconds to under 50 milliseconds.',
            'Built a high-volume newsletter service on Google Pub/Sub and SendGrid, delivering personalized content to over 1 million users monthly.',
            "Migrated the legacy Angular.js frontend to React, improving page load times by 25% and modernizing the platform's UI architecture.",
            'Implemented React code-splitting to raise the Lighthouse performance score above 90, improving load times and retention.',
            'Built a weighted-factor bulk matching tool for mentor-mentee pairings, increasing platform engagement and contributing to 15% revenue growth.',
            'Developed a feature-flag management system enabling agile rollouts and reducing rollback incidents by 90%.',
            'Improved backend reliability via worker-thread processing for CPU-intensive tasks, automated Cron workflows, and Postmark-based transactional email.',
          ],
        },
      ],
    },
    {
      company: 'Tata Consultancy Services',
      location: 'Hyderabad, India',
      summary: 'Client: ARM Semiconductors · Project: Deal Evaluator & Fusion',
      roles: [
        {
          position: 'Assistant System Engineer',
          startDate: '2017-09',
          endDate: '2019-03',
          bullets: [
            'Built a React application consuming SAP OData services to deliver sales insights for ARM Semiconductors stakeholders, earning recognition from client leadership.',
            'Consolidated Tableau, Power BI, and SAP BusinessObjects reporting into a single React interface, giving business teams unified access to BI dashboards.',
            'Led 10+ React.js workshops for the internal team, building frontend capability across the practice.',
          ],
        },
      ],
    },
  ],
  education: [
    {
      institution: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
      degree: 'BE',
      area: 'Computer Science',
      location: 'Indore, India',
      date: '2013 – 2017',
    },
  ],
};
