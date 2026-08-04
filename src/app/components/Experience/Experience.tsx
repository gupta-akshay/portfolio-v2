'use client';

import { useState } from 'react';
import Image from 'next/image';
import { experienceData } from '@/app/utils/data/experience';
import { formatDateRange } from '@/app/utils/helpers/format';

import styles from './Experience.module.scss';

export default function Experience() {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(
    new Set()
  );

  const toggleCompany = (company: string) => {
    setExpandedCompanies((current) => {
      const next = new Set(current);
      if (next.has(company)) next.delete(company);
      else next.add(company);
      return next;
    });
  };

  return (
    <>
      <div className='title'>
        <h3>Experience</h3>
      </div>
      <div className={styles.experienceContainer}>
        {experienceData.map((company) => {
          const hasMultipleRoles = company.roles.length > 1;
          const isExpanded = expandedCompanies.has(company.company);
          const visibleRoles = isExpanded
            ? company.roles
            : company.roles.slice(0, 1);

          return (
            <div className={styles.companyCard} key={company.company}>
              <div className={styles.companyHeader}>
                <div className={styles.companyLogo}>
                  <Image
                    src={company.logo}
                    alt={`${company.company} Logo`}
                    loading='lazy'
                    width={80}
                    height={80}
                  />
                </div>
                <div className={styles.companyInfo}>
                  <h4>{company.company}</h4>
                  <p className={styles.companyLocation}>{company.location}</p>
                  <span className={styles.companyDuration}>
                    {formatDateRange(company.startDate, company.endDate)}
                  </span>
                  {hasMultipleRoles && (
                    <div className={styles.roleCount}>
                      {company.roles.length} roles
                    </div>
                  )}
                </div>
                {hasMultipleRoles && (
                  <button
                    className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
                    onClick={() => toggleCompany(company.company)}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${company.company} roles`}
                  >
                    <span className={styles.expandIcon}>
                      {isExpanded ? '−' : '+'}
                    </span>
                    <span className={styles.expandText}>
                      {isExpanded
                        ? 'Show Less'
                        : `Show ${company.roles.length - 1} More`}
                    </span>
                  </button>
                )}
              </div>
              <div className={styles.rolesContainer}>
                {visibleRoles.map((role, roleIndex) => (
                  <div
                    className={`${styles.roleCard} ${roleIndex > 0 ? styles.additionalRole : ''}`}
                    key={role.id}
                  >
                    <div className={styles.roleHeader}>
                      <div className={styles.roleInfo}>
                        <h5>{role.position}</h5>
                        <span className={styles.roleDuration}>
                          {formatDateRange(role.startDate, role.endDate)}
                        </span>
                      </div>
                      <div className={styles.roleType}>Full Time</div>
                    </div>
                    <div className={styles.roleDescription}>
                      <p>{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
