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
  'public/assets/akshay-cv.pdf',
);

export const resumeData: ResumeData = {
  basics: {
    name: 'Akshay Gupta',
    title: 'Senior Staff Engineer',
    summary: [
      'Seasoned full-stack engineer with 7+ years of experience building scalable, high-performance applications across cloud-native environments.',
      'Proven expertise in system optimization, backend engineering, PostgreSQL, and mission-critical messaging systems, with a passion for mentoring, DevOps automation, and AI-powered product experiences.',
    ],
    email: 'akshaygupta.live@gmail.com',
    phone: '+91 88199 45982',
    location: 'Mumbai, India',
    website: 'https://www.akshaygupta.live',
    linkedin: 'https://www.linkedin.com/in/akshayguptaujn',
    github: 'https://github.com/gupta-akshay',
    resumeUrl: 'https://akshaygupta.live/assets/akshay-cv.pdf',
  },
  skills: [
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
  ],
  experience: [
    {
      title: 'Senior Staff Engineer',
      company: 'PeopleGrove',
      period: 'Mar 2019 – Present',
      location: 'Remote, India',
      highlights: [
        'Built a RAG support chatbot to automate recurring client issues and boost response efficiency.',
        'Standardized logging to eliminate noisy log levels and cut Google Cloud Logging costs by 40%.',
        'Led Student Opportunity Center integration with zero downtime, migrating Firestore workloads to PostgreSQL.',
        'Created a real-time sync pipeline between BigQuery and Customer.io, increasing marketing effectiveness by 15%.',
        'Optimized legacy REST endpoints with better SQL, caching, and async workers, shrinking responses from 20s to under 50ms.',
        'Shipped a high-volume newsletter service using Google Pub/Sub and SendGrid, serving 1M+ personalized emails monthly.',
        'Built a weighted mentor-mentee bulk matching engine that increased engagement and drove 15% revenue growth.',
        'Developed an internal feature flag service that halved rollback events.',
        'Managed a team of three engineers, systemized delivery, and reduced technical debt by 40%.',
      ],
    },
    {
      title: 'Assistant System Engineer',
      company: 'Tata Consultancy Services',
      period: 'Sep 2017 – Mar 2019',
      location: 'Hyderabad, India',
      highlights: [
        'Delivered 10+ React.js enablement workshops with the Learning & Development team.',
        'Built a React application backed by SAP OData services that became the sales org’s core decision-making tool.',
        'Unified Tableau, Power BI, and SAP BusinessObjects inside a single React UI to streamline access to business intelligence reports.',
      ],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Engineering, Computer Science',
      school: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
      period: '2013 – 2017',
      location: 'Indore, India',
    },
  ],
};

