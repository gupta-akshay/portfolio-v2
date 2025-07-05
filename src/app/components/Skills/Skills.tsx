import { getSkillsArray } from '@/app/utils';
import { SkillsProps } from '@/app/types/components';

export default function Skills({
  skills,
  showCategories = false,
}: SkillsProps = {}) {
  const skillsData = skills || getSkillsArray();

  return (
    <div className='skills'>
      {skillsData.map((skill) => (
        <span
          className='skills__pill'
          key={skill.id}
          data-category={showCategories ? skill.category : undefined}
        >
          {skill.icon && <i className={`${skill.icon} skills__pill--icon`} />}
          {skill.name}
        </span>
      ))}
    </div>
  );
}
