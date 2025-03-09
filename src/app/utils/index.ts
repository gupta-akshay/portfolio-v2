import { KeyboardEvent } from 'react';

export const getSkillsArray = () => [
  {
    id: 'javascript',
    name: 'Javascript',
    icon: 'devicon-javascript-plain',
  },
  {
    id: 'typescript',
    name: 'Typescript',
    icon: 'devicon-typescript-plain',
  },
  {
    id: 'node.js',
    name: 'Node.js',
    icon: 'devicon-nodejs-plain',
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: 'devicon-express-original',
  },
  {
    id: 'sailsjs',
    name: 'Sails.js',
    icon: 'devicon-nodejs-plain',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'devicon-nextjs-plain',
  },
  {
    id: 'gatsby',
    name: 'Gatsby.js',
    icon: 'devicon-gatsby-plain',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: 'devicon-postgresql-plain',
  },
  {
    id: 'elasticsearch',
    name: 'ElasticSearch',
    icon: 'devicon-elasticsearch-plain',
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: 'devicon-redis-plain',
  },
  {
    id: 'firestore',
    name: 'Firestore',
    icon: 'devicon-firebase-plain',
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    icon: 'devicon-googlecloud-plain',
  },
  {
    id: 'rabbitMQ',
    name: 'RabbitMQ',
    icon: 'devicon-rabbitmq-original',
  },
  {
    id: 'html',
    name: 'HTML',
    icon: 'devicon-html5-plain',
  },
  {
    id: 'css',
    name: 'CSS',
    icon: 'devicon-css3-plain',
  },
  {
    id: 'react',
    name: 'React',
    icon: 'devicon-react-original',
  },
  {
    id: 'redux',
    name: 'Redux',
    icon: 'devicon-redux-original',
  },
  {
    id: 'sass',
    name: 'Sass',
    icon: 'devicon-sass-original',
  },
  {
    id: 'ant-design',
    name: 'Ant Design',
    icon: 'devicon-antdesign-plain',
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    icon: 'devicon-amazonwebservices-plain-wordmark',
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: 'devicon-googlecloud-plain',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'devicon-docker-plain',
  },
  {
    id: 'argocd',
    name: 'ArgoCD',
    icon: 'devicon-argocd-plain',
  },
  {
    id: 'kibana',
    name: 'Kibana',
    icon: 'devicon-kibana-plain',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    icon: 'devicon-sentry-plain',
  },
  {
    id: 'jest',
    name: 'Jest',
    icon: 'devicon-jest-plain',
  },
  {
    id: 'mocha',
    name: 'Mocha',
    icon: 'devicon-mocha-plain',
  },
  {
    id: 'git',
    name: 'Git',
    icon: 'devicon-git-plain',
  },
];

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day: string = date.getUTCDate().toString().padStart(2, '0');
  const month: string = date.toLocaleString('en-US', { month: 'short' });
  const year: number = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export const handleKeyDown = (
  e: KeyboardEvent<HTMLButtonElement>,
  callback: Function
) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};
