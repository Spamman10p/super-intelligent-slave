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
console.log('asset checks: 8 required asset/reference checks; failures: ' + failed);
if (failed) process.exit(1);
