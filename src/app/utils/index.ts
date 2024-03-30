export const activeSection = () => {
  window?.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.pp-section');
    const navLi = document.querySelectorAll('.nav-menu li');
    let current = '';
    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id') || '';
      }
    });
    navLi.forEach((li) => {
      li.classList.remove('active');
      if (
        li.getElementsByTagName('a')[0].getAttribute('href') == `#${current}`
      ) {
        li.classList.add('active');
      }
    });
  });
};

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
