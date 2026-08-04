import { skillsData } from '@/app/utils/data/skills';
import Icon from '@/app/components/Icon/Icon';

import styles from './Skills.module.scss';

export default function Skills() {
  return (
    <div className={styles.skills}>
      {skillsData.map((skill) => (
        <span className={styles.skillsPill} key={skill.name}>
          <Icon name={skill.icon} className={styles.skillsPillIcon} />
          {skill.name}
        </span>
      ))}
    </div>
  );
}
