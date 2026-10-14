#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assets = [
  ['ORCHARD-01', 'dist/assets/orchard-01.png'],
  ['SPARKY-02', 'dist/assets/sparky-02.png'],
  ['TRASHMAN-03', 'dist/assets/trashman-03.png'],
  ['LOTUS-04', 'dist/assets/lotus-04.png']
];
const surfaces = ['dist/index.html', 'dist/archive.html', 'dist/world.js'];
let failed = 0;
for (const [id, rel] of assets) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    console.log('FAIL asset ' + id + ' ' + rel);
    failed++;
  } else {
    console.log('PASS asset ' + id + ' ' + rel + ' (' + fs.statSync(file).size + ' bytes)');
  }
}
for (const surface of surfaces) {
  const text = fs.readFileSync(path.join(root, surface), 'utf8');
  for (const [id, rel] of assets) {
    const name = path.basename(rel);
    if (!text.includes(name)) {
      console.log('FAIL reference ' + id + ' missing from ' + surface);
      failed++;
    }
  }
}
const designSheets = [
  'sis-base-turnaround-v1.png', 'sis-heads-sheet-v1.png', 'sis-torso-armor-sheet-v1.png',
  'sis-arms-hands-sheet-v1.png', 'sis-legs-feet-sheet-v1.png', 'sis-accessories-tools-sheet-v1.png',
  'sis-joints-actuators-sheet-v1.png', 'sis-damage-variants-sheet-v1.png',
  'sis-isolated-parts-sheet-v1.png', 'sis-canonical-variants-sheet-v1.png'
];
const landing = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
for (const name of designSheets) {
  const file = path.join(root, 'dist/assets', name);
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) { console.log('FAIL design asset ' + name); failed++; }
  else if (!landing.includes('assets/' + name)) { console.log('FAIL design reference ' + name); failed++; }
  else console.log('PASS design asset/reference ' + name);
}
console.log('asset checks: 18 required asset/reference checks; failures: ' + failed);
if (failed) process.exit(1);
