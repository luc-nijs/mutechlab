// Encrypts the password-protected content, so it can sit on the public site.
// The plain files stay in _protected/ (not in git); only the encrypted copies are published.
//
// Run after changing anything in _protected/:
//   MTL_PASSWORD='...' node scripts/protect.mjs
//
// AES-GCM with a key from PBKDF2-SHA256; the browser decrypts with the same password.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';

const files = {
  '_protected/applications.html': 'public/protected/applications.json',
  '_protected/compo-train.html': 'public/protected/compo-train.json',
};
const ITERATIONS = 250000;

const password = process.env.MTL_PASSWORD;
if (!password) { console.error('Set MTL_PASSWORD first.'); process.exit(1); }

const b64 = (buf) => Buffer.from(buf).toString('base64');
const salt = crypto.getRandomValues(new Uint8Array(16));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  base, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
);

mkdirSync('public/protected', { recursive: true });
for (const [from, to] of Object.entries(files)) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(readFileSync(from, 'utf8')));
  writeFileSync(to, JSON.stringify({ v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) }));
  console.log(`${from} -> ${to}`);
}
