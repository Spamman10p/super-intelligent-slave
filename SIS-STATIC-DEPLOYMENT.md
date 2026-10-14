# Static deployment

SIS is a static, local/mock website. The publish directory is dist/; there is no build command and no runtime server required.

## Vercel

1. Import the GitHub repository.
2. Select the project root.
3. Select the **Other** framework preset.
4. Leave the build command empty.
5. Set the output directory to dist (the checked-in vercel.json already declares this).
6. Deploy the main branch.

The same dist/ directory can be uploaded to any static host that supports HTML, CSS, JavaScript, and PNG files.

## Hosting boundary

The hosted build is still a fictional, local/mock-only prototype. It does not connect to model providers, wallets, authentication, persistence, PSN, devices, or external APIs. Do not add those through host settings or environment variables without completing SIS-WORLD-HOSTING-REVIEW.md.

The included headers add basic browser hardening and set connect-src none so the static site cannot make network connections from the browser. If a future feature needs networking, treat that as a separate architecture and security review.

## Pre-deploy checks

Run from the repository root:

    node tools/sis-qa.js
    node tools/sis-assets-qa.js
    node --check tools/sync-world-data.js
    node --check dist/world-data.js
    node --check dist/world.js
    python3 -m json.tool vercel.json

A clean git status and passing checks are required before publishing.
