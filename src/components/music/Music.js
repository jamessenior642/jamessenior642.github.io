import React from 'react';
import BodySection from '../bodysection/BodySection';
import { FaSoundcloud, FaInstagram, FaSpotify } from 'react-icons/fa';
import RecordPlayer from './RecordPlayer';
import goodlove from '../../songs/goodlove.wav';
import softly from '../../songs/softly.wav';
import mamabeat2 from '../../songs/mamabeat2.wav';
import makobeat from '../../songs/makobeat.wav';
import './Music.css'; 

// Oldest to newest (left to right in the sleeve fan)
const musicData = [
  {
    title: 'Mako',
    date: 'July 2021',
    samples: 'September Rain by Makoto Matsushita',
    audioSrc: makobeat,
    color: '#5B3A29', // chocolate brown
    textColor: '#F3EAD8', // cream, since black text wouldn't read on the dark sleeve
    titleFont: "'Pirata One', serif", // blackletter
    titleScale: 1.15,
  },
  {
    title: 'Days',
    date: 'November 2021',
    samples: 'Ayonha by Hamid Al Shaeri',
    audioSrc: mamabeat2,
    color: '#E0362C', // red
    titleFont: "'Permanent Marker', cursive", // hand-drawn marker
    titleScale: 0.95,
  },
  {
    title: 'Softly',
    date: 'December 2021',
    samples: 'Killing Me Softly With His Song by Roberta Flack',
    audioSrc: softly,
    color: '#2D5BE3', // blue
    titleFont: "'Rubik Dirt', sans-serif", // distressed bold
    titleScale: 0.95,
  },
  {
    title: 'Goodluv',
    date: 'September 2022',
    samples: 'Good Love by Anita Baker',
    audioSrc: goodlove,
    color: '#F8D000', // yellow, same as the site accent
    titleFont: "'Sedgwick Ave Display', cursive", // graffiti
    titleScale: 1.1,
  },
];

const Music = () => {
  return (
    <BodySection id="music" title="MUSIC">
      <p>
        My other love in life is, and has been, music. I used to play the trumpet in band through high school, and now I dabble in music production and DJing. I use Ableton Live for production, and Serato for DJing. Here are a few things I've made, enjoy...
      </p>
      <div className="links2 mt-4 mb-5">
        <a href="https://soundcloud.com/james-senior-495564782" target="_blank" rel="noopener noreferrer" className="link-icon" aria-label="SoundCloud">
          <FaSoundcloud size={30} />
        </a>
        <a href="https://www.instagram.com/seniorcitizen___/" target="_blank" rel="noopener noreferrer" className="link-icon" aria-label="Instagram">
          <FaInstagram size={30} />
        </a>
        <a href="https://open.spotify.com/user/james_senior?si=f0cd6967398149d0" target="_blank" rel="noopener noreferrer" className="link-icon" aria-label="Spotify">
          <FaSpotify size={30} />
        </a>
      </div>
      <RecordPlayer tracks={musicData} />
    </BodySection>
  );
};

export default Music;
