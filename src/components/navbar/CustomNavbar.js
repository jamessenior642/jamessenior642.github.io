import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { HashLink as Link } from 'react-router-hash-link';
import './CustomNavbar.css'; // Ensure this file is imported

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
        <Navbar.Brand href="#">
          <h3 className="spinningname" id="name" style={{ fontFamily: 'Merriweather', fontSize: '25px', margin: '0' }}>JS</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
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
