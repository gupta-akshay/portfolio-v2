import type { TechIconName } from '@/app/components/Icon/techIcons';

export const skillsData = [
  {
    name: 'Javascript',
    icon: 'javascript',
  },
  {
    name: 'TypeScript',
    icon: 'typescript',
  },
  {
    name: 'React',
    icon: 'react',
  },
  {
    name: 'Next.js',
    icon: 'nextjs',
  },
  {
    name: 'Node.js',
    icon: 'nodejs',
  },
  {
    name: 'PostgreSQL',
    icon: 'postgresql',
  },
  {
    name: 'ElasticSearch',
    icon: 'elasticsearch',
  },
  {
    name: 'Redis',
    icon: 'redis',
  },
  {
    name: 'Firestore',
    icon: 'firebase',
  },
  {
    name: 'BigQuery',
    icon: 'googlecloud',
  },
  {
    name: 'RabbitMQ',
    icon: 'rabbitmq',
  },
  {
    name: 'Google Cloud Platform',
    icon: 'googlecloud',
  },
  {
    name: 'Amazon Web Services',
    icon: 'aws',
  },
  {
    name: 'Docker',
    icon: 'docker',
  },
] satisfies { name: string; icon: TechIconName }[];
