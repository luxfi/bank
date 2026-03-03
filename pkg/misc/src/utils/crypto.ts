import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag

function deriveKey(): Buffer {
  const raw = process.env.ENCRYPT_KEY;
  if (!raw)
    throw new Error('ENCRYPT_KEY environment variable is not set');

  // SHA-256 hash to get a consistent 32-byte key regardless of input length
  return crypto.createHash('sha256').update(raw).digest();
}

export function encrypt(text: string): string {
  const key = deriveKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Format: hex(iv) + hex(authTag) + hex(ciphertext)
  return iv.toString('hex') + authTag.toString('hex') + encrypted.toString('hex');
}

export function decrypt(encryptedText: string): string {
  // New format: 24 hex chars (IV) + 32 hex chars (authTag) + rest (ciphertext)
  const minLength = (IV_LENGTH + AUTH_TAG_LENGTH) * 2;
  if (encryptedText.length < minLength)
    return decryptLegacy(encryptedText);

  try {
    const key = deriveKey();
    const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(encryptedText.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2), 'hex');
    const ciphertext = Buffer.from(encryptedText.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2), 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    // If GCM decryption fails, fall back to legacy format for migration
    return decryptLegacy(encryptedText);
  }
}

/**
 * Decrypt ciphertext produced by the old crypto.createCipher('aes-128-cbc', key) API.
 * Kept for backward compatibility during migration. Remove once all data is re-encrypted.
 */
export function decryptLegacy(encryptedText: string): string {
  const secretKey = `${process.env.ENCRYPT_KEY}`;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const decipher = crypto.createDecipher('aes-128-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
