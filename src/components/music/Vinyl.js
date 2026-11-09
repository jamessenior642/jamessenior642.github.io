import React from 'react';

// A colored vinyl record: grooves, a center label, and the spindle hole.
// Drawn on a 100x100 grid so it scales to any size. The title and year printed on the
// label are what make the spin visible, since everything else on a record is round.
const Vinyl = ({ color, title, year }) => (
  <svg className="vinyl" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="49" fill={color} stroke="#111" strokeWidth="0.75" />
    {[44, 40, 36, 32, 28, 24].map((r) => (
      <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(0, 0, 0, 0.14)" strokeWidth="0.5" />
    ))}
    <circle cx="50" cy="50" r="15" fill="#f5f5f3" stroke="#111" strokeWidth="0.5" />
    {title && (
      <text x="50" y="45.5" textAnchor="middle" className="vinyl-label-title">{title}</text>
    )}
    {year && (
      <text x="50" y="58" textAnchor="middle" className="vinyl-label-year">{year}</text>
    )}
    <circle cx="50" cy="50" r="1.6" fill="#111" />
  </svg>
);

export default Vinyl;
