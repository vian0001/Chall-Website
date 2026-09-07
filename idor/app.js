/**
 * NexusDocs — Client Cryptographic Handshake & IDOR Explorer
 * Anti-Emoji Policy: 100% Clean SVG Primitives
 */

const CLIENT_SALT = 'nexus_browser_salt_2026';

// SVG Icons
const ICONS = {
  shieldCheck: `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  lock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  flag: `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>`,
  document: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  terminal: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  copy: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
};

// Compute Dynamic Web Crypto SHA256 Signature
async function generateClientSignature(timestamp, docId) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestamp}:${docId}:${CLIENT_SALT}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
  t.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    t.classList.remove('opacity-100', 'translate-y-0');
    t.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
  }, 2200);
}

// Fetch Document with Anti-AI Client Handshake
async function fetchDocument(docId) {
  const viewer = document.getElementById('documentViewer');
  const telemetry = document.getElementById('signatureTelemetry');
  
  viewer.innerHTML = `
    <div class="py-20 flex flex-col items-center justify-center text-center">
      <span class="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></span>
      <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest">Executing cryptographic handshake & fetching record...</p>
    </div>
  `;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await generateClientSignature(timestamp, docId);

  // Update live telemetry display
  telemetry.textContent = `X-Client-Signature: ${signature.slice(0, 24)}...\nX-Client-Timestamp: ${timestamp}\nTarget Index: /api/idor/doc/${docId}`;

  try {
    const res = await fetch(`/api/idor/doc/${docId}`, {
      headers: {
        'X-Client-Signature': signature,
        'X-Client-Timestamp': timestamp
      }
    });

    let data = null;
    if (res.ok) {
      data = await res.json();
    }

    if (data && data.document) {
      renderDocument(data.document, data.tampered_access);
    } else {
      // Fallback for static Firebase Hosting (Spark plan)
      const fallbackDocs = {
        1001: {
          id: 1001,
          docNumber: 'DOC-EXEC-1001',
          title: 'CONFIDENTIAL: Executive Board Minutes & Challenge Flag',
          classification: 'RESTRICTED // BOARD DIRECTORS ONLY',
          author: 'Chief Executive Officer (Root)',
          date: '2026-09-01T10:00:00Z',
          department: 'Executive Leadership',
          content: "Pursuant to Corporate Audit Directive 109, the master production flag for the 2026 security assessment has been deposited inside this executive object.\n\nFLAG: FLAG{1d0r_byp4ss_&_4nt1_cur1_d3f34t3d_2026}\n\nSecurity Notice: If you are reading this as an unprivileged auditor, this system suffers from Broken Access Control (Insecure Direct Object Reference).",
          flag: "FLAG{1d0r_byp4ss_&_4nt1_cur1_d3f34t3d_2026}"
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

      const docNum = parseInt(docId, 10);
      if (fallbackDocs[docNum]) {
        renderDocument(fallbackDocs[docNum], docNum !== 1042);
      } else {
        renderError(data || { error: 'Document Not Found', message: 'No record exists for the specified index.' });
      }
    }
  } catch (err) {
    // Fallback if network fails
    const docNum = parseInt(docId, 10);
    const fallback = {
      1001: {
        id: 1001,
        docNumber: 'DOC-EXEC-1001',
        title: 'CONFIDENTIAL: Executive Board Minutes & Challenge Flag',
        classification: 'RESTRICTED // BOARD DIRECTORS ONLY',
        author: 'Chief Executive Officer (Root)',
        date: '2026-09-01T10:00:00Z',
        department: 'Executive Leadership',
        content: "Pursuant to Corporate Audit Directive 109, the master production flag for the 2026 security assessment has been deposited inside this executive object.\n\nFLAG: FLAG{1d0r_byp4ss_&_4nt1_cur1_d3f34t3d_2026}\n\nSecurity Notice: If you are reading this as an unprivileged auditor, this system suffers from Broken Access Control (Insecure Direct Object Reference).",
        flag: "FLAG{1d0r_byp4ss_&_4nt1_cur1_d3f34t3d_2026}"
      },
      1042: {
        id: 1042,
        docNumber: 'DOC-AUD-1042',
        title: 'Guest Auditor Induction & Scope of Work',
        classification: 'UNCLASSIFIED // AUDITOR DESK',
        author: 'Compliance Officer',
        date: '2026-09-05T11:00:00Z',
        department: 'Internal Audit',
        content: 'Welcome, Auditor Guest (EMP-1042). Your testing scope is strictly limited to your designated document portal.'
      }
    };
    if (fallback[docNum]) {
      renderDocument(fallback[docNum], docNum !== 1042);
    } else {
      renderError({ error: 'Record Query Failed', message: err.message });
    }
  }
}

// Render Document View
function renderDocument(doc, isTampered) {
  const viewer = document.getElementById('documentViewer');
  const isSecret = doc.id === 1001;

  viewer.innerHTML = `
    <div class="flex flex-col space-y-6">
      <!-- Header Meta -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${isSecret ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}">
              ${doc.docNumber}
            </span>
            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${isSecret ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}">
              ${doc.classification}
            </span>
            ${isTampered ? `
              <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-amber-400 text-black font-bold">
                IDOR Object Accessed
              </span>
            ` : ''}
          </div>
          <h2 class="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            ${doc.title}
          </h2>
        </div>

        <div class="text-right text-xs font-mono text-zinc-400">
          <div>Author: <span class="text-zinc-200 font-semibold">${doc.author}</span></div>
          <div>Department: <span class="text-zinc-200">${doc.department}</span></div>
          <div class="text-zinc-500 text-[10px] mt-0.5">${new Date(doc.date).toLocaleString()}</div>
        </div>
      </div>

      <!-- Secret Flag Banner -->
      ${doc.flag ? `
        <div class="p-5 border border-amber-400/40 bg-amber-950/20 rounded-xl space-y-3">
          <div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            ${ICONS.flag}
            <span>Critical Access Violation — Confidential Flag Recovered</span>
          </div>
          <div class="flex items-center justify-between bg-black/60 p-3 rounded-lg border border-amber-500/30">
            <code class="text-sm md:text-base font-mono font-bold text-amber-300 tracking-wider">
              ${doc.flag}
            </code>
            <button onclick="copyToClipboard('${doc.flag}')" class="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 btn-tactile">
              ${ICONS.copy}
              <span>Copy Flag</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Body Content -->
      <div class="p-6 bg-zinc-950/60 rounded-xl border border-zinc-800/80 font-mono text-xs md:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
${doc.content}
      </div>
    </div>
  `;
}

// Render Error
function renderError(data) {
  const viewer = document.getElementById('documentViewer');
  viewer.innerHTML = `
    <div class="p-8 border border-zinc-800 bg-zinc-950/80 rounded-xl text-center space-y-3">
      <div class="w-10 h-10 mx-auto rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500">
        ${ICONS.lock}
      </div>
      <h4 class="text-sm font-mono text-zinc-200 uppercase font-bold">${data.error || 'Access Denied'}</h4>
      <p class="text-xs text-zinc-400 font-mono max-w-[45ch] mx-auto leading-relaxed">${data.message || 'No record exists.'}</p>
    </div>
  `;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Flag copied to clipboard!');
  });
}

function initAppLayout() {
  const root = document.getElementById('appRoot');
  if (!root) return;
  root.innerHTML = `
    <!-- Sticky Top Header -->
    <header class="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/85 backdrop-blur-xl">
      <div class="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a href="#" class="flex items-center gap-3">
            <span class="w-3.5 h-3.5 bg-amber-400 rotate-45"></span>
            <span class="text-lg md:text-xl font-black tracking-tighter uppercase font-sans">
              NEXUS <span class="text-zinc-500 font-normal">/</span> DOCS
            </span>
          </a>
          <span class="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 rounded">
            Corporate Archive
          </span>
        </div>

        <!-- Shield Indicator -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-[11px] font-mono text-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 perpetual-pulse"></span>
            <span>ANTI-AGENT SHIELD ARMED: cURL / BOTS REJECTED</span>
          </div>
          <div class="px-3 py-1 rounded border border-zinc-800 bg-zinc-900/80 text-xs font-mono text-zinc-400">
            Identity: <span class="text-zinc-200">auditor_guest</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Asymmetric Workspace (Design Variance: 8, min-h-[100dvh]) -->
    <main class="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16 min-h-[100dvh]">
      <!-- Scenario Directive Banner -->
      <div class="mb-10 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Challenge Brief: Insecure Direct Object Reference</span>
          </div>
          <p class="text-sm text-zinc-400 font-sans leading-relaxed">
            You are authenticated as <code>auditor_guest</code>. By company policy, you are strictly restricted to your induction contract (ID <code>1042</code>). Can you locate and view the Board Directors' restricted minutes (ID <code>1001</code>)?
          </p>
        </div>

        <div class="shrink-0 flex items-center gap-2 text-xs font-mono text-zinc-500 bg-black/40 px-3 py-2 rounded-lg border border-zinc-800">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <span>Direct cURL CLI Blocked</span>
        </div>
      </div>

      <!-- Asymmetric Split Grid: Left 8 cols Document Viewer | Right 4 cols Parameter Inspector -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Document Canvas & Content (8 cols) -->
        <section class="lg:col-span-8 border border-zinc-800 bg-[#0e0e11] rounded-2xl p-6 md:p-10 shadow-2xl">
          <div id="documentViewer"></div>
        </section>

        <!-- Right Column: IDOR Control & Telemetry Panel (4 cols) -->
        <aside class="lg:col-span-4 space-y-6">
          
          <!-- Parameter Tampering Console -->
          <div class="border border-zinc-800 bg-[#0e0e11] rounded-2xl p-6 shadow-xl space-y-5">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Query Parameter</span>
                <h3 class="text-sm font-bold text-zinc-100 uppercase tracking-tight">Record Reference ID</h3>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-amber-400 rounded">
                IDOR Testbed
              </span>
            </div>

            <form id="idorForm" class="space-y-3">
              <div>
                <label class="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Target Document ID
                </label>
                <div class="flex gap-2">
                  <input 
                    type="number" 
                    id="docIdInput" 
                    value="1042" 
                    min="1000" 
                    max="2000"
                    class="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-100 rounded-lg outline-none focus:border-amber-400 transition-colors"
                  />
                  <button type="submit" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-lg btn-tactile">
                    Fetch
                  </button>
                </div>
              </div>
            </form>

            <!-- Quick Presets -->
            <div class="space-y-2 pt-2 border-t border-zinc-800/80">
              <span class="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">Common Document References</span>
              <div class="grid grid-cols-2 gap-2">
                <button data-id="1042" class="preset-btn p-2 text-left text-xs font-mono rounded bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 btn-tactile">
                  <span class="text-[10px] text-zinc-500 block">ID 1042</span>
                  Auditor Desk (Yours)
                </button>
                <button data-id="1001" class="preset-btn p-2 text-left text-xs font-mono rounded bg-amber-950/20 border border-amber-500/30 hover:border-amber-500 text-amber-300 font-bold btn-tactile">
                  <span class="text-[10px] text-amber-500 block">ID 1001</span>
                  Executive Minutes 
                </button>
                <button data-id="1002" class="preset-btn p-2 text-left text-xs font-mono rounded bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 btn-tactile">
                  <span class="text-[10px] text-zinc-500 block">ID 1002</span>
                  Treasury Audit
                </button>
                <button data-id="1005" class="preset-btn p-2 text-left text-xs font-mono rounded bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 btn-tactile">
                  <span class="text-[10px] text-zinc-500 block">ID 1005</span>
                  Infra Telemetry
                </button>
              </div>
            </div>
          </div>

          <!-- Anti-AI Cryptographic Telemetry -->
          <div class="border border-zinc-800 bg-[#0e0e11] rounded-2xl p-6 shadow-xl space-y-4">
            <div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>Live Client Cryptographic Telemetry</span>
            </div>
            
            <p class="text-xs text-zinc-400 font-sans leading-relaxed">
              Every query computed above automatically generates a Web Crypto SHA-256 handshake. Direct terminal <code>curl</code> or python scripts lacking this handshake will receive a <code>403 Forbidden</code> block.
            </p>

            <pre id="signatureTelemetry" class="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 font-mono text-[10px] text-zinc-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
Calculating browser proof-of-work...
            </pre>
          </div>

        </aside>
      </div>
    </main>
  `;
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initAppLayout();

  // Initial load with default assigned document
  fetchDocument(1042);

  // Form submit (Manual ID change)
  const form = document.getElementById('idorForm');
  const input = document.getElementById('docIdInput');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = input.value.trim();
    if (id) fetchDocument(id);
  });

  // Quick ID buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      input.value = id;
      fetchDocument(id);
    });
  });
});
