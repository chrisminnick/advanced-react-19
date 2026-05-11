#!/usr/bin/env node
// Pre-Day-1 environment check for the Advanced React course (v2.0).
//
// Verifies the things that, when broken, eat into Day 1 lecture time:
//   1. Node >= 22
//   2. npm  >= 10
//   3. Git installed and reachable
//   4. npm registry reachable
//   5. React 19 published (i.e., your network reaches the registry AND can fetch real package metadata)
//   6. Generic HTTPS works (catches corporate proxies)
//
// Usage: `node check.js` or `npm run check`
// Exit code: 0 if all checks pass, 1 otherwise.

const { execSync } = require('node:child_process');
const https = require('node:https');

const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const results = [];

function record(name, ok, detail, remedy) {
  results.push({ name, ok, detail, remedy });
  const mark = ok ? PASS : FAIL;
  console.log(`${mark} ${name.padEnd(28)} ${detail}`);
}

// -- 1. Node version --
function checkNode() {
  const version = process.versions.node;
  const major = parseInt(version.split('.')[0], 10);
  if (major >= 22) {
    record('Node version', true, `v${version}`);
  } else {
    record(
      'Node version',
      false,
      `v${version} — need v22 or later`,
      'Install Node 22 LTS via your package manager, nvm, or nodejs.org.'
    );
  }
}

// -- 2. npm version --
function checkNpm() {
  try {
    const out = execSync('npm --version', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const major = parseInt(out.split('.')[0], 10);
    if (major >= 10) {
      record('npm version', true, out);
    } else {
      record('npm version', false, `${out} — need v10 or later`, 'Upgrade Node 22 (npm 10 ships with it).');
    }
  } catch {
    record('npm version', false, 'not found', 'Make sure Node is installed and npm is on your PATH.');
  }
}

// -- 3. Git --
function checkGit() {
  try {
    const out = execSync('git --version', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    record('Git installed', true, out);
  } catch {
    record(
      'Git installed',
      false,
      'not found',
      'Install Git: macOS `brew install git`, Windows from git-scm.com, Linux via your package manager.'
    );
  }
}

// -- HTTPS GET helper --
function httpsGet(url, { timeoutMs = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') });
      });
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Timed out after ${timeoutMs}ms`));
    });
    req.on('error', reject);
  });
}

// -- 4. npm registry reachable --
async function checkNpmRegistry() {
  try {
    const { status } = await httpsGet('https://registry.npmjs.org/-/ping');
    if (status >= 200 && status < 400) {
      record('npm registry', true, 'reachable');
    } else {
      record('npm registry', false, `HTTP ${status}`, 'Check your proxy or VPN settings.');
    }
  } catch (err) {
    record(
      'npm registry',
      false,
      err.message,
      'Likely a corporate proxy. `npm config set proxy http://...` (and https-proxy) if needed.'
    );
  }
}

// -- 5. React 19 published --
async function checkReact19() {
  try {
    const { status, body } = await httpsGet('https://registry.npmjs.org/react');
    if (status !== 200) {
      record('React 19 available', false, `registry returned ${status}`);
      return;
    }
    const data = JSON.parse(body);
    const has19 = Object.keys(data.versions ?? {}).some((v) => v.startsWith('19.'));
    if (has19) {
      const latest19 = Object.keys(data.versions ?? {})
        .filter((v) => v.startsWith('19.') && !v.includes('-'))
        .sort()
        .pop();
      record('React 19 available', true, latest19 ? `latest 19.x: ${latest19}` : 'yes');
    } else {
      record('React 19 available', false, 'no 19.x version in registry response');
    }
  } catch (err) {
    record('React 19 available', false, err.message);
  }
}

// -- 6. Generic HTTPS --
async function checkGenericHttps() {
  try {
    const { status } = await httpsGet('https://nodejs.org/');
    if (status >= 200 && status < 400) {
      record('General HTTPS', true, 'nodejs.org reachable');
    } else {
      record('General HTTPS', false, `HTTP ${status}`);
    }
  } catch (err) {
    record('General HTTPS', false, err.message, 'Network or firewall issue — try outside corporate VPN.');
  }
}

// -- main --
async function main() {
  console.log('');
  console.log('Advanced React — environment check');
  console.log('─'.repeat(50));

  checkNode();
  checkNpm();
  checkGit();
  await checkNpmRegistry();
  await checkReact19();
  await checkGenericHttps();

  console.log('─'.repeat(50));

  const failed = results.filter((r) => !r.ok);
  if (failed.length === 0) {
    console.log(`${PASS} ${results.length}/${results.length} checks passed. You're ready for Day 1.`);
    console.log('');
    process.exit(0);
  }

  console.log(`${FAIL} ${failed.length} of ${results.length} checks failed:`);
  console.log('');
  for (const r of failed) {
    console.log(`  ${FAIL} ${r.name} — ${r.detail}`);
    if (r.remedy) {
      console.log(`    ${DIM}${r.remedy}${RESET}`);
    }
  }
  console.log('');
  console.log('Fix what you can and rerun. If you\'re stuck, email chris@minnick.com.');
  console.log('');
  process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error during checks:', err);
  process.exit(2);
});
