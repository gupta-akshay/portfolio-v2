const data = [
  {
    id: 0,
    date: '2024-01-01',
    role: 'Staff Engineer',
    company: 'PeopleGrove',
    timeInRole: 'Jan, 2024 - Present',
    location: 'Remote, India',
    responsibilities: `
      <ul>
        <li>Managing and enhancing the product performance of PeopleGrove's first acquisition, 'Student Opportunity Center'.</li>
        <li>Leading tech projects aimed at eliminating technical debt across various product codebases, including cloud functions, cron jobs, core API, and micro-services.</li>
      </ul>
    `,
    imgSrc: '/images/peoplegrove.png',
  },
  {
    id: 1,
    date: '2022-04-01',
    role: 'Engineering Manager',
    company: 'PeopleGrove',
    timeInRole: 'Apr, 2022 - Dec, 2023',
    location: 'Remote, India',
    responsibilities: `
      <ul>
        <li>Mentored and led a team of 3 junior developers & collaborated closely with product managers and designers.</li>
        <li>Designed and implemented a data synchronization process using BigQuery to transfer data from the primary database to the customer engagement platform (Customer.io) for marketing use.</li>
        <li>Designed and built a migration tool for transitioning legacy customer platforms to the PeopleGrove V2 platform, successfully migrating over 200 customer sites to date.</li>
      </ul>
    `,
    imgSrc: '/images/peoplegrove.png',
  },
  {
    id: 2,
    date: '2021-04-01',
    role: 'Senior Software Development Engineer',
    company: 'PeopleGrove',
    timeInRole: 'Apr, 2021 - Mar, 2022',
    location: 'Remote, India',
    responsibilities: `
      <ul>
        <li>Optimized PostgreSQL queries for a 20+ million record dataset, cutting API response times from 4-5 seconds to under 50 milliseconds.</li>
        <li>Administered a robust newsletter service via Google Pub/Sub & SendGrid, reaching over 500k recipients monthly.</li>
        <li>Optimized React front-end loading times through effective code-splitting, elevating user experience.</li>
      </ul>
    `,
    imgSrc: '/images/peoplegrove.png',
  },
  {
    id: 3,
    date: '2020-04-01',
    role: 'Software Development Engineer II',
    company: 'PeopleGrove',
    timeInRole: 'Apr, 2020 - Mar, 2021',
    location: 'Remote, India',
    responsibilities: `
      <ul>
        <li>Developed scheduled Cron jobs for tasks such as email notifications and data maintenance.</li>
        <li>Transitioned legacy Angular.js code to React, boosting user engagement tenfold through enhanced UX.</li>
        <li>Gained expertise in utilizing worker threads for efficient CPU-intensive task processing.</li>
      </ul>
    `,
    imgSrc: '/images/peoplegrove.png',
  },
  {
    id: 4,
    date: '2019-03-18',
    role: 'Software Development Engineer I',
    company: 'PeopleGrove',
    timeInRole: 'Mar, 2019 - Mar, 2020',
    location: 'Mumbai, India',
    responsibilities: `
      <ul>
        <li>Designed and built 'Bulk Matching', a key revenue-driving tool that pairs mentees with mentors using profile data.</li>
        <li>Created 'Launch Groups', an internal tool for scalable feature-flagged releases, successfully used for over 20 products.</li>
        <li>Utilized Postmark for dispatching template-based emails efficiently.</li>
      </ul>
    `,
    imgSrc: '/images/peoplegrove.png',
  },
  {
    id: 5,
    date: '2018-10-14',
    role: 'Assistant System Engineer',
    company: 'Tata Consultancy Services',
    timeInRole: 'Oct, 2018 - Mar, 2019',
    location: 'Hyderabad, India',
    responsibilities: `
      <ul>
        <li>Engineered an application integrating Tableau, PowerBI, and SAP BO reports with SSO capability via Microsoft Azure.</li>
        <li>Delivered over 10 corporate training sessions on React.js, enhancing development skills across the organization.</li>
      </ul>
    `,
    imgSrc: '/images/tcs.svg',
  },
  {
    id: 6,
    date: '2017-09-13',
    role: 'Assistant System Engineer - Trainee',
    company: 'Tata Consultancy Services',
    timeInRole: 'Sept, 2017 - Sept, 2018',
    location: 'Hyderabad, India',
    responsibilities: `
      <ul>
        <li>Acquired expertise through corporate training in Java and Spring Boot.</li>
        <li>Developed a dashboard application leveraging SAP OData service, aiding sales decisions with real-time data insights.</li>
      </ul>
    `,
    imgSrc: '/images/tcs.svg',
  },
];

export default data;
