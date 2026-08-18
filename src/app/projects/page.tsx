import Layout from '@/app/components/Layout';
import Icon from '@/app/components/Icon/Icon';
import { logger } from '@/app/utils/logger';
import { getSiteUrl } from '@/lib/site-url';
import { projects, projectsIntro } from '@/lib/site-content';
import { createPageMetadata } from '@/lib/metadata';

import styles from '../styles/sections/projectsSection.module.scss';

const siteUrl = getSiteUrl();
const GITHUB_USER = 'gupta-akshay';
const projectsDescription =
  'Open-source projects by Akshay Gupta — a PostgreSQL MCP server for AI assistants, a Waybar config for Omarchy and Hyprland, and a Zinit-based ZSH setup.';

// GitHub's own language colours, so the dot reads the same here as on the repo page.
const LANG_COLORS: Record<string, string> = {
  Go: '#00add8',
  Shell: '#89e051',
};

export const metadata = createPageMetadata({
  title: 'Projects',
  description: projectsDescription,
  socialTitle: 'Projects | Akshay Gupta',
  path: '/projects',
  imageAlt: 'Projects by Akshay Gupta - Open Source & Side Projects',
});

// Stars are decoration on top of a hand-written list, so every failure mode —
// rate limit, outage, offline build — degrades to a card without a count rather
// than to no card at all. Cached for a day; three requests against an
// unauthenticated budget of sixty per hour.
async function getStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repo}`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) {
      logger.warn(`GitHub API returned ${res.status} for ${repo}`);
      return null;
    }
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? null;
  } catch (error) {
    logger.warn(`Failed to fetch stars for ${repo}:`, error);
    return null;
  }
}

export default async function Projects() {
  const stars = await Promise.all(projects.map((p) => getStars(p.repo)));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects',
    description: projectsDescription,
    url: `${siteUrl}/projects`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareSourceCode',
          name: project.repo,
          description: project.tagline,
          codeRepository: `https://github.com/${GITHUB_USER}/${project.repo}`,
          programmingLanguage: project.language,
          license: 'https://opensource.org/licenses/MIT',
          author: { '@type': 'Person', name: 'Akshay Gupta' },
        },
      })),
    },
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id='projects'
        data-nav-tooltip='Projects'
        className='pp-section pp-scrollable section projects-section'
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <div className={styles.eyebrow}>Projects</div>

          <div className={`${styles.header} route-shell`}>
            <h1 className={styles.heading}>
              Open Source<span>.</span>
            </h1>
            <p className={styles.intro}>{projectsIntro}</p>
          </div>

          <h2 className={styles.srOnly}>Repositories</h2>

          <ul className={styles.grid}>
            {projects.map((project, index) => {
              const url = `https://github.com/${GITHUB_USER}/${project.repo}`;
              const starCount = stars[index];

              return (
                <li key={project.repo}>
                  <a
                    className={styles.card}
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${project.repo} on GitHub (opens in a new tab)`}
                  >
                    <div className={styles.meta}>
                      <span className={styles.language}>
                        <span
                          className={styles.langDot}
                          style={{
                            background:
                              LANG_COLORS[project.language] ?? 'currentColor',
                          }}
                          aria-hidden='true'
                        />
                        {project.language}
                      </span>

                      {starCount !== null && (
                        <span className={styles.stars}>
                          <Icon name='star' aria-hidden='true' />
                          {starCount}
                          <span className={styles.srOnly}>
                            {starCount === 1 ? ' star' : ' stars'}
                          </span>
                        </span>
                      )}

                      <span className={styles.licence}>{project.license}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{project.repo}</h3>
                    <p className={styles.cardText}>{project.tagline}</p>

                    <ul className={styles.techRow}>
                      {project.tech.map((tech) => (
                        <li key={tech} className={styles.techPill}>
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <span className={styles.cardLink} aria-hidden='true'>
                      <Icon name='github' />
                      View on GitHub
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className={styles.footerRow}>
            <a
              className='px-btn px-btn-theme'
              href={`https://github.com/${GITHUB_USER}?tab=repositories`}
              target='_blank'
              rel='noopener noreferrer'
            >
              All repositories on GitHub
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
