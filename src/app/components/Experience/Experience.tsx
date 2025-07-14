'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getExperienceData } from '@/app/utils/data/experience';
import { ExperienceProps } from '@/app/types/components';
import { formatDateRange } from '@/app/utils/helpers/format';
import { ScrollAnimation, StaggerAnimation } from '@/app/components';

import styles from './Experience.module.scss';

interface GroupedExperience {
  company: string;
  logo: string;
  location: string;
  experiences: any[];
  totalDuration: string;
}

export default function Experience({
  experiences,
  showLogos = true,
}: ExperienceProps = {}) {
  const experienceData = experiences || getExperienceData();
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(
    new Set()
  );

  if (!experienceData || experienceData.length === 0) {
    return null;
  }

  // Group experiences by company
  const groupedExperiences: GroupedExperience[] = experienceData.reduce(
    (acc, experience) => {
      const existingGroup = acc.find(
        (group) => group.company === experience.company
      );

      if (existingGroup) {
        existingGroup.experiences.push(experience);
      } else {
        acc.push({
          company: experience.company,
          logo: experience.logo || '/images/default-company.png',
          location: experience.location,
          experiences: [experience],
          totalDuration: (() => {
            const companyExperiences = experienceData.filter(
              (exp) => exp.company === experience.company
            );
            const earliestStart =
              companyExperiences.sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )[0]?.startDate || experience.startDate;

            // Check if any experience is ongoing (no end date)
            const hasOngoingExperience = companyExperiences.some(
              (exp) => !exp.endDate
            );

            if (hasOngoingExperience) {
              // If any role is ongoing, show "Present" as end date
              return formatDateRange(earliestStart, undefined);
            } else {
              // If all roles are completed, find the latest end date
              const latestEndDate = companyExperiences
                .filter((exp) => exp.endDate) // Only completed experiences
                .sort(
                  (a, b) =>
                    new Date(b.endDate!).getTime() -
                    new Date(a.endDate!).getTime()
                )[0]?.endDate;

              return formatDateRange(earliestStart, latestEndDate);
            }
          })(),
        });
      }

      return acc;
    },
    [] as GroupedExperience[]
  );

  // Sort experiences within each group by date (newest first)
  groupedExperiences.forEach((group) => {
    group.experiences.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  });

  const toggleCompanyExpansion = (companyName: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(companyName)) {
      newExpanded.delete(companyName);
    } else {
      newExpanded.add(companyName);
    }
    setExpandedCompanies(newExpanded);
  };

  const getVisibleExperiences = (companyGroup: GroupedExperience) => {
    const isExpanded = expandedCompanies.has(companyGroup.company);
    return isExpanded
      ? companyGroup.experiences
      : [companyGroup.experiences[0]];
  };

  return (
    <>
      <ScrollAnimation animation='fadeIn' duration={0.8} scrollReveal={true}>
        <div className='title'>
          <h3>Experience</h3>
        </div>
      </ScrollAnimation>
      <StaggerAnimation staggerDelay={0.3} useIntersectionObserver={true}>
        <div className={styles.experienceContainer}>
          {groupedExperiences.map((companyGroup, companyIndex) => {
            const hasMultipleRoles = companyGroup.experiences.length > 1;
            const isExpanded = expandedCompanies.has(companyGroup.company);
            const visibleExperiences = getVisibleExperiences(companyGroup);

            return (
              <div className={styles.companyCard} key={companyGroup.company}>
                <ScrollAnimation
                  animation='slideUp'
                  duration={0.8}
                  delay={companyIndex * 0.1}
                >
                  <div className={styles.companyHeader}>
                    {showLogos && (
                      <div className={styles.companyLogo}>
                        <Image
                          src={companyGroup.logo}
                          alt={`${companyGroup.company} Logo`}
                          loading='lazy'
                          width={80}
                          height={80}
                        />
                      </div>
                    )}
                    <div className={styles.companyInfo}>
                      <h4>{companyGroup.company}</h4>
                      <p className={styles.companyLocation}>
                        {companyGroup.location}
                      </p>
                      <span className={styles.companyDuration}>
                        {companyGroup.totalDuration}
                      </span>
                      {hasMultipleRoles && (
                        <div className={styles.roleCount}>
                          {companyGroup.experiences.length} role
                          {companyGroup.experiences.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    {hasMultipleRoles && (
                      <button
                        className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
                        onClick={() =>
                          toggleCompanyExpansion(companyGroup.company)
                        }
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${companyGroup.company} roles`}
                      >
                        <span className={styles.expandIcon}>
                          {isExpanded ? '−' : '+'}
                        </span>
                        <span className={styles.expandText}>
                          {isExpanded
                            ? 'Show Less'
                            : `Show ${companyGroup.experiences.length - 1} More`}
                        </span>
                      </button>
                    )}
                  </div>
                </ScrollAnimation>

                <div className={styles.rolesContainer}>
                  {visibleExperiences.map((experience, roleIndex) => (
                    <ScrollAnimation
                      animation='slideRight'
                      duration={0.6}
                      delay={companyIndex * 0.1 + roleIndex * 0.1}
                      key={experience.id}
                    >
                      <div
                        className={`${styles.roleCard} ${roleIndex > 0 ? styles.additionalRole : ''}`}
                      >
                        <div className={styles.roleHeader}>
                          <div className={styles.roleInfo}>
                            <h5>{experience.position}</h5>
                            <span className={styles.roleDuration}>
                              {formatDateRange(
                                experience.startDate,
                                experience.endDate
                              )}
                            </span>
                          </div>
                          <div className={styles.roleType}>Full Time</div>
                        </div>
                        <div className={styles.roleDescription}>
                          <p>{experience.description}</p>
                        </div>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </StaggerAnimation>
    </>
  );
}
