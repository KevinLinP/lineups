import fs from 'fs';
import _ from 'lodash';

const SLEEP_MS = 5_000;

// Add sleep helper function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let artists = JSON.parse(fs.readFileSync('./data/edc-lv-2025/artists.json', 'utf8'));

for (const artist of artists) {
  const snakeCaseArtistName = artist.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const outputPath = `./data/edc-lv-2025/artist-bios/${snakeCaseArtistName}.json`;

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Bio already exists for ${artist.name}, skipping...`);
    continue;
  }

  const response = await fetch(
    "https://lasvegas.electricdaisycarnival.com/wp-admin/admin-ajax.php", 
    {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    referrer: 'https://lasvegas.electricdaisycarnival.com/lineup/',
    body: `id=${artist.id}&action=fe_get_artist_detail`,
    method: 'POST',
    mode: 'cors',
  });
  const data = await response.json();
  
  // does overwrite existing file
  fs.writeFileSync(
    outputPath,
    JSON.stringify(data, null, 2)
  );
  
  console.log(`Saved bio for ${artist.name}`);
  
  // Add 10 second delay before next iteration
  await sleep(SLEEP_MS);
}
