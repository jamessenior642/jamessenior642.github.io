# jvsenior.com

James Senior's personal website: a single-page React site with sections for About, Work Experience, Projects, and Music.

## Running locally

```
npm install
npm start
```

Opens at http://localhost:3000 and reloads as you edit.

## Deploying

The site is hosted on GitHub Pages at [jvsenior.com](https://jvsenior.com).

```
git push origin main   # save the source code
npm run deploy         # build and publish to the gh-pages branch
```

The live site updates about a minute after `npm run deploy`.

## Where things live

| What | Where |
| --- | --- |
| Shared colours, type sizes, transition speeds | `src/index.css` (`:root` variables) |
| Sections | `src/components/<section>/` |
| 3D chrome navbar logo (three.js) | `src/components/navbar/ChromeLogo.js` |
| Record player and sleeves | `src/components/music/RecordPlayer.js`, `Vinyl.js`, `Music.css` |
| Track list (titles, colours, fonts) | `src/components/music/Music.js` |
| Project list | `src/components/projects/Projects.js` |
| Sleeve textures | `src/pics/textures/` |

## Regenerating the logo font

The 3D logo uses a small converted copy of Merriweather Bold (`src/components/navbar/logo-font.json`).
To rebuild it, see the instructions at the top of `scripts/make-logo-font.mjs`.
