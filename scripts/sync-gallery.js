#!/usr/bin/env node
// scripts/sync-gallery.js
//
// Scans images/gallery/ and adds any new image files to gallery-data.js
// with placeholder labels you can fill in before deploying.
//
// Usage (run from project root):
//   node scripts/sync-gallery.js

const fs   = require('fs');
const path = require('path');

const GALLERY_DIR  = path.join(__dirname, '..', 'images', 'gallery');
const DATA_FILE    = path.join(__dirname, '..', 'gallery-data.js');
const IMAGE_EXTS   = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Determine a default category from the filename prefix
function guessCategory(filename) {
  if (filename.startsWith('furniture'))   return 'furniture';
  if (filename.startsWith('specialty'))   return 'specialty';
  if (filename.startsWith('decor'))       return 'decor';
  return 'furniture'; // fallback — change in gallery-data.js if needed
  // Valid categories: furniture, decor, specialty
}

// Load existing data by stripping the JS wrapper and parsing the JSON object
const raw = fs.readFileSync(DATA_FILE, 'utf8');
const jsonMatch = raw.match(/window\.GALLERY_DATA\s*=\s*(\{[\s\S]*\});/);
if (!jsonMatch) {
  console.error('Could not parse gallery-data.js — make sure window.GALLERY_DATA = {...}; is present.');
  process.exit(1);
}
const data = JSON.parse(jsonMatch[1]);
const existing = new Set(data.items.map(i => i.file));

// Scan the gallery folder
const files = fs.readdirSync(GALLERY_DIR)
  .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()) && f !== '.DS_Store')
  .sort();

const added = [];

files.forEach(file => {
  if (!existing.has(file)) {
    data.items.push({
      file,
      category: guessCategory(file),
      label: 'New Project',
      sub:   'Handcrafted · Virginia Beach'
    });
    added.push(file);
  }
});

if (added.length === 0) {
  console.log('✓ Gallery is already up to date — no new images found.');
} else {
  const output =
    '// gallery-data.js — Wally\'s Woodworking\n' +
    '// Edit this file to update the gallery, or run: node scripts/sync-gallery.js\n' +
    '// to auto-detect new images added to images/gallery/\n\n' +
    'window.GALLERY_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(DATA_FILE, output);
  console.log(`✓ Added ${added.length} new image(s) to gallery-data.js:`);
  added.forEach(f => console.log(`   • ${f}`));
  console.log('');
  console.log('Next: open gallery-data.js and update the label & sub fields');
  console.log('      for each new entry, then run ./deploy.sh "Add new gallery photos"');
}
