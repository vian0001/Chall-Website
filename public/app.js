// VaultOps Console Client Application
// Note for security team: remove debug route /api/system/status before production

let currentToken = localStorage.getItem('vault_token') || '';

// Toast Notification
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Token copied to clipboard!');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Token copied to clipboard!');
  });
}

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Update UI based on authenticated state
async function refreshState() {
  if (!currentToken) {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('userStatus').textContent = 'Not Authenticated';
    document.getElementById('logoutBtn').classList.add('hidden');
    return;
  }

  try {
    const res = await fetch('/api/user/me', {
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById('authSection').classList.add('hidden');
      document.getElementById('dashboardSection').classList.remove('hidden');
      document.getElementById('logoutBtn').classList.remove('hidden');

      document.getElementById('dispUsername').textContent = data.user.username || 'Anonymous';
      document.getElementById('userStatus').textContent = `Logged in: ${data.user.username}`;
      
      const roleBadge = document.getElementById('roleBadge');
      roleBadge.textContent = data.user.role || 'operator';
      if (data.user.role === 'admin') {
        roleBadge.style.color = '#ffd166';
        roleBadge.style.borderColor = '#ffd166';
        roleBadge.style.background = 'rgba(255, 209, 102, 0.15)';
      }

      const accessBadge = document.getElementById('accessBadge');
      accessBadge.textContent = `Level ${data.user.access_level || 1}`;

      document.getElementById('tokenDisplay').value = currentToken;
      loadNotes();
    } else {
      showToast('Session expired or invalid token.');
      logout();
    }
  } catch (err) {
    console.error('Session check failed:', err);
  }
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      currentToken = data.token;
      localStorage.setItem('vault_token', currentToken);
      showToast('Login successful!');
      refreshState();
    } else {
      showToast(data.error || 'Login failed');
    }
  } catch (err) {
    showToast('Network error during login');
  }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      currentToken = data.token;
      localStorage.setItem('vault_token', currentToken);
      showToast('Operator registered!');
      refreshState();
    } else {
      showToast(data.error || 'Registration failed');
    }
  } catch (err) {
    showToast('Network error during registration');
  }
});

// Logout
function logout() {
  currentToken = '';
  localStorage.removeItem('vault_token');
  document.cookie = 'vault_token=; Max-Age=0; path=/;';
  refreshState();
}
document.getElementById('logoutBtn').addEventListener('click', logout);

// Copy Token Button
document.getElementById('copyTokenBtn').addEventListener('click', () => {
  if (currentToken) copyToClipboard(currentToken);
});

// Apply Manual Token (Forged Token Testing)
document.getElementById('applyTokenBtn').addEventListener('click', () => {
  const input = document.getElementById('manualTokenInput').value.trim();
  if (!input) {
    showToast('Paste a token first!');
    return;
  }
  currentToken = input;
  localStorage.setItem('vault_token', currentToken);
  document.cookie = `vault_token=${input}; path=/;`;
  showToast('Token applied! Validating with server...');
  refreshState();
});

// Load System Notes
async function loadNotes() {
  const container = document.getElementById('notesContainer');
  try {
    const res = await fetch('/api/notes', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      container.innerHTML = data.notes.map(n => `
        <div class="note-item">
          <div class="note-title">[#${n.id}] ${escapeHtml(n.title)} <span style="font-size:0.75rem;color:#8c9bb5;">by @${escapeHtml(n.author)}</span></div>
          <div class="note-content">${escapeHtml(n.content)}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<div class="note-item">Failed to load internal records.</div>';
    }
  } catch (err) {
    container.innerHTML = '<div class="note-item">Error contacting notes service.</div>';
  }
}

// Settings Merge Form (Prototype Pollution trigger)
document.getElementById('mergeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const raw = document.getElementById('mergePayload').value;
  const out = document.getElementById('mergeOutput');

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    showToast('Invalid JSON in preferences payload.');
    return;
  }

  try {
    const res = await fetch('/api/settings/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify(parsed)
    });

    const data = await res.json();
    out.classList.remove('hidden');
    out.textContent = JSON.stringify(data, null, 2);

    if (data.debug_check && data.debug_check.prototype_polluted) {
      showToast('⚠️ WARNING: Global prototype altered!');
    } else {
      showToast('Settings synced successfully.');
    }
  } catch (err) {
    showToast('Merge request failed');
  }
});

// Access Vault
document.getElementById('accessVaultBtn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('vaultResult');
  resultDiv.classList.remove('hidden', 'success', 'error');
  resultDiv.textContent = 'Contacting Vault security sub-routine...';

  try {
    const res = await fetch('/api/flag', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();

    if (res.ok && data.flag) {
      resultDiv.classList.add('success');
      resultDiv.innerHTML = `🎉 <strong>ACCESS GRANTED!</strong><br><br>FLAG: <span style="font-size:1.15rem;font-weight:bold;color:#ffd166;">${escapeHtml(data.flag)}</span><br><br>${escapeHtml(data.message)}`;
      showToast('FLAG CAPTURED!');
    } else {
      resultDiv.classList.add('error');
      resultDiv.innerHTML = `❌ <strong>${escapeHtml(data.error || 'Access Denied')}</strong><br>${escapeHtml(data.reason || data.message || '')}<br><br><em>Hint: ${escapeHtml(data.hint || '')}</em>`;
    }
  } catch (err) {
    resultDiv.classList.add('error');
    resultDiv.textContent = 'Communication failed with Vault API.';
  }
});

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Initial session check
refreshState();
