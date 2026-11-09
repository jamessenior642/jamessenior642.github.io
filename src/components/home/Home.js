import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import jamesImage from '../../pics/James_1 (1).jpg';
import jamesRight from '../../pics/James_2.jpg';
import jamesLeft from '../../pics/James_3.jpg';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import './Home.css'; // Import the CSS file

const SHORT_SCREEN_HEIGHT = 600; // px; below this the hero uses smaller text and spacing

const Home = () => {
  const [currentImage, setCurrentImage] = useState(jamesImage);

  // Instagram's in-app browser resizes the page as its toolbar hides on scroll, which made
  // the photo (sized to the screen height) grow mid-scroll. So measure the height once, and
  // only re-measure when the width changes (phone rotated) or on devices with a mouse.
  const [heroHeight, setHeroHeight] = useState(() => window.innerHeight);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (isTouch && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      setHeroHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    const screenWidth = window.innerWidth;
    const mouseX = e.clientX;

    if (mouseX < screenWidth / 3) {
      setCurrentImage(jamesLeft);
    } else if (mouseX > 2 * screenWidth / 3) {
      setCurrentImage(jamesRight);
    } else {
      setCurrentImage(jamesImage);
    }
  };

  return (
    <Container 
      fluid 
      className={`home-hero d-flex flex-column align-items-center justify-content-center fade-in${heroHeight <= SHORT_SCREEN_HEIGHT ? ' is-short' : ''}`}
      style={{ textAlign: 'center', '--hero-h': `${heroHeight}px` }}
      onMouseMove={handleMouseMove}
    >
      <h1 className="home-name" style={{ fontFamily: 'Merriweather' }}>James Senior</h1>
      {/* Each half stays on one line, so on phones it breaks after "in QA," and nowhere else */}
      <p className="subheading">
        <span className="nowrap">I'm a software engineer in QA,</span>{' '}
        <span className="nowrap">based in New York.</span>
      </p>
      <div><p className="type">Welcome to my website.</p></div>
      <img
        className="photo"
        width="232"
        src={currentImage}
        alt="James Senior"
      />
      <div className="links mt-4">
        <a href="mailto:senior.j@northeastern.edu" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaEnvelope size={30} />
        </a>
        <a href="https://github.com/jamessenior642" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaGithub size={30} />
        </a>
        <a href="https://www.linkedin.com/in/james-senior-5b9a99205/" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaLinkedin size={30} />
        </a>
      </div>
    </Container>
  );
};

export default Home;
