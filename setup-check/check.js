#!/usr/bin/env node
// Pre-Day-1 environment check for the Advanced React course (v2.0).
//
// Verifies the things that, when broken, eat into Day 1 lecture time:
//   1. Node >= 22 (current LTS line)
//   2. npm  >= 10 (ships with Node 22+)
//   3. Git installed and reachable
//   4. npm registry reachable
//   5. React 19 published (network reaches the registry AND can fetch real metadata)
//   6. Generic HTTPS works (catches corporate proxies)
//   7. MongoDB reachable on localhost:27017 (Labs 1, 2, 3, 4, 6, 7, 8 need it)
//   8. Repo structure intact (lab-files/, demos/, solutions/, all 8 lab folders)
//
// Usage: `node check.js` or `npm run check` from the setup-check/ folder
// Exit code: 0 if all checks pass, 1 otherwise.

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const https = require('node:https');

const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const REPO_ROOT = path.resolve(__dirname, '..');

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
      'Install the current Node LTS (v24 as of May 2026) from nodejs.org or via nvm.'
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
      record('npm version', false, `${out} — need v10 or later`, 'Upgrade to the current Node LTS (npm 10+ ships with it).');
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

// -- 7. MongoDB reachable on localhost:27017 --
// Raw TCP probe so we don't need the mongodb driver as a dep. Just confirms
// something is listening — the social-media/server's own connection check
// will tell you whether it's a real Mongo behind the port.
function checkMongo() {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let settled = false;
    const finish = (ok, detail, remedy) => {
      if (settled) return;
      settled = true;
      sock.destroy();
      record('MongoDB on :27017', ok, detail, remedy);
      resolve();
    };
    sock.setTimeout(2000);
    sock.once('connect', () => finish(true, 'reachable'));
    sock.once('timeout', () => finish(false, 'connection timed out',
      'Is mongod running? macOS: `brew services start mongodb-community`. Windows: `Start-Service MongoDB`. Linux: `sudo systemctl start mongod`.'));
    sock.once('error', (err) => finish(false, err.code ?? err.message,
      'Is mongod running? macOS: `brew services start mongodb-community`. Windows: `Start-Service MongoDB`. Linux: `sudo systemctl start mongod`.'));
    sock.connect(27017, '127.0.0.1');
  });
}

// -- 8. Repo structure --
// The course assumes the lab-files/, demos/, and solutions/ trees are in
// place — easy to spot a partial clone or wrong-branch checkout.
function checkRepoStructure() {
  const expected = {
    'lab-files/':           ['lab-01', 'lab-02', 'lab-03', 'lab-04', 'lab-05', 'lab-06', 'lab-07', 'lab-08'],
    'demos/':               ['routing-demo', 'my-next-app', 'my-next-routing-demo'],
    'solutions/':           ['lab-01-modernize', 'lab-04-tanstack-query', 'lab-08-exemplar'],
  };

  const missing = [];
  for (const [parent, children] of Object.entries(expected)) {
    const parentPath = path.join(REPO_ROOT, parent);
    if (!fs.existsSync(parentPath)) {
      missing.push(parent);
      continue;
    }
    for (const child of children) {
      if (!fs.existsSync(path.join(parentPath, child))) {
        missing.push(`${parent}${child}/`);
      }
    }
  }

  if (missing.length === 0) {
    record('Repo structure', true, 'lab-files/, demos/, solutions/ all in place');
  } else {
    record(
      'Repo structure',
      false,
      `missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ' …' : ''}`,
      'Re-clone the repo or git pull from main. The course expects the v2 layout.'
    );
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
  await checkMongo();
  checkRepoStructure();

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
