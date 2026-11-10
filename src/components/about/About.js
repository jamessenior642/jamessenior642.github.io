import React from 'react';
import { Row, Col } from 'react-bootstrap';
import BodySection from '../bodysection/BodySection';
import './About.css'

const About = () => {
  return (
    <BodySection id="about" title="ABOUT ME">
      <p>
        Hello there. My name is James Senior (if you couldn't tell). 
        I'm a QA Engineer at SafeinHome, based in New York, where I spend my days making sure our software works the way it's supposed to.
        I graduated from Northeastern University in 2024 with a Bachelor of Science in Computer Science.
        Since I was young and would play around with Google, I've had a true love for computers and well-designed software.
        I also have a real love for math and problem-solving, which is what led me to CS in the first place, and it's still my favorite part of the job.
      </p>
      <Row>
        <Col sm={6}>
          <h3 className='bold-header'>Facts</h3>
          <ul>
            <li>Born in: Manhattan</li>
            <li>From: Northport, NY (Long Island)</li>
            <li>Middle Name: Vincent</li>
            <li>Education: B.S. Computer Science, Northeastern (2024)</li>
            <li>Honors: Dean's List</li>
          </ul>
        </Col>
        <Col sm={6}>
          <h3 className='bold-header'>Things I Enjoy</h3>
          <ul>
            <li>Computers</li>
            <li>Music (producing or listening)</li>
            <li>Working out (lifting or running)</li>
            <li>Movies (mainly watching)</li>
            <li>Cooking (and eating, major foodie)</li>
          </ul>
        </Col>
      </Row>
    </BodySection>
  );
};

export default About;
