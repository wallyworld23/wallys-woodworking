#!/usr/bin/env node
// scripts/sync-gallery.js
//
// Syncs gallery-data.js with the images/gallery/ folder:
//   • Adds entries for new image files not yet in gallery-data.js
//   • Removes entries for files that no longer exist in the folder
//
// Usage (run from project root):
//   node scripts/sync-gallery.js

const fs   = require('fs');
const path = require('path');

const GALLERY_DIR = path.join(__dirname, '..', 'images', 'gallery');
const DATA_FILE   = path.join(__dirname, '..', 'gallery-data.js');
const IMAGE_EXTS  = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Guess category from filename prefix
function guessCategory(filename) {
  if (filename.startsWith('furniture')) return 'furniture';
  if (filename.startsWith('specialty')) return 'specialty';
  if (filename.startsWith('decor'))     return 'decor';
  return 'furniture'; // fallback — valid categories: furniture, decor, specialty
}

// Load existing data
const raw = fs.readFileSync(DATA_FILE, 'utf8');
const jsonMatch = raw.match(/window\.GALLERY_DATA\s*=\s*(\{[\s\S]*?\})\s*;?\s*$/);
if (!jsonMatch) {
  // Try alternate format (no quotes on keys)
  const altMatch = raw.match(/window\.GALLERY_DATA\s*=\s*\{[\s\S]*items:\s*(\[[\s\S]*\])/);
  if (!altMatch) {
    console.error('Could not parse gallery-data.js.');
    process.exit(1);
  }
}

// Parse by evaluating into a safe object
let data;
try {
  // Use Function to evaluate JS object syntax (handles unquoted keys)
  data = Function('"use strict"; ' + raw.replace('window.GALLERY_DATA =', 'return') + '; return window.GALLERY_DATA || arguments[0]')();
  if (!data) {
    const tmp = {};
    Function('"use strict"; var window = arguments[0]; ' + raw)(tmp);
    data = tmp.GALLERY_DATA;
  }
} catch(e) {
  console.error('Could not parse gallery-data.js:', e.message);
  process.exit(1);
}

// Get all image files currently on disk
const onDisk = new Set(
  fs.readdirSync(GALLERY_DIR)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()) && !f.startsWith('.'))
    .sort()
);

// Remove entries for files no longer on disk
const before = data.items.length;
data.items = data.items.filter(item => onDisk.has(item.file));
const removed = before - data.items.length;

// Add entries for new files not yet in data
const existing = new Set(data.items.map(i => i.file));
const added = [];

[...onDisk].sort().forEach(file => {
  if (!existing.has(file)) {
    data.items.push({
      file,
      category: guessCategory(file),
      label: 'New Project',
      sub: 'Handcrafted · Virginia Beach'
    });
    added.push(file);
  }
});

// Write back
const output =
  '// gallery-data.js — Wally\'s Woodworking\n' +
  '// Edit this file to update the gallery, or run: node scripts/sync-gallery.js\n' +
  '// to auto-detect new images added to images/gallery/\n\n' +
  'window.GALLERY_DATA = ' + JSON.stringify(data, null, 2) + ';\n';

fs.writeFileSync(DATA_FILE, output);

// Report
if (removed === 0 && added.length === 0) {
  console.log('✓ Gallery is already in sync — nothing to change.');
} else {
  if (removed > 0) {
    console.log(`✓ Removed ${removed} entr${removed > 1 ? 'ies' : 'y'} for deleted images.`);
  }
  if (added.length > 0) {
    console.log(`✓ Added ${added.length} new image${added.length > 1 ? 's' : ''}:`);
    added.forEach(f => console.log(`   • ${f}`));
    console.log('');
    console.log('Next: open gallery-data.js and update the label & sub for each new entry.');
  }
  console.log('Then run: ./deploy.sh "Update gallery"');
}
