const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Custom Headers (Leaking environment & recon hints)
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'VaultOps-Core-Node/1.0.4-beta');
  res.setHeader('X-System-Debug', 'hint: check /api/system/status for diagnostic matrix');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
// Global Anti-AI / Anti-cURL Shield (Blocks any curl, wget, python, or cli bot on all routes)
app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const blocked = ['curl', 'python-requests', 'wget', 'httpclient', 'aiohttp', 'go-http-client', 'postmanruntime', 'scrapy'];
  if (blocked.some(b => ua.includes(b))) {
    res.status(403);
    res.setHeader('Content-Type', 'text/plain');
    return res.send('[BLOCKED] 403 Forbidden: Direct cURL and automated AI agents are barred from accessing this portal. Please visit using a real web browser.\n');
  }
  next();
});

// Serve static files when running locally or on Vercel
app.use(express.static(path.join(__dirname, '../public')));
app.use('/store', express.static(path.join(__dirname, '../store')));
app.use('/idor', express.static(path.join(__dirname, '../idor')));

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const FLAG = process.env.FLAG || 'FLAG{vau1t_0ps_pr0t0_p0llut10n_&_jwt_m4st3r_2026}';

// In-memory mock database for session storage
const systemNotes = [
  { id: 1, title: 'Server Migration', author: 'root', content: 'Database migrated to serverless instances.' },
  { id: 2, title: 'Security Audit Notice', author: 'secops', content: 'Remember to remove debug endpoints before public launch.' },
  { id: 3, title: 'Vault Access Policy', author: 'admin', content: 'Access to /api/flag requires admin privileges AND vault_unlocked in system memory.' }
];

// Helper: Base64URL
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let clean = str.replace(/-/g, '+').replace(/_/g, '/');
  while (clean.length % 4) clean += '=';
  return Buffer.from(clean, 'base64').toString('utf8');
}

// JWT Implementation (Intentionally vulnerable to alg:none and weak secret 'secret')
function createToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const h = base64UrlEncode(JSON.stringify(header));
  const p = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${h}.${p}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${h}.${p}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length < 2) return null;

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2] || '';

    // Vulnerability 1: alg "none" bypass (WebHunter JWT Forger support)
    if (header.alg && header.alg.toLowerCase() === 'none') {
      return payload;
    }

    // Vulnerability 2: HS256 with weak secret ('secret')
    if (header.alg && header.alg.toUpperCase() === 'HS256') {
      const expected = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${parts[0]}.${parts[1]}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      if (signature === expected) {
        return payload;
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

// Vulnerable Deep Merge Function (Prototype Pollution)
function recursiveMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  
  // Use getOwnPropertyNames to catch '__proto__' and 'constructor'
  const keys = Object.getOwnPropertyNames(source);
  for (const key of keys) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }
      recursiveMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Auth Middleware
function authRequired(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = req.cookies.vault_token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.', hint: 'Login or register at /api/auth/login' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token signature or malformed JWT.' });
  }

  req.user = user;
  next();
}

// ----------------------
// API ROUTES
// ----------------------

// 1. Recon / Status Diagnostic
app.get('/api/system/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.4-beta',
    environment: 'staging',
    timestamp: new Date().toISOString(),
    auth: {
      type: 'JWT',
      algorithm: 'HS256',
      notes: 'Key rotation scheduled. Default testing secret currently in use.'
    },
    engine: {
      framework: 'Node.js Express Serverless',
      merge_service: 'VaultOps-RecursiveObjectMerge-v1.0'
    },
    endpoints: [
      { method: 'POST', path: '/api/auth/register', desc: 'Register a guest account' },
      { method: 'POST', path: '/api/auth/login', desc: 'Authenticate and receive JWT' },
      { method: 'GET', path: '/api/user/me', desc: 'Inspect current profile' },
      { method: 'POST', path: '/api/settings/merge', desc: 'Sync custom preferences to session' },
      { method: 'GET', path: '/api/notes', desc: 'List notes' },
      { method: 'GET', path: '/api/flag', desc: 'High-security Flag Vault (Admin only)' }
    ]
  });
});

// 2. Authentication: Register
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  // New users always default to operator role
  const payload = {
    username: String(username).slice(0, 32),
    role: 'operator',
    access_level: 1,
    can_view_vault: false,
    iat: Math.floor(Date.now() / 1000)
  };

  const token = createToken(payload);
  res.cookie('vault_token', token, { httpOnly: false, path: '/' });
  res.json({
    message: 'User registered successfully as operator.',
    token,
    user: payload
  });
});

// 3. Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  // If someone tries to login as admin directly without password
  if (username === 'admin' && password !== 'SUPER_SECRET_COMPLEX_UNGUESSABLE_PW_999') {
    return res.status(401).json({ error: 'Invalid admin credentials. You cannot brute-force this password.' });
  }

  const payload = {
    username: String(username).slice(0, 32),
    role: 'operator',
    access_level: 1,
    can_view_vault: false,
    iat: Math.floor(Date.now() / 1000)
  };

  const token = createToken(payload);
  res.cookie('vault_token', token, { httpOnly: false, path: '/' });
  res.json({
    message: 'Login successful.',
    token,
    user: payload
  });
});

// 4. Current User Profile
app.get('/api/user/me', authRequired, (req, res) => {
  res.json({
    user: req.user,
    isAdmin: req.user.role === 'admin' || req.user.access_level >= 99
  });
});

// 5. Notes list
app.get('/api/notes', authRequired, (req, res) => {
  res.json({
    notes: systemNotes,
    viewer: req.user.username
  });
});

// 6. Settings Merge (Vulnerable to Prototype Pollution)
let userSettings = {};
app.post('/api/settings/merge', authRequired, (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'JSON payload required.' });
  }

  try {
    // Intentionally merges user input recursively into userSettings without sanitizing __proto__
    recursiveMerge(userSettings, body);

    res.json({
      success: true,
      message: 'Settings updated successfully.',
      current_theme: userSettings.theme || 'default',
      debug_check: {
        prototype_polluted: ({}).vault_unlocked !== undefined
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Merge execution failed: ' + err.message });
  }
});

// 7. Flag Vault (Requires: Admin role + Prototype Pollution bypass)
app.get('/api/flag', authRequired, (req, res) => {
  const isAdmin = req.user.role === 'admin' || req.user.access_level >= 99;

  if (!isAdmin) {
    return res.status(403).json({
      error: 'Access Denied.',
      reason: 'Role "admin" or access_level >= 99 required in JWT token.',
      your_role: req.user.role,
      hint: 'Inspect and modify your token using WebHunter JWT Tool.'
    });
  }

  // Check 2: Prototype Pollution Verification
  // The system checks whether 'vault_unlocked' has been injected into global Object prototype!
  const systemConfig = {};
  const isVaultUnlocked = systemConfig.vault_unlocked === true || systemConfig.vault_unlocked === 'true' || ({}).vault_unlocked === true;

  if (!isVaultUnlocked) {
    return res.status(403).json({
      error: 'Security Lock Active.',
      stage: 'Step 2 Complete (Admin Verified). Step 3 Required.',
      message: 'Admin access verified! However, the master hardware vault is locked.',
      hint: "Find the recursive merge endpoint (/api/settings/merge) and pollute the global configuration with { 'vault_unlocked': true }."
    });
  }

  // Both stages passed: Release Flag!
  return res.json({
    success: true,
    message: '🎉 Congratulations! You have bypassed both JWT validation and polluted the Node.js runtime prototype.',
    flag: FLAG,
    captured_by: req.user.username,
    level: 'WEB-EXPLOIT-PWNED'
  });
});

// ------------------------------------------
// Anti-AI / Anti-cURL Shield & IDOR Challenge
// ------------------------------------------
const CLIENT_SECRET_SALT = 'nexus_browser_salt_2026';
const IDOR_FLAG = process.env.IDOR_FLAG || 'FLAG{1d0r_byp4ss_&_4nt1_cur1_d3f34t3d_2026}';

const confidentialDocuments = {
  1001: {
    id: 1001,
    docNumber: 'DOC-EXEC-1001',
    title: 'CONFIDENTIAL: Executive Board Minutes & Challenge Flag',
    classification: 'RESTRICTED // BOARD DIRECTORS ONLY',
    author: 'Chief Executive Officer (Root)',
    date: '2026-09-01T10:00:00Z',
    department: 'Executive Leadership',
    content: `Pursuant to Corporate Audit Directive 109, the master production flag for the 2026 security assessment has been deposited inside this executive object.\n\nFLAG: ${IDOR_FLAG}\n\nSecurity Notice: If you are reading this as an unprivileged auditor, this system suffers from Broken Access Control (Insecure Direct Object Reference).`,
    flag: IDOR_FLAG
  },
  1002: {
    id: 1002,
    docNumber: 'DOC-FIN-1002',
    title: 'Q3 Financial Audit & Revenue Allocation',
    classification: 'CONFIDENTIAL // FINANCE',
    author: 'Head of Treasury',
    date: '2026-08-25T14:30:00Z',
    department: 'Finance & Accounts',
    content: 'All departmental expenditures for cloud infrastructure have been reviewed. Total variance: 3.4% under projection.'
  },
  1005: {
    id: 1005,
    docNumber: 'DOC-SYS-1005',
    title: 'Production Infrastructure Migration Telemetry',
    classification: 'INTERNAL // DEVOPS',
    author: 'Lead Site Reliability Engineer',
    date: '2026-08-20T09:15:00Z',
    department: 'Infrastructure',
    content: 'Kubernetes nodes cluster transition completed. Backup verification passed.'
  },
  1042: {
    id: 1042,
    docNumber: 'DOC-AUD-1042',
    title: 'Guest Auditor Induction & Scope of Work',
    classification: 'UNCLASSIFIED // AUDITOR DESK',
    author: 'Compliance Officer',
    date: '2026-09-05T11:00:00Z',
    department: 'Internal Audit',
    content: 'Welcome, Auditor Guest (EMP-1042). Your testing scope is strictly limited to your designated document portal.\n\nNote: You are officially authorized only to access document ID 1042. Attempting to view lower indexed documents (such as 1001) is strictly logged.'
  }
};

function antiAiAgentShield(req, res, next) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  
  // 1. Block common agent / automated CLI user-agents
  const blockedUAs = ['curl', 'python-requests', 'aiohttp', 'wget', 'go-http-client', 'postmanruntime', 'httpclient', 'scrapy'];
  if (blockedUAs.some(bot => ua.includes(bot))) {
    return res.status(403).json({
      status: 'blocked',
      error: 'Automated Agent / cURL Execution Blocked',
      user_agent: ua,
      message: 'Direct cURL commands or automated AI agents are strictly blocked by the security perimeter. You must interact with this system via an authorized browser session.',
      hint: 'AI agents that rely on simple cURL commands will fail. Open the web portal in your browser.'
    });
  }

  // 2. Validate browser-computed cryptographic signature
  const sig = req.headers['x-client-signature'];
  const ts = req.headers['x-client-timestamp'];
  const docId = String(req.params.id || '').trim();

  if (!sig || !ts) {
    return res.status(403).json({
      status: 'blocked',
      error: 'Missing Browser Cryptographic Handshake',
      missing_headers: ['X-Client-Signature', 'X-Client-Timestamp'],
      message: 'Requests must be dispatched from an authentic browser session calculating client proof-of-work.',
      hint: 'Direct cURL without dynamic browser JavaScript execution is barred.'
    });
  }

  // Signature calculation: sha256(ts + ':' + docId + ':' + CLIENT_SECRET_SALT)
  const expectedSig = crypto
    .createHash('sha256')
    .update(`${ts}:${docId}:${CLIENT_SECRET_SALT}`)
    .digest('hex');

  if (sig !== expectedSig) {
    return res.status(403).json({
      status: 'blocked',
      error: 'Invalid Client Cryptographic Signature',
      message: 'Signature mismatch. Client tampering or non-browser execution detected.'
    });
  }

  next();
}

// IDOR: List user documents
app.get('/api/idor/docs', (req, res) => {
  res.json({
    user: 'auditor_guest',
    assigned_id: 1042,
    accessible_records: [
      { id: 1042, docNumber: 'DOC-AUD-1042', title: 'Guest Auditor Induction & Scope of Work' }
    ],
    hint: 'Inspect how document data is retrieved from /api/idor/doc/:id'
  });
});

// IDOR: Retrieve document by ID (Protected by Anti-AI/cURL Shield, Vulnerable to IDOR)
app.get('/api/idor/doc/:id', antiAiAgentShield, (req, res) => {
  const docId = parseInt(req.params.id, 10);
  const doc = confidentialDocuments[docId];

  if (!doc) {
    return res.status(404).json({
      error: 'Document Not Found',
      requested_id: req.params.id,
      message: 'No record exists for the specified index.'
    });
  }

  // VULNERABILITY: No check verifying if 'auditor_guest' actually owns or is permitted to view docId!
  res.json({
    success: true,
    document: doc,
    tampered_access: docId !== 1042
  });
});

// Fallback for root route in local dev
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// For local testing
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[VaultOps CTF] Server running locally on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;
