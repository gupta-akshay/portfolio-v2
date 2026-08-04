interface ExperienceRole {
  id: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface CompanyExperience {
  company: string;
  location: string;
  logo: string;
  startDate: string;
  endDate?: string;
  roles: ExperienceRole[];
}

export const experienceData: CompanyExperience[] = [
  {
    company: 'PeopleGrove',
    location: 'Remote, India',
    logo: '/images/peoplegrove.webp',
    startDate: '2019-03-18',
    roles: [
      {
        id: 'senior-staff-engineer',
        position: 'Senior Staff Engineer',
        startDate: '2024-05-01',
        description:
          'Developed an AI-powered Support ChatBot to automate recurring client issue resolution, reducing human dependency and improving response efficiency, while also redesigning and standardizing logging mechanisms, cutting Google Cloud Logging costs by 40%.',
      },
      {
        id: 'staff-engineer',
        position: 'Staff Engineer',
        startDate: '2024-01-01',
        endDate: '2024-05-01',
        description:
          "Enhanced PeopleGrove's first acquisition 'Student Opportunity Center' for optimal performance and led projects to reduce technical debt across key product codebases, significantly improving system efficiency.",
      },
      {
        id: 'engineering-manager',
        position: 'Engineering Manager',
        startDate: '2022-04-01',
        endDate: '2023-12-31',
        description:
          'Mentored a team of junior developers, spearheaded a BigQuery data sync process for Customer.io, and crafted a migration tool, seamlessly upgrading over 200 clients to PeopleGrove V2.',
      },
      {
        id: 'senior-sde',
        position: 'Senior Software Development Engineer',
        startDate: '2021-04-01',
        endDate: '2022-03-31',
        description:
          'Dramatically optimized PostgreSQL queries for substantial dataset, spearheaded a large-scale newsletter service, and implemented front-end optimizations, significantly boosting user experience.',
      },
      {
        id: 'sde-ii',
        position: 'Software Development Engineer II',
        startDate: '2020-04-01',
        endDate: '2021-03-31',
        description:
          'Developed automated Cron jobs, transitioned code from Angular.js to React enhancing user engagement, and mastered worker threads for efficient processing of CPU-intensive tasks.',
      },
      {
        id: 'sde-i',
        position: 'Software Development Engineer I',
        startDate: '2019-03-18',
        endDate: '2020-03-31',
        description:
          "Innovated 'Bulk Matching' tool enhancing revenue, developed 'Launch Groups' for feature-flagged releases, and streamlined email communications with Postmark integration.",
      },
    ],
  },
  {
    company: 'Tata Consultancy Services',
    location: 'Hyderabad, India',
    logo: '/images/tcs.svg',
    startDate: '2017-09-13',
    endDate: '2019-03-17',
    roles: [
      {
        id: 'ase-tcs',
        position: 'Assistant System Engineer',
        startDate: '2018-10-14',
        endDate: '2019-03-17',
        description:
          'Built an integrated application combining Tableau, PowerBI, and SAP BO with SSO via Azure and conducted extensive React.js training, elevating organizational development capabilities.',
      },
      {
        id: 'ase-trainee-tcs',
        position: 'Assistant System Engineer - Trainee',
        startDate: '2017-09-13',
        endDate: '2018-09-30',
        description:
          'Completed intensive Java and Spring Boot training and developed a dashboard application with SAP OData, providing actionable sales insights.',
      },
    ],
  },
];
