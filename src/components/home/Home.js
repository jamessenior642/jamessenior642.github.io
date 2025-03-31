import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import jamesImage from '../../pics/James_1 (1).jpg';
import jamesRight from '../../pics/James_2.jpg';
import jamesLeft from '../../pics/James_3.jpg';
import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Home.css'; // Import the CSS file

const Home = () => {
  const [currentImage, setCurrentImage] = useState(jamesImage);

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
      className="d-flex flex-column align-items-center justify-content-center fade-in" 
      style={{ height: '100vh', textAlign: 'center' }}
      onMouseMove={handleMouseMove}
    >
      <h1 style={{ fontFamily: 'Merriweather', fontSize: '50px' }}>James Senior</h1>
      <p className="subheading">I'm a Computer Science graduate from Northeastern University.</p>
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
        <a href="https://www.instagram.com/jamessenior__/" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaInstagram size={30} />
        </a>
      </div>
    </Container>
  );
};

export default Home;
