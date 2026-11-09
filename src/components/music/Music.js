import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import BodySection from '../bodysection/BodySection';
import { FaSoundcloud, FaInstagram, FaSpotify } from 'react-icons/fa';
import goodlove from '../../songs/goodlove.wav';
import softly from '../../songs/softly.wav';
import mamabeat2 from '../../songs/mamabeat2.wav';
import makobeat from '../../songs/makobeat.wav';
import './Music.css'; 

const musicData = [
  {
    title: 'Goodluv',
    date: 'September 2022',
    samples: 'Good Love by Anita Baker',
    audioSrc: goodlove,
  },
  {
    title: 'Softly',
    date: 'December 2021',
    samples: 'Killing Me Softly With His Song by Roberta Flack',
    audioSrc: softly,
  },
  {
    title: 'Days',
    date: 'November 2021',
    samples: 'Ayonha by Hamid Al Shaeri',
    audioSrc: mamabeat2,
  },
  {
    title: 'Mako',
    date: 'July 2021',
    samples: 'September Rain by Makoto Matsushita',
    audioSrc: makobeat,
  },
];

const Music = () => {
  return (
    <BodySection id="music" title="MUSIC">
      <p className="project-description">
        My other love in life is, and has been, music. I used to play the trumpet in band through high school, and now I dabble in music production and DJing. I use Ableton Live for production, and Serato for DJing. Here are a few things I've made, enjoy...
      </p>
      <div className="links2 mt-4 mb-5">
        <a href="https://soundcloud.com/james-senior-495564782" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaSoundcloud size={30} />
        </a>
        <a href="https://www.instagram.com/seniorcitizen___/" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaInstagram size={30} />
        </a>
        <a href="https://open.spotify.com/user/james_senior?si=f0cd6967398149d0" target="_blank" rel="noopener noreferrer" className="link-icon">
          <FaSpotify size={30} />
        </a>
      </div>
      <Row>
        {musicData.map((music, index) => (
          <Col lg={6} key={index} className="mb-4">
            <Card className="h-100 music-card">
              <Card.Header>
                <Card.Title className='fw-bold'>{music.title}</Card.Title>
              </Card.Header>
              <Card.Body>
                <audio controls className="audio-player">
                  <source src={music.audioSrc} type="audio/wav" />
                </audio>
                <Card.Text>Samples: {music.samples}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">{music.date}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </BodySection>
  );
};

export default Music;
