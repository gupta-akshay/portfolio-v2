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
    id: 'node.js',
    name: 'Node.js',
    icon: 'devicon-nodejs-plain',
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
    id: 'firebase',
    name: 'Firebase',
    icon: 'devicon-firebase-plain',
  },
  {
    id: 'rabbitMQ',
    name: 'RabbitMQ',
    icon: 'devicon-rabbitmq-original',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'devicon-docker-plain',
  },
  {
    id: 'gcf',
    name: 'Google Cloud Functions',
    icon: 'devicon-googlecloud-plain',
  },
  {
    id: 'pubsub',
    name: 'Google Pub/Sub',
    icon: 'devicon-googlecloud-plain',
  },
  {
    id: 'cloudtask',
    name: 'Google Cloud Task',
    icon: 'devicon-googlecloud-plain',
  },
  {
    id: 'git',
    name: 'Git',
    icon: 'devicon-git-plain',
  },
  {
    id: 'ant-design',
    name: 'Ant Design',
    icon: 'devicon-antdesign-plain',
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

export const musicTracks = [
  {
    id: 'Fitoor_-_Yeh_Fitoor_Mera_A-Shay_Remix_Ft._Yash_Kapoor_th4cme',
    title: 'Yeh Fitoor Mera - Remix',
    artist: 'A-Shay Ft. Yash Kapoor',
    cloudinaryPublicId:
      'Fitoor_-_Yeh_Fitoor_Mera_A-Shay_Remix_Ft._Yash_Kapoor_th4cme',
  },
  {
    id: 'RHTDM_-_Zara_Zara_A-Shay_Remix_Final_Mix_1_kwumvv',
    title: 'RHTDM: Zara Zara - Remix',
    artist: 'A-Shay',
    cloudinaryPublicId: 'RHTDM_-_Zara_Zara_A-Shay_Remix_Final_Mix_1_kwumvv',
  },
  {
    id: 'Coldplay_-_Yellow_A-Shay_Remix_cofyk2',
    title: 'Coldplay: Yellow - Remix',
    artist: 'A-Shay',
    cloudinaryPublicId: 'Coldplay_-_Yellow_A-Shay_Remix_cofyk2',
  },
  {
    id: 'Ed_Sheeran_-_Shape_of_You_A-Shay_Flip_bmkejo',
    title: 'Ed Sheeran: Shape of You - Reggae Flip',
    artist: 'A-Shay',
    cloudinaryPublicId: 'Ed_Sheeran_-_Shape_of_You_A-Shay_Flip_bmkejo',
  },
  {
    id: 'Ed_Sheeran_-_Shape_Of_You_A-Shay_Remix_Final_Mix_x05fv5',
    title: 'Ed Sheeran: Shape of You - Remix',
    artist: 'A-Shay',
    cloudinaryPublicId:
      'Ed_Sheeran_-_Shape_Of_You_A-Shay_Remix_Final_Mix_x05fv5',
  },
  {
    id: 'Humari_Adhuri_Kahani_-_Humnava_A-Shay_Remix_bnsym7',
    title: 'Humnava - Remix',
    artist: 'A-Shay',
    cloudinaryPublicId: 'Humari_Adhuri_Kahani_-_Humnava_A-Shay_Remix_bnsym7',
  },
  {
    id: 'Mera_Joota_Hai_Japani_A-Shay_Edit_lzylai',
    title: 'Mera Joota Hai Japani - Edit',
    artist: 'A-Shay',
    cloudinaryPublicId: 'Mera_Joota_Hai_Japani_A-Shay_Edit_lzylai',
  },
];
