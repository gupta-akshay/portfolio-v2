import Image from 'next/image';
import { getExperienceData } from '@/app/utils/data/experience';
import { ExperienceProps } from '@/app/types/components';
import { formatDateRange } from '@/app/utils/helpers/format';
import { ScrollAnimation, StaggerAnimation } from '@/app/components';

import styles from './Experience.module.scss';

export default function Experience({
  experiences,
  showLogos = true,
}: ExperienceProps = {}) {
  const experienceData = experiences || getExperienceData();

  if (!experienceData || experienceData.length === 0) {
    return null;
  }

  return (
    <>
      <ScrollAnimation animation='fadeIn' duration={0.8} scrollReveal={true}>
        <div className='title'>
          <h3>Experience</h3>
        </div>
      </ScrollAnimation>
      <StaggerAnimation staggerDelay={0.2} useIntersectionObserver={true}>
        <div className={styles.experienceBox}>
          {experienceData.map((experience) => (
            <div className={styles.experienceRow} key={experience.id}>
              <div className='row'>
                {showLogos && (
                  <div className='col-sm-3 col-md-3 col-xl-2'>
                    <ScrollAnimation
                      animation='slideLeft'
                      duration={0.6}
                      parallax={true}
                      parallaxSpeed='slow'
                    >
                      <div className={styles.experienceRowLeft}>
                        <Image
                          src={experience.logo || '/images/default-company.png'}
                          alt={`${experience.company} Logo`}
                          loading='lazy'
                          width={120}
                          height={120}
                        />
                      </div>
                    </ScrollAnimation>
                  </div>
                )}
                <div
                  className={
                    showLogos ? 'col-sm-9 col-md-9 col-xl-10' : 'col-12'
                  }
                >
                  <ScrollAnimation animation='slideRight' duration={0.6}>
                    <div className={styles.experienceRowRight}>
                      <h6>{experience.position}</h6>
                      <label>
                        {experience.company} | {experience.location} |{' '}
                        {formatDateRange(
                          experience.startDate,
                          experience.endDate
                        )}
                      </label>
                      <div className={styles.experienceRowRightType}>
                        Full Time
                      </div>
                      <div className={styles.experienceRowRightContent}>
                        <p>{experience.description}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </div>
          ))}
        </div>
      </StaggerAnimation>
    </>
  );
}
