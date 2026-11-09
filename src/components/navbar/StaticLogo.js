import React from 'react';

// Plain text "JS", shown while the 3D logo loads or if the browser can't do WebGL.
// Kept in its own file so the navbar can use it without pulling in three.js.
const StaticLogo = () => (
  <span className="static-logo" aria-hidden="true">JS</span>
);

export default StaticLogo;
