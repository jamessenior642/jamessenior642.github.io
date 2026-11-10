import React from 'react';
import BodySection from '../bodysection/BodySection';
import './WorkExperience.css';
import { Container } from 'react-bootstrap';

const workExperienceData = [
  {
    company: 'SafeinHome',
    title: 'QA Engineer II',
    date: 'April 2026 – Present',
    description: 'Testing and validating SafeinHome\'s software, investigating bugs, and working closely with the development team to ensure quality releases.',
  },
  {
    company: 'Imagn Images',
    title: 'Contract Software Engineer',
    date: 'June 2025 – December 2025',
    description: 'Contributed to full-stack web development using Django/Python backends and Angular.js/React frontends. Delivered new features and UI improvements for the public image site and internal photo assignment system.',
  },
  {
    company: 'Power of Patients',
    title: 'UI/UX Engineer (Micro-Internship)',
    date: 'March 2025 – May 2025',
    description: 'Designed UI improvements and animations for a TBI patient dashboard using React and TypeScript, and implemented new welcome and registration page designs.',
  },
  {
    company: 'Khoury College of Computer Sciences',
    title: 'Teaching Assistant',
    date: 'January 2024 – May 2024',
    description: 'Led in-person labs and hosted office hours, providing tailored support to diverse student needs in CS2510.',
  },
  {
    company: 'Nimbus Therapeutics',
    title: 'Desktop Engineer Co-Op',
    date: 'September 2023 – December 2023',
    description: 'Worked as a Desktop Engineer Co-Op for the IT Department. Provided comprehensive end-user IT support, maintaining scientific applications and system reliability.',
  },
];

const WorkExperience = () => {
  return (
    <BodySection id="workhistory" title="WORK EXPERIENCE">
      <Container className="py-2">
        <ul className="timeline">
          {workExperienceData.map((experience, index) => (
            <li className="timeline-item" key={index}>
              <h3 className="timeline-company">{experience.company}</h3>
              <p className="timeline-date">{experience.date}</p>
              <p className="worktitle">{experience.title}</p>
              <p className="timeline-description">{experience.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </BodySection>
  );
};
export default WorkExperience;
