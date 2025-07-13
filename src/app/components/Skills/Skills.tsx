import { getSkillsArray } from '@/app/utils';
import { SkillsProps } from '@/app/types/components';

import styles from './Skills.module.scss';

export default function Skills({
  skills,
  showCategories = false,
}: SkillsProps = {}) {
  const skillsData = skills || getSkillsArray();

  return (
    <div className={styles.skills}>
      {skillsData.map((skill) => (
        <span
          className={styles.skillsPill}
          key={skill.id}
          data-category={showCategories ? skill.category : undefined}
        >
          {skill.icon && (
            <i className={`${skill.icon} ${styles.skillsPillIcon}`} />
          )}
          {skill.name}
        </span>
      ))}
    </div>
  );
}
