const SKILLS_ARR = [
  {
    id: 'javascript',
    name: 'Javascript',
  },
  {
    id: 'typescript',
    name: 'Typescript',
  },
  {
    id: 'html/css',
    name: 'Html/CSS',
  },
  {
    id: 'node.js',
    name: 'Node.js',
  },
  {
    id: 'react',
    name: 'React',
  },
  {
    id: 'redux',
    name: 'Redux',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
  },
  {
    id: 'redis',
    name: 'Redis',
  },
  {
    id: 'rabbitMQ',
    name: 'RabbitMQ',
  },
  {
    id: 'docker',
    name: 'Docker',
  },
  {
    id: 'gcf',
    name: 'Google Cloud Functions',
  },
  {
    id: 'pubsub',
    name: 'Google Pub/Sub',
  },
  {
    id: 'cloudtask',
    name: 'Google Cloud Task',
  },
  {
    id: 'elasticsearch',
    name: 'ElasticSearch',
  },
  {
    id: 'react-query',
    name: 'React-Query',
  },
  {
    id: 'firestore',
    name: 'Firestore',
  },
];

export default function Skills() {
  return (
    <div className='skills'>
      {SKILLS_ARR.map((el) => (
        <span className='skills__pill' key={el.id}>
          {el.name}
        </span>
      ))}
    </div>
  );
}
