import Image from 'next/image';
import { getExperienceData } from '@/app/utils/data/experience';
import { ExperienceProps } from '@/app/types/components';
import { formatDateRange } from '@/app/utils/helpers/format';

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
      <div className='title'>
        <h3>Experience</h3>
      </div>
      <div className='experience-box'>
        {experienceData.map((experience) => (
          <div className='experience-row' key={experience.id}>
            <div className='row'>
              {showLogos && (
                <div className='col-sm-3 col-md-3 col-xl-2'>
                  <div className='experience-row--left'>
                    <Image
                      src={experience.logo || '/images/default-company.png'}
                      alt={`${experience.company} Logo`}
                      loading='lazy'
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
              )}
              <div
                className={showLogos ? 'col-sm-9 col-md-9 col-xl-10' : 'col-12'}
              >
                <div className='experience-row--right'>
                  <h6>{experience.position}</h6>
                  <label>
                    {experience.company} | {experience.location} |{' '}
                    {formatDateRange(experience.startDate, experience.endDate)}
                  </label>
                  <div className='experience-row--right__type'>Full Time</div>
                  <div className='experience-row--right__content'>
                    <p>{experience.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
