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

    const data = await res.json();

    if (res.ok && data.document) {
      renderDocument(data.document, data.tampered_access);
    } else {
      renderError(data);
    }
  } catch (err) {
    viewer.innerHTML = `
      <div class="p-8 border border-red-500/30 bg-red-950/20 rounded-xl text-center">
        <h4 class="text-sm font-mono text-red-400 uppercase font-bold mb-2">Perimeter Error</h4>
        <p class="text-xs text-zinc-400 font-mono">${err.message}</p>
      </div>
    `;
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

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
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
