import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { HashLink as Link } from 'react-router-hash-link';
import StaticLogo from './StaticLogo';
import './CustomNavbar.css'; // Ensure this file is imported

// three.js is large, so the 3D logo loads separately after the page renders
const ChromeLogo = lazy(() => import('./ChromeLogo'));

const sections = [
  { id: 'about', label: 'about' },
  { id: 'workhistory', label: 'experience' },
  { id: 'projects', label: 'projects' },
  { id: 'music', label: 'music' },
];

const CustomNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => setExpanded(false);

  // Highlight whichever section is currently at the top of the screen
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.innerHeight / 3;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      // The last section is short, so treat the bottom of the page as being in it
      if (atBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      let current = null;
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      });
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <Navbar fixed="top" expand="lg" variant="light" expanded={expanded} className="site-navbar">
      <Container>
        <Navbar.Brand href="#" aria-label="Back to top">
          <Suspense fallback={<StaticLogo />}>
            <ChromeLogo />
          </Suspense>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          aria-expanded={expanded}
          onClick={handleToggle}
          className={`site-toggler${expanded ? ' is-open' : ''}`}
        >
          {/* Two lines that turn into an X when the menu is open */}
          <span className="site-toggler-line" />
          <span className="site-toggler-line" />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {sections.map(({ id, label }) => (
              <Nav.Item className="nav-item" key={id}>
                <Nav.Link
                  as={Link}
                  to={`/#${id}`}
                  smooth
                  className="nav-link"
                  active={activeSection === id}
                  onClick={handleSelect}
                >
                  {label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
