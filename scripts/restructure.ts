
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const moves = {
  'src/core/filters': 'src/common/filters',
  'src/core/interceptors': 'src/common/interceptors',
  'src/auth': 'src/modules/auth',
  'src/user': 'src/modules/users',
  'src/database': 'src/config/database',
};

for (const [src, dest] of Object.entries(moves)) {
  if (fs.existsSync(src)) {
    execSync(`mkdir -p ${path.dirname(dest)} && mv ${src} ${dest}`);
    console.log(`Moved ${src} -> ${dest}`);
  }
}
