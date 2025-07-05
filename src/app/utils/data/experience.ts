import { ExperienceItem } from '@/app/types';

export const experienceData: ExperienceItem[] = [
  {
    id: 'senior-staff-engineer',
    company: 'PeopleGrove',
    position: 'Senior Staff Engineer',
    location: 'Remote, India',
    startDate: '2024-05-01',
    description:
      'Developed an AI-powered Support ChatBot to automate recurring client issue resolution, reducing human dependency and improving response efficiency, while also redesigning and standardizing logging mechanisms, cutting Google Cloud Logging costs by 40%.',
    logo: '/images/peoplegrove.png',
  },
  {
    id: 'staff-engineer',
    company: 'PeopleGrove',
    position: 'Staff Engineer',
    location: 'Remote, India',
    startDate: '2024-01-01',
    endDate: '2024-05-01',
    description:
      "Enhanced PeopleGrove's first acquisition 'Student Opportunity Center' for optimal performance and led projects to reduce technical debt across key product codebases, significantly improving system efficiency.",
    logo: '/images/peoplegrove.png',
  },
  {
    id: 'engineering-manager',
    company: 'PeopleGrove',
    position: 'Engineering Manager',
    location: 'Remote, India',
    startDate: '2022-04-01',
    endDate: '2023-12-31',
    description:
      'Mentored a team of junior developers, spearheaded a BigQuery data sync process for Customer.io, and crafted a migration tool, seamlessly upgrading over 200 clients to PeopleGrove V2.',
    logo: '/images/peoplegrove.png',
  },
  {
    id: 'senior-sde',
    company: 'PeopleGrove',
    position: 'Senior Software Development Engineer',
    location: 'Remote, India',
    startDate: '2021-04-01',
    endDate: '2022-03-31',
    description:
      'Dramatically optimized PostgreSQL queries for substantial dataset, spearheaded a large-scale newsletter service, and implemented front-end optimizations, significantly boosting user experience.',
    logo: '/images/peoplegrove.png',
  },
  {
    id: 'sde-ii',
    company: 'PeopleGrove',
    position: 'Software Development Engineer II',
    location: 'Remote, India',
    startDate: '2020-04-01',
    endDate: '2021-03-31',
    description:
      'Developed automated Cron jobs, transitioned code from Angular.js to React enhancing user engagement, and mastered worker threads for efficient processing of CPU-intensive tasks.',
    logo: '/images/peoplegrove.png',
  },
  {
    id: 'sde-i',
    company: 'PeopleGrove',
    position: 'Software Development Engineer I',
    location: 'Mumbai, India',
    startDate: '2019-03-18',
    endDate: '2020-03-31',
    description:
      "Innovated 'Bulk Matching' tool enhancing revenue, developed 'Launch Groups' for feature-flagged releases, and streamlined email communications with Postmark integration.",
    logo: '/images/peoplegrove.png',
  },
  {
    id: 'ase-tcs',
    company: 'Tata Consultancy Services',
    position: 'Assistant System Engineer',
    location: 'Hyderabad, India',
    startDate: '2018-10-14',
    endDate: '2019-03-17',
    description:
      'Built an integrated application combining Tableau, PowerBI, and SAP BO with SSO via Azure and conducted extensive React.js training, elevating organizational development capabilities.',
    logo: '/images/tcs.svg',
  },
  {
    id: 'ase-trainee-tcs',
    company: 'Tata Consultancy Services',
    position: 'Assistant System Engineer - Trainee',
    location: 'Hyderabad, India',
    startDate: '2017-09-13',
    endDate: '2018-09-30',
    description:
      'Completed intensive Java and Spring Boot training and developed a dashboard application with SAP OData, providing actionable sales insights.',
    logo: '/images/tcs.svg',
  },
];

export const getExperienceData = (): ExperienceItem[] => {
  return experienceData;
};

export const getExperienceByCompany = (company: string): ExperienceItem[] => {
  return experienceData.filter((exp) => exp.company === company);
};

export const getCurrentExperience = (): ExperienceItem | undefined => {
  return experienceData.find((exp) => !exp.endDate);
};
