import { getSkillsArray } from '@/app/utils';
import { SkillsProps } from '@/app/types/components';
import { StaggerAnimation, ScrollAnimation } from '@/app/components';

import styles from './Skills.module.scss';

export default function Skills({
  skills,
  showCategories = false,
}: SkillsProps = {}) {
  const skillsData = skills || getSkillsArray();

  return (
    <StaggerAnimation staggerDelay={0.05} useIntersectionObserver={true}>
      <div className={styles.skills}>
        {skillsData.map((skill) => (
          <ScrollAnimation key={skill.id} animation='scale' duration={0.4}>
            <span
              className={styles.skillsPill}
              data-category={showCategories ? skill.category : undefined}
            >
              {skill.icon && (
                <i className={`${skill.icon} ${styles.skillsPillIcon}`} />
              )}
              {skill.name}
            </span>
          </ScrollAnimation>
        ))}
      </div>
    </StaggerAnimation>
  );
}
