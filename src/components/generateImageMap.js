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
      // When encountering a directory, recursively call processDir with updated prefix
      processDir(absolutePath, path.join(prefix, file)); 
    } else {
      // Generate a relative path for the key, ensuring forward slashes
      const relativePath = path.join(prefix, file).replace(/\\/g, '/');

      // Create a safe variable name for the import by replacing non-alphanumeric characters
      const importName = 'image_' + relativePath.replace(/[^a-zA-Z0-9]/g, '_');

      // Import the image from its relative path within the 'assets/images' directory
      imports += `import ${importName} from './assets/images/${relativePath}';\n`;

      // Use the relative path (without 'assets/images/') as the key in the mapping
      mappings += `  '${relativePath}': ${importName},\n`;
    }
  });
}


processDir(imagesDir); // Start processing the images directory

mappings += '};\n\nexport default imageMap;\n';

// Write the output file
fs.writeFileSync(outputPath, imports + mappings);

