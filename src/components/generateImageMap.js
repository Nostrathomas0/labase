const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../assets/images'); // Path to the images directory
const outputPath = path.join(__dirname, '../imageMap.js'); // Where to save imageMap.js

let imports = '';
let mappings = 'const imageMap = {\n';

function processDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const absolutePath = path.join(dir, file);
    if (fs.statSync(absolutePath).isDirectory()) {
      return processDir(absolutePath); // Recursively handle directories
    } else {
      // Process each image file
      const relativePath = path.relative(imagesDir, absolutePath);
      const importName = 'image_' + relativePath.replace(/[^a-zA-Z0-9]/g, '_');
      
      // Ensure import paths are correctly relative to the src directory
      imports += `import ${importName} from './assets/images/${relativePath.replace(/\\/g, '/')}';\n`;
      mappings += `  '${relativePath.replace(/\\/g, '/')}': ${importName},\n`;
    }
  });
}

processDir(imagesDir); // Start processing the images directory

mappings += '};\n\nexport default imageMap;\n';

// Write the output file
fs.writeFileSync(outputPath, imports + mappings);

