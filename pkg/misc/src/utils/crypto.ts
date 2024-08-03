import * as crypto from 'crypto';

const secretKey = `${process.env.ENCRYPT_KEY}`;

export function encrypt(text: string) {
  const cipher = crypto.createCipher('aes-128-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipher('aes-128-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}