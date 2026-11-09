import React, { useState } from 'react';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import BodySection from '../bodysection/BodySection';
import './Projects.css'; // Import the CSS file

import freecellImage from '../../pics/freecell2.jpg';
import bridgitImage from '../../pics/bridgitpic2.jpeg';
import concentrationImage from '../../pics/concentrationpic2.jpg';
import froggerImage from '../../pics/froggerpic2.jpg';
import websiteImage from '../../pics/websitepic3.jpg';
import coveyImg from '../../pics/covey.png';
import ytclone from '../../pics/ytclone2.jpeg';
import jmarket from '../../pics/jmarket2.jpeg';
import news from '../../pics/news.jpg';

const projectData = [
  {
    title: 'AI News Summarizer',
    description: 'Created a website that summarizes news articles. The user can input a URL and the website will return a summary of the article created by a custom AI model.',
    imgSrc: news,
    // We won't use `link` here, because we want a modal instead
    tech: 'Typescript, React, Node.js, MongoDB, AWS, Python | January 2025',
  },
  {
    title: 'YouTube Clone',
    description: 'Created a basic clone of YouTube, where the user can upload videos in their Google account.',
    imgSrc: ytclone,
    link: 'https://github.com/jamessenior642/youtube-clone',
    tech: 'Typescript, Firebase, Google Cloud Run | September 2024',
  },
  {
    title: 'Covey.town Drawing',
    description: 'Added a drawing feature to the online social platform Covey.town, as well as adding a multiplayer game.',
    imgSrc: coveyImg,
    link: 'https://github.com/neu-cs4530/spring24-project-team-101',
    tech: 'Typescript, React | April 2024',
  },
  {
    title: 'Jungle Market Website',
    description: 'Final project for WebDev. Allows user to browse products, and leave reviews on them.',
    imgSrc: jmarket,
    link: 'https://github.com/jamessenior642/webdev-final-project',
    tech: 'React, Node.js, MongoDB | April 2023',
  },
  {
    title: 'Freecell',
    description: 'Created a version of the card game Freecell. Used the Model-View-Controller design scheme.',
    imgSrc: freecellImage,
    link: 'https://github.com/jamessenior642/Freecell',
    tech: 'Java | February 2022',
  },
  {
    title: 'Bridgit',
    description: 'Created a version of the game Bridgit. A two player game where the first player to fill a path across the board wins.',
    imgSrc: bridgitImage,
    link: 'https://github.com/jamessenior642/Bridgit',
    tech: 'Java | November 2021',
  },
  {
    title: 'Concentration',
    description: 'Created a version of the card game Concentration. The player must remove all of the cards in the deck by removing pairs of cards.',
    imgSrc: concentrationImage,
    link: 'https://github.com/jamessenior642/Concentration',
    tech: 'Java | October 2021',
  },
  {
    title: 'Frogger',
    description: 'Created a version of Frogger. The player must cross a set of obstacles and reach the other side to win.',
    imgSrc: froggerImage,
    link: 'https://github.com/jamessenior642/Frogger',
    tech: 'Racket ISL | June 2021',
  },
  {
    title: 'My Website',
    description: 'Very meta of me. Created a personal website to display my portfolio as well as my personality.',
    imgSrc: websiteImage,
    link: 'https://github.com/jamessenior642/jamessenior642.github.io',
    tech: 'React | January 2022',
  },
];

const Projects = () => {
  // State to control News Summarizer modal
  const [showNewsModal, setShowNewsModal] = useState(false);

  // Handlers for showing/hiding the News Summarizer modal
  const handleShowNewsModal = () => setShowNewsModal(true);
  const handleCloseNewsModal = () => setShowNewsModal(false);

  return (
    <BodySection id="projects" title="PROJECTS">
      <Row>
        {projectData.map((project, index) => {
          // For the news summarizer project, we open a modal instead of using a link
          if (project.title === 'AI News Summarizer') {
            return (
              <Col xs={12} sm={6} md={4} className="mb-4" key={index}>
                <Card className="h-100 project-card" onClick={handleShowNewsModal} style={{ cursor: 'pointer' }}>
                  <Card.Img
                    variant="top"
                    src={project.imgSrc}
                    alt={`${project.title} Project`}
                    className="card-img-top"
                  />
                  <Card.Body>
                    <Card.Title className="project-title">{project.title}</Card.Title>
                    <Card.Text>{project.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">Used: {project.tech}</small>
                  </Card.Footer>
                </Card>
              </Col>
            );
          } else {
            // For all other projects, keep the anchor approach
            return (
              <Col xs={12} sm={6} md={4} className="mb-4" key={index}>
                <Card className="h-100 project-card">
                  <a
                    href={project.link}
                    target="_blank"
                    className="stretched-link"
                    aria-label={`${project.title} on GitHub`}
                    rel="noopener noreferrer"
                  ></a>
                  <Card.Img
                    variant="top"
                    src={project.imgSrc}
                    alt={`${project.title} Project`}
                    className="card-img-top"
                  />
                  <Card.Body>
                    <Card.Title className="project-title">{project.title}</Card.Title>
                    <Card.Text>{project.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">Used: {project.tech}</small>
                  </Card.Footer>
                </Card>
              </Col>
            );
          }
        })}
      </Row>

      {/* MODAL FOR NEWS SUMMARIZER */}
      <Modal show={showNewsModal} onHide={handleCloseNewsModal}>
        <Modal.Header closeButton>
          <Modal.Title>AI News Summarizer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This project summarizes news articles based on an AI model I trained using Python. You
            can visit the live website or check out the front-end and back-end
            repositories below.  Note that you need to log in to submit a summary.
          </p>
          <div className="d-grid gap-2">
            <Button
              variant="dark"
              href="https://newssumm.netlify.app"  // <-- Update to your actual live site
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </Button>
            <Button
              variant="outline-dark"
              href="https://github.com/jamessenior642/newsfeed-frontend"
              target="_blank"
              rel="noopener noreferrer"
            >
              Frontend Repo
            </Button>
            <Button
              variant="outline-dark"
              href="https://github.com/jamessenior642/newsfeed-backend"
              target="_blank"
              rel="noopener noreferrer"
            >
              Backend Repo
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </BodySection>
  );
};

export default Projects;
