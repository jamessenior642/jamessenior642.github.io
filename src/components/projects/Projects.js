import React, { useState } from 'react';
import BodySection from '../bodysection/BodySection';
import './Projects.css'; // Import the CSS file

// Resized, compressed WebP copies of the screenshots (originals are kept in src/pics)
import news from '../../pics/web/news.webp';
import ytclone from '../../pics/web/ytclone.webp';
import coveyImg from '../../pics/web/covey.webp';
import jmarket from '../../pics/web/jmarket.webp';
import freecellImage from '../../pics/web/freecell.webp';
import bridgitImage from '../../pics/web/bridgit.webp';
import concentrationImage from '../../pics/web/concentration.webp';
import froggerImage from '../../pics/web/frogger.webp';

const PER_PAGE = 4;

// Newest first, so page 1 is recent work and page 2 is earlier class projects.
// The first link is where the image itself goes; imgCrop trims screenshots that include browser UI.
const projects = [
  {
    title: 'AI News Summarizer',
    description: 'Paste in a news article\'s URL and get a summary from a BART model I fine-tuned on news data.',
    tech: 'Python, TypeScript, React, Node.js, MongoDB, AWS',
    year: '2025',
    imgSrc: news,
    links: [
      { label: 'live site', href: 'https://newssumm.netlify.app' },
      { label: 'frontend', href: 'https://github.com/jamessenior642/newsfeed-frontend' },
      { label: 'backend', href: 'https://github.com/jamessenior642/newsfeed-backend' },
    ],
  },
  {
    title: 'YouTube Clone',
    description: 'A video platform where you sign in with Google and upload your own videos.',
    tech: 'TypeScript, Firebase, Google Cloud Run',
    year: '2024',
    imgSrc: ytclone,
    imgCrop: { objectPosition: 'center 63%' }, // start below the browser's tabs and address bar
    links: [{ label: 'code', href: 'https://github.com/jamessenior642/youtube-clone' }],
  },
  {
    title: 'Covey.Town Drawing',
    description: 'Added a drawing canvas and a shared gallery to Covey.Town, a virtual social space.',
    tech: 'TypeScript, React, Node.js',
    year: '2024',
    imgSrc: coveyImg,
    links: [{ label: 'code', href: 'https://github.com/neu-cs4530/spring24-project-team-101' }],
  },
  {
    title: 'Jungle Market',
    description: 'An online marketplace for browsing products and leaving reviews.',
    tech: 'React, Node.js, MongoDB',
    year: '2023',
    imgSrc: jmarket,
    imgCrop: { transform: 'scale(1.2)', transformOrigin: 'center bottom' }, // zoom past the browser bar
    links: [{ label: 'code', href: 'https://github.com/jamessenior642/webdev-final-project' }],
  },
  {
    title: 'FreeCell',
    description: 'The solitaire card game, built around a model-view-controller design.',
    tech: 'Java',
    year: '2022',
    imgSrc: freecellImage,
    links: [{ label: 'code', href: 'https://github.com/jamessenior642/Freecell' }],
  },
  {
    title: 'Bridgit',
    description: 'A two-player board game: the first player to build a path across the board wins.',
    tech: 'Java',
    year: '2021',
    imgSrc: bridgitImage,
    links: [{ label: 'code', href: 'https://github.com/jamessenior642/Bridgit' }],
  },
  {
    title: 'Concentration',
    description: 'The memory card game: clear the deck by finding matching pairs.',
    tech: 'Java',
    year: '2021',
    imgSrc: concentrationImage,
    links: [{ label: 'code', href: 'https://github.com/jamessenior642/Concentration' }],
  },
  {
    title: 'Frogger',
    description: 'The arcade classic: get across the road and the river to the other side.',
    tech: 'Racket',
    year: '2021',
    imgSrc: froggerImage,
    links: [{ label: 'code', href: 'https://github.com/jamessenior642/Frogger' }],
  },
];

const pageCount = Math.ceil(projects.length / PER_PAGE);

const Projects = () => {
  const [page, setPage] = useState(0);
  const pages = Array.from({ length: pageCount }, (_, i) => projects.slice(i * PER_PAGE, (i + 1) * PER_PAGE));

  return (
    <BodySection id="projects" title="PROJECTS">
      {/* Every page is laid out in the same spot and only the current one is shown, so the section
          keeps the height of the tallest page and the page buttons don't jump when switching */}
      <div className="project-page-stack">
        {pages.map((pageProjects, i) => (
          <div
            key={i}
            className={`project-grid${i === page ? ' is-current' : ''}`}
            aria-hidden={i !== page}
            inert={i !== page ? '' : undefined}
          >
            {pageProjects.map((project) => (
              <article className="project" key={project.title}>
                {/* The screenshot, printed newspaper-style; hovering fades it back to the original */}
                <a
                  className="project-print"
                  href={project.links[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title}: ${project.links[0].label}`}
                >
                  <img src={project.imgSrc} alt="" style={project.imgCrop} />
                </a>
                <h3 className="project-name">{project.title}</h3>
                <p className="project-blurb">{project.description}</p>
                <p className="project-meta">
                  <span>{project.tech}</span>
                  <span>{project.year}</span>
                </p>
                <p className="project-links">
                  {project.links.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  ))}
                </p>
              </article>
            ))}
          </div>
        ))}
      </div>

      <nav className="project-pages" aria-label="Project pages">
        <button type="button" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Previous page">‹</button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            className={i === page ? 'is-current' : ''}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
            aria-current={i === page ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
        <button type="button" onClick={() => setPage(page + 1)} disabled={page === pageCount - 1} aria-label="Next page">›</button>
      </nav>
    </BodySection>
  );
};

export default Projects;
