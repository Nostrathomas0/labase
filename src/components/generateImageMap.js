const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../assets/images'); // Path to the images directory
const outputPath = path.join(__dirname, '../imageMap.js'); // Where to save imageMap.js

let imports = '';
let mappings = 'const imageMap = {\n';

function processDir(dir, prefix = '') {
  fs.readdirSync(dir).forEach(file => {
    const absolutePath = path.join(dir, file);
    if (fs.statSync(absolutePath).isDirectory()) {
      processDir(absolutePath, path.join(prefix, file)); // Recurse into subdirectories
    } else {
      // Generate a relative path that matches the keys used in components/JSON
      const relativePath = path.join(prefix, file).replace(/\\/g, '/'); // Ensure forward slashes
      const importName = 'image_' + relativePath.replace(/[^a-zA-Z0-9]/g, '_');

      imports += `import ${importName} from '../assets/images/${relativePath}';\n`;
      mappings += `  '${relativePath}': ${importName},\n`; // Use relativePath as the key
    }
  });
}

processDir(imagesDir); // Start processing the images directory

mappings += '};\n\nexport default imageMap;\n';

// Write the output file
fs.writeFileSync(outputPath, imports + mappings);

