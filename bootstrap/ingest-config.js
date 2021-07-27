const dotenv = require('dotenv');
const fs = require('fs');
const ConfigIngestor = require('../lib/ConfigIngestor.js');

let CONFIG;

try {
  let dotEnvObj = {};
  process.argv.forEach((a) => {
    const m = a.match(/^--config=(.+)$/);
    if (m) {
      dotEnvObj = dotenv.parse(fs.readFileSync(m[1]));
      if (dotEnvObj.error) {
        throw new Error(dotEnvObj.error);
      }
    }
  });
  CONFIG = ConfigIngestor({ ...dotEnvObj, ...process.env });
} catch (e) {
  process.stderr.write(`${e.message}\n`);
  process.exit(1);
}

module.exports = CONFIG;
