import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import CustomNavbar from './components/navbar/CustomNavbar';
import Home from './components/home/Home';
import About from './components/about/About';
import Projects from './components/projects/Projects';
import WorkExperience from './components/experience/WorkExperience';
import Music from './components/music/Music';
import Footer from './components/footer/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <Home />
        <About />
        <WorkExperience />
        <Projects />
        <Music />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
