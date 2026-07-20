const fs = require('fs');
let content = fs.readFileSync('src/components/onglao-platform.tsx', 'utf8');

content = content.replace(
  /\} else if \(\!targetModal && currentModal\) \{/g,
  "} else if (!targetModal && currentModal && ['create-video', 'library'].includes(currentModal)) {"
);

fs.writeFileSync('src/components/onglao-platform.tsx', content, 'utf8');
console.log('Done fix_url');
