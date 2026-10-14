#!/usr/bin/env node
/* SIS dist QA — dependency-free, read-only, local-only.
 * Scans every dist/*.html, dist/*.css and dist/*.js (buildless static surface)
 * and checks:
 *   1. <html lang=...> present on each page
 *   2. no duplicate id="..." within a document
 *   3. every in-page href="#..." anchor resolves to an element id/name
 *   4. every relative href/src (and CSS url()) exists on disk
 *   5. every <img> carries an alt attribute
 *   6. animated CSS has a @media (prefers-reduced-motion) guard
 *   7. no banned network / storage / wallet *constructs*
 * Exit code is nonzero if any check fails. Reads files only — never writes,
 * never runs a network call, never touches providers, wallets, storage or devices.
 * Run: node tools/sis-qa.js
 *
 * Token-note: the scan targets code constructs, not prose. Comments are stripped
 * and HTML visible text is ignored, so a disclaimer that merely contains the words
 * "wallet" or "network" does not fail; a real wallet/network/storage API use does.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

/* ---- result collection ------------------------------------------------- */
let failures = 0;
const lines = [];

function record(file, check, ok, detail) {
  if (!ok) failures++;
  lines.push({ file: file, check: check, ok: !!ok, detail: detail || "" });
}

/* ---- file/attribute helpers -------------------------------------------- */
function read(file) {
  return fs.readFileSync(file, "utf8");
}

function listDist(ext) {
  return fs
    .readdirSync(DIST)
    .filter(function (name) {
      return name.endsWith(ext);
    })
    .sort()
    .map(function (name) {
      return path.join(DIST, name);
    });
}

// Extract attribute values, tolerating quoted and unquoted forms. The leading
// boundary keeps "data-id" from being read as "id".
function attrValues(src, name) {
  const re = new RegExp(
    "(?:^|[\\s\"'<=])" + name + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))",
    "gi"
  );
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    out.push(m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4]);
  }
  return out;
}

function isRelativeRef(v) {
  if (!v) return false;
  if (v.charAt(0) === "#") return false; // in-page anchor
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return false; // http:, mailto:, data:, javascript: ...
  if (v.indexOf("//") === 0) return false; // protocol-relative
  return true;
}

function refExists(file, ref) {
  const clean = ref.split("#")[0].split("?")[0];
  if (!clean) return true;
  return fs.existsSync(path.resolve(path.dirname(file), clean));
}

/* ---- comment / text stripping for the token scan ----------------------- */
function stripBlockComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, " ");
}

function stripCssComments(s) {
  return stripBlockComments(s);
}

// String-aware removal of // and /* */ so "http://" inside a string survives.
function stripJsComments(code) {
  let out = "";
  let i = 0;
  const n = code.length;
  let quote = null;
  while (i < n) {
    const c = code[i];
    const d = code[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") {
        if (i + 1 < n) {
          out += code[i + 1];
          i += 2;
          continue;
        }
      } else if (c === quote) {
        quote = null;
      }
      i++;
      continue;
    }
    if (c === "/" && d === "/") {
      while (i < n && code[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && d === "*") {
      i += 2;
      while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      out += " ";
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      out += c;
      i++;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

// Drop character data between tags but keep <script>/<style> bodies intact.
function htmlCodeSurface(html) {
  const s = html.replace(/<!--[\s\S]*?-->/g, " ");
  const re = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    out += dropText(s.slice(last, m.index));
    out += m[0];
    last = m.index + m[0].length;
  }
  out += dropText(s.slice(last));
  return stripBlockComments(out);
}

function dropText(x) {
  return x.replace(/>[^<]*/g, ">");
}

/* ---- banned construct scan --------------------------------------------- */
const BANNED = [
  { kind: "network", label: "fetch(", re: /\bfetch\s*\(/g },
  { kind: "network", label: "XMLHttpRequest", re: /\bXMLHttpRequest\b/g },
  { kind: "network", label: "WebSocket", re: /\bWebSocket\b/g },
  { kind: "network", label: "EventSource", re: /\bEventSource\b/g },
  { kind: "network", label: "sendBeacon", re: /\bsendBeacon\b/g },
  { kind: "network", label: "http(s)://", re: /\bhttps?:\/\//g },
  { kind: "network", label: "@import", re: /@import\b/g },
  { kind: "network", label: "url(http...)", re: /url\(\s*["']?https?:/g },
  { kind: "storage", label: "localStorage", re: /\blocalStorage\b/g },
  { kind: "storage", label: "sessionStorage", re: /\bsessionStorage\b/g },
  { kind: "storage", label: "indexedDB", re: /\bindexedDB\b/g },
  { kind: "storage", label: "document.cookie", re: /\bdocument\.cookie\b/g },
  { kind: "wallet", label: "window.solana/ethereum", re: /\bwindow\.(?:solana|ethereum)\b/g },
  { kind: "wallet", label: "web3/ethers/Keypair", re: /\b(?:web3|ethers|Keypair)\b/g },
  {
    kind: "wallet",
    label: "privateKey/mnemonic/seedPhrase",
    re: /\b(?:privateKey|mnemonic|seedPhrase|secretKey)\b/g
  },
  {
    kind: "wallet",
    label: "signTransaction/signMessage",
    re: /\b(?:signTransaction|signMessage|signAndSendTransaction)\b/g
  },
  // Wallet *API use*, not the English word in a disclaimer ("...or wallet state.").
  { kind: "wallet", label: "wallet API use", re: /\bwallet(?:\.|\[|\(|=|Address\b|Connect\b|Adapter\b)/g },
  { kind: "wallet", label: "walletState-like identifier", re: /\bwallet[A-Z_]/g },
  { kind: "wallet", label: "treasury/mint", re: /\b(?:treasury|mint)\b/g }
];

function tokenSurface(file, raw) {
  if (file.endsWith(".js")) return stripJsComments(raw);
  if (file.endsWith(".css")) return stripCssComments(raw);
  return htmlCodeSurface(raw);
}

function qaTokens(rel, raw, file) {
  const surface = tokenSurface(file, raw);
  const hits = [];
  BANNED.forEach(function (b) {
    b.re.lastIndex = 0;
    const found = surface.match(b.re);
    if (found) hits.push(b.kind + " " + b.label + " x" + found.length);
  });
  record(rel, "banned network/storage/wallet tokens", hits.length === 0, hits.length ? hits.join("; ") : "clean");
}

/* ---- per-file checks --------------------------------------------------- */
function hasAnimation(css) {
  return /animation\s*:\s*(?!none\b|0s\b)\S/i.test(css) || /@keyframes/i.test(css);
}
function hasReducedMotion(css) {
  return /prefers-reduced-motion/i.test(css);
}

function qaHtml(file) {
  const rel = path.relative(ROOT, file);
  const raw = read(file);

  const htmlTag = raw.match(/<html\b[^>]*>/i);
  const lang = htmlTag ? attrValues(htmlTag[0], "lang")[0] : "";
  record(rel, "html lang", !!lang, lang ? 'lang="' + lang + '"' : "missing <html lang>");
  const headingLevels = (raw.match(/<h([1-6])\b/gi) || []).map(function (tag) {
    return Number(tag.charAt(2));
  });
  const headingOk = headingLevels.length > 0 && headingLevels[0] === 1;
  record(
    rel,
    "heading hierarchy",
    headingOk,
    headingLevels.length ? "levels: " + headingLevels.join(" -> ") : "missing heading"
  );

  const ids = attrValues(raw, "id");
  const dup = ids.filter(function (v, i) {
    return ids.indexOf(v) !== i;
  });
  record(
    rel,
    "duplicate ids",
    dup.length === 0,
    ids.length + " ids" + (dup.length ? "; dup: " + Array.from(new Set(dup)).join(", ") : "")
  );

  const names = attrValues(raw, "name");
  const anchors = attrValues(raw, "href")
    .filter(function (v) {
      return v.charAt(0) === "#" && v.length > 1;
    })
    .map(function (v) {
      return v.slice(1);
    });
  const broken = anchors.filter(function (a) {
    return ids.indexOf(a) === -1 && names.indexOf(a) === -1;
  });
  record(
    rel,
    "in-page anchors resolve",
    broken.length === 0,
    anchors.length + " refs" + (broken.length ? "; broken: " + Array.from(new Set(broken)).join(", ") : "")
  );

  const refs = attrValues(raw, "href").concat(attrValues(raw, "src")).filter(isRelativeRef);
  const missing = refs.filter(function (r) {
    return !refExists(file, r);
  });
  record(
    rel,
    "relative link/asset existence",
    missing.length === 0,
    refs.length + " refs" + (missing.length ? "; missing: " + Array.from(new Set(missing)).join(", ") : "")
  );

  const imgs = raw.match(/<img\b[^>]*>/gi) || [];
  const noAlt = imgs.filter(function (t) {
    return !/\balt\s*=/i.test(t);
  });
  record(rel, "img alt text", noAlt.length === 0, imgs.length + " img(s)" + (noAlt.length ? "; missing alt on " + noAlt.length : ""));

  const styles = (raw.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) || [])
    .map(function (b) {
      return b.replace(/^<style\b[^>]*>/i, "").replace(/<\/style>$/i, "");
    })
    .join("\n");
  if (hasAnimation(styles)) {
    record(rel, "prefers-reduced-motion", hasReducedMotion(styles), hasReducedMotion(styles) ? "guard present" : "animated without guard");
  } else {
    record(rel, "prefers-reduced-motion", true, "no inline animation");
  }
}

function qaCss(file) {
  const rel = path.relative(ROOT, file);
  const raw = read(file);
  const css = stripCssComments(raw);

  if (hasAnimation(css)) {
    record(rel, "prefers-reduced-motion", hasReducedMotion(css), hasReducedMotion(css) ? "guard present" : "animated without guard");
  } else {
    record(rel, "prefers-reduced-motion", true, "no animation");
  }

  const urls = [];
  const re = /url\(\s*(["']?)([^"')]+)\1\s*\)/g;
  let m;
  while ((m = re.exec(css))) urls.push(m[2]);
  const relRefs = urls.filter(isRelativeRef);
  const missing = relRefs.filter(function (r) {
    return !refExists(file, r);
  });
  record(
    rel,
    "relative link/asset existence",
    missing.length === 0,
    relRefs.length + " url()" + (missing.length ? "; missing: " + Array.from(new Set(missing)).join(", ") : "")
  );
}

/* ---- run --------------------------------------------------------------- */
const htmlFiles = listDist(".html");
const cssFiles = listDist(".css");
const jsFiles = listDist(".js");

htmlFiles.forEach(function (f) {
  qaHtml(f);
  qaTokens(path.relative(ROOT, f), read(f), f);
});
cssFiles.forEach(function (f) {
  qaCss(f);
  qaTokens(path.relative(ROOT, f), read(f), f);
});
jsFiles.forEach(function (f) {
  qaTokens(path.relative(ROOT, f), read(f), f);
});

/* ---- report ------------------------------------------------------------ */
console.log("SIS dist QA (read-only)");
console.log("root: " + DIST);
console.log(
  "files: " +
    htmlFiles.concat(cssFiles, jsFiles).map(function (f) {
      return path.basename(f);
    }).join(", ")
);
console.log("");

let current = null;
lines.forEach(function (r) {
  if (r.file !== current) {
    current = r.file;
    console.log("[" + current + "]");
  }
  console.log("  " + (r.ok ? "PASS" : "FAIL") + "  " + r.check + (r.detail ? "  (" + r.detail + ")" : ""));
});

const passed = lines.filter(function (r) {
  return r.ok;
}).length;
console.log("");
console.log("checks: " + lines.length + "  passed: " + passed + "  failed: " + failures);
if (failures > 0) {
  console.error("sis-qa: FAILED (" + failures + ")");
  process.exit(1);
}
console.log("sis-qa: all-pass");
