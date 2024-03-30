import { getSkillsArray } from '@/app/utils';

export default function Skills() {
  const skills = getSkillsArray();
  return (
    <div className='skills'>
      {skills.map((el) => (
        <span className='skills__pill' key={el.id}>
          {el.icon && <i className={`${el.icon} skills__pill--icon`} />}
          {el.name}
        </span>
      ))}
    </div>
  );
}
