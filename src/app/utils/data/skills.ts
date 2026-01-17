import { Skill } from '@/app/types';

export const skillsData: Skill[] = [
  {
    id: 'javascript',
    name: 'Javascript',
    icon: 'devicon-javascript-plain',
    category: 'programming',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'devicon-typescript-plain',
    category: 'programming',
  },
  {
    id: 'react',
    name: 'React',
    icon: 'devicon-react-original',
    category: 'frontend',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'devicon-nextjs-plain',
    category: 'frontend',
  },
  {
    id: 'node.js',
    name: 'Node.js',
    icon: 'devicon-nodejs-plain',
    category: 'backend',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: 'devicon-postgresql-plain',
    category: 'database',
  },
  {
    id: 'elasticsearch',
    name: 'ElasticSearch',
    icon: 'devicon-elasticsearch-plain',
    category: 'database',
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: 'devicon-redis-plain',
    category: 'database',
  },
  {
    id: 'firestore',
    name: 'Firestore',
    icon: 'devicon-firebase-plain',
    category: 'database',
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    icon: 'devicon-googlecloud-plain',
    category: 'database',
  },
  {
    id: 'rabbitMQ',
    name: 'RabbitMQ',
    icon: 'devicon-rabbitmq-original',
    category: 'infrastructure',
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: 'devicon-googlecloud-plain',
    category: 'cloud',
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    icon: 'devicon-amazonwebservices-plain-wordmark',
    category: 'cloud',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'devicon-docker-plain',
    category: 'infrastructure',
  },
];

export const getSkillsArray = (): Skill[] => {
  return skillsData;
};

export const getSkillsByCategory = (category: string): Skill[] => {
  return skillsData.filter((skill) => skill.category === category);
};

export const getSkillCategories = (): string[] => {
  return Array.from(
    new Set(
      skillsData
        .map((skill) => skill.category)
        .filter((category): category is string => Boolean(category))
    )
  );
};
