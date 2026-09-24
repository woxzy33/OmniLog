const fs = require('fs');
const https = require('https');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'data', 'exerciseDb.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

const regex = /imageUrl":\s*"([^"]+)"/g;
const urls = [...dbContent.matchAll(regex)].map(m => m[1]);
console.log('Found ' + urls.length + ' images.');

const destDir = path.join(__dirname, 'public', 'exercises');
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
  for (const url of urls) {
    if (!url.startsWith('http')) continue;
    const parts = url.split('/');
    const folderName = parts[parts.length - 2];
    const fileName = folderName + '.jpg';
    const localPath = '/exercises/' + fileName;
    const dest = path.join(destDir, fileName);
    
    if (!fs.existsSync(dest)) {
      console.log('Downloading', url);
      await download(url, dest);
    }
    dbContent = dbContent.replace(url, localPath);
  }
  fs.writeFileSync(dbPath, dbContent);
  console.log('Done downloading images!');
}
run();
