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
    name: 'Typescript',
    icon: 'devicon-typescript-plain',
    category: 'programming',
  },
  {
    id: 'node.js',
    name: 'Node.js',
    icon: 'devicon-nodejs-plain',
    category: 'backend',
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: 'devicon-express-original',
    category: 'backend',
  },
  {
    id: 'sailsjs',
    name: 'Sails.js',
    icon: 'devicon-nodejs-plain',
    category: 'backend',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'devicon-nextjs-plain',
    category: 'frontend',
  },
  {
    id: 'gatsby',
    name: 'Gatsby.js',
    icon: 'devicon-gatsby-plain',
    category: 'frontend',
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
    id: 'html',
    name: 'HTML',
    icon: 'devicon-html5-plain',
    category: 'frontend',
  },
  {
    id: 'css',
    name: 'CSS',
    icon: 'devicon-css3-plain',
    category: 'frontend',
  },
  {
    id: 'react',
    name: 'React',
    icon: 'devicon-react-original',
    category: 'frontend',
  },
  {
    id: 'redux',
    name: 'Redux',
    icon: 'devicon-redux-original',
    category: 'frontend',
  },
  {
    id: 'sass',
    name: 'Sass',
    icon: 'devicon-sass-original',
    category: 'frontend',
  },
  {
    id: 'ant-design',
    name: 'Ant Design',
    icon: 'devicon-antdesign-plain',
    category: 'frontend',
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    icon: 'devicon-amazonwebservices-plain-wordmark',
    category: 'cloud',
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: 'devicon-googlecloud-plain',
    category: 'cloud',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'devicon-docker-plain',
    category: 'infrastructure',
  },
  {
    id: 'argocd',
    name: 'ArgoCD',
    icon: 'devicon-argocd-plain',
    category: 'infrastructure',
  },
  {
    id: 'kibana',
    name: 'Kibana',
    icon: 'devicon-kibana-plain',
    category: 'tools',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    icon: 'devicon-sentry-plain',
    category: 'tools',
  },
  {
    id: 'jest',
    name: 'Jest',
    icon: 'devicon-jest-plain',
    category: 'testing',
  },
  {
    id: 'mocha',
    name: 'Mocha',
    icon: 'devicon-mocha-plain',
    category: 'testing',
  },
  {
    id: 'git',
    name: 'Git',
    icon: 'devicon-git-plain',
    category: 'tools',
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
