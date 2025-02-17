import fs from 'fs';
import _ from 'lodash';

const artistsJson = JSON.parse(fs.readFileSync('./data/edc-lv-2025/artists.json', 'utf8'));

const artistNames = _.uniq(artistsJson.map((artist) => {
  return artist.name;
})).sort();

const DISALLOWED_URL_TYPES = ['twitter', 'facebook']
const SORT_ORDER = ['soundcloud', 'spotify', 'instagram', 'website'];

const artists = artistNames.map((artistName) => {
  const fileName = artistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const bio = JSON.parse(fs.readFileSync(`./data/edc-lv-2025/artist-bios/${fileName}.json`, 'utf8')).data[0];
  const genres = JSON.parse(fs.readFileSync(`./data/edc-lv-2025/artist-genres/${fileName}.json`, 'utf8'));

  let urls = bio.social_links.map((link) => {
    return {
      type: link.service,
      url: link.url,
    };
  });

  urls = urls.filter((url) => {
    return !DISALLOWED_URL_TYPES.includes(url.type);
  });

  urls = urls.sort((a, b) => {
    return SORT_ORDER.indexOf(a.type) - SORT_ORDER.indexOf(b.type);
  });

  return {
    name: bio.name,
    bio: genres.cleanBio,
    genres: genres.genres,
    urls,
  };
});


const lineup = {
  name: 'EDC Las Vegas 2025',
  artists: _.sortBy(artists, 'name'),
  urlSlug: 'edc-las-vegas-2025'
};

fs.writeFileSync('./static/lineups/edc-las-vegas-2025.json', JSON.stringify(lineup, null, 2));
