const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('[Build] Preparing dist/ directory for Firebase Hosting...');

// Clean dist/
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy public/ (VaultOps) to dist/ root
if (fs.existsSync(path.join(rootDir, 'public'))) {
  copyDir(path.join(rootDir, 'public'), distDir);
  console.log('✓ Copied public/ (VaultOps Console) to dist/');
}

// Copy store/ to dist/store/
if (fs.existsSync(path.join(rootDir, 'store'))) {
  copyDir(path.join(rootDir, 'store'), path.join(distDir, 'store'));
  console.log('✓ Copied store/ (MONOLITH / ARCHIVE) to dist/store/');
}

// Copy idor/ to dist/idor/
if (fs.existsSync(path.join(rootDir, 'idor'))) {
  copyDir(path.join(rootDir, 'idor'), path.join(distDir, 'idor'));
  console.log('✓ Copied idor/ (NexusDocs IDOR) to dist/idor/');
}

// Create static fallback API for Firebase Spark plan (Static Hosting)
const apiDir = path.join(distDir, 'api', 'idor');
fs.mkdirSync(apiDir, { recursive: true });

const docList = {
  user: 'auditor_guest',
  assigned_id: 1042,
  accessible_records: [
    { id: 1042, docNumber: 'DOC-AUD-1042', title: 'Guest Auditor Induction & Scope of Work' }
  ],
  hint: 'Inspect how document data is retrieved from /api/idor/doc/:id'
};
fs.writeFileSync(path.join(apiDir, 'docs'), JSON.stringify(docList, null, 2));
console.log('✓ Created static API fallback in dist/api/');

console.log('\n[Build Completed] All sites bundled into dist/ ready for Firebase Hosting deploy!');
