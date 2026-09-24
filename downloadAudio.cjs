const fs = require('fs');
const https = require('https');
const path = require('path');

const destDir = path.join(__dirname, 'public', 'sounds');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const sounds = [
    { url: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', name: 'magic_chime.ogg' },
    { url: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flick.ogg', name: 'wood_plank_flick.ogg' },
    { url: 'https://actions.google.com/sounds/v1/ui/button_click.ogg', name: 'button_click.ogg' }
  ];
  for (const s of sounds) {
    const dest = path.join(destDir, s.name);
    console.log('Downloading', s.url);
    await download(s.url, dest);
  }
  console.log('Done audio');
}
run();
