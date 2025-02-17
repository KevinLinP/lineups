import fs from 'fs';
import { JSDOM } from 'jsdom';

// Read the HTML file
const html = fs.readFileSync('./data/edc-lv-2025/lineup.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const artists = [];

Array.from(document.querySelectorAll('.lineup__list li a')).forEach((a) => {
  const name = a.getAttribute('data-artist-name');
  if (name.match(/special guest/i)) return;
  const id = a.getAttribute('data-artist-id');

  artists.push({name, id});
});

// Output the results
console.log(artists);

// Optionally save to a JSON file
fs.writeFileSync('./data/edc-lv-2025/artists.json', JSON.stringify(artists, null, 2));