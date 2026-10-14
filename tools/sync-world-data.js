#!/usr/bin/env node
/* SIS world-data sync — dependency-free, local-only, read-only on the source.
 * Reads sis-victor-pass/world/bodies.json and generates dist/world-data.js so the
 * static world page consumes one source of truth instead of a hardcoded copy.
 * Run: node tools/sync-world-data.js
 * No network, no credentials, no backend, no writes outside dist/world-data.js.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "sis-victor-pass", "world", "bodies.json");
const OUT = path.join(ROOT, "dist", "world-data.js");
const REL_SRC = "sis-victor-pass/world/bodies.json";

function fail(msg) {
  console.error("sync-world-data: " + msg);
  process.exit(1);
}

if (!fs.existsSync(SRC)) fail("source not found: " + REL_SRC);

let raw;
try {
  raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
} catch (e) {
  fail("invalid JSON in " + REL_SRC + ": " + e.message);
}
if (!Array.isArray(raw)) fail(REL_SRC + " must be a JSON array of bodies");

const bodies = raw.map(function (b, i) {
  const where = REL_SRC + "[" + i + "]";
  if (!b || typeof b.id !== "string" || !b.id) fail(where + " has no string id");
  if (typeof b["class"] !== "string") fail(where + " has no string class");
  if (!Array.isArray(b.capabilities)) fail(where + " has no capabilities array");
  return {
    id: b.id,
    klass: b["class"],
    caps: b.capabilities.slice(),
    label: typeof b.label === "string" ? b.label : b.id,
    state: typeof b.state === "string" ? b.state : "unknown"
  };
});

const ids = bodies.map(function (b) { return b.id; });
if (new Set(ids).size !== ids.length) fail("duplicate body ids: " + ids.join(", "));

const banner =
  "/* AUTO-GENERATED — do not edit by hand.\n" +
  " * Source: " + REL_SRC + "\n" +
  " * Generator: tools/sync-world-data.js  (run: node tools/sync-world-data.js)\n" +
  " * Local-only mock data. No network, no credentials, no backend.\n" +
  " */\n";

const payload = { source: REL_SRC, bodies: bodies };
const out = banner + "window.SIS_WORLD_DATA = " + JSON.stringify(payload, null, 2) + ";\n";

fs.writeFileSync(OUT, out);
console.log("wrote " + path.relative(ROOT, OUT) + " — " + bodies.length + " bodies: " + ids.join(", "));
