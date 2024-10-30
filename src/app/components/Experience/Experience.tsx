import Image from 'next/image';
import data from './data';

export default function Experience() {
  return (
    <>
      <div className='title'>
        <h3>Experience</h3>
      </div>
      <div className='experience-box'>
        {data.map((experience) => (
          <div className='experience-row' key={experience.id}>
            <div className='row'>
              <div className='col-sm-3 col-md-3 col-xl-2'>
                <div className='experience-row--left'>
                  <Image
                    src={experience.imgSrc}
                    alt='Company Logo'
                    loading='lazy'
                    width={120}
                    height={120}
                  />
                </div>
              </div>
              <div className='col-sm-9 col-md-9 col-xl-10'>
                <div className='experience-row--right'>
                  <h6>{experience.role}</h6>
                  <label>
                    {experience.company} | {experience.location} |{' '}
                    {experience.timeInRole}
                  </label>
                  <div className='experience-row--right__type'>Full Time</div>
                  <div
                    className='experience-row--right__content'
                    dangerouslySetInnerHTML={{
                      __html: experience.responsibilities,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
