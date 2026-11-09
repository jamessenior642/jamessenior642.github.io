// One-time script: converts Merriweather Bold into three.js's font format,
// keeping only the glyphs the 3D navbar logo needs.
//
// The source TTF is not committed. To regenerate, first download Merriweather Bold as a TTF
// (e.g. from https://fonts.google.com/specimen/Merriweather) to scripts/Merriweather-Bold.ttf.
//
// Usage (from the repo root):
//   npm install --no-save opentype.js
//   node scripts/make-logo-font.mjs
//
// Conversion logic mirrors three/examples/jsm/loaders/TTFLoader.js.

import fs from 'fs';
import opentype from 'opentype.js';

const GLYPHS = 'JS';
const INPUT = 'scripts/Merriweather-Bold.ttf';
const OUTPUT = 'src/components/navbar/logo-font.json';

const buffer = fs.readFileSync(INPUT);
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
const round = Math.round;
const scale = 100000 / ((font.unitsPerEm || 2048) * 72);

const glyphs = {};
for (const char of GLYPHS) {
  const glyph = font.charToGlyph(char);
  const token = {
    ha: round(glyph.advanceWidth * scale),
    x_min: round(glyph.xMin * scale),
    x_max: round(glyph.xMax * scale),
    o: '',
  };
  for (const command of glyph.path.commands) {
    const type = command.type.toLowerCase() === 'c' ? 'b' : command.type.toLowerCase();
    token.o += type + ' ';
    if (command.x !== undefined) token.o += round(command.x * scale) + ' ' + round(command.y * scale) + ' ';
    if (command.x1 !== undefined) token.o += round(command.x1 * scale) + ' ' + round(command.y1 * scale) + ' ';
    if (command.x2 !== undefined) token.o += round(command.x2 * scale) + ' ' + round(command.y2 * scale) + ' ';
  }
  glyphs[char] = token;
}

const output = {
  glyphs,
  familyName: font.getEnglishName('fullName'),
  ascender: round(font.ascender * scale),
  descender: round(font.descender * scale),
  underlinePosition: font.tables.post.underlinePosition,
  underlineThickness: font.tables.post.underlineThickness,
  boundingBox: {
    xMin: font.tables.head.xMin,
    xMax: font.tables.head.xMax,
    yMin: font.tables.head.yMin,
    yMax: font.tables.head.yMax,
  },
  resolution: 1000,
};

fs.writeFileSync(OUTPUT, JSON.stringify(output));
console.log(`Wrote ${OUTPUT} (${output.familyName}, glyphs: ${Object.keys(glyphs).join('')}, ${fs.statSync(OUTPUT).size} bytes)`);
