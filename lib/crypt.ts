import CryptoJS from 'crypto-js';

// Define the type for the security key
const securityKey: string = 'your-secure-key'; // Replace this with your actual security key

// Function to make a string URL-safe
const toUrlSafeBase64 = (base64: string): string => {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Function to convert a URL-safe string back to regular Base64
const fromUrlSafeBase64 = (urlSafeBase64: string): string => {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
};

// Function to encrypt a string
export const encrypt = (text: string): string => {
  let encrypted = CryptoJS.AES.encrypt(text, securityKey).toString();
  let urlSafeEncrypted = toUrlSafeBase64(encrypted);

  // Pad the URL-safe encrypted string to ensure it has at least 20 characters
  while (urlSafeEncrypted.length < 20) {
    urlSafeEncrypted += toUrlSafeBase64(CryptoJS.lib.WordArray.random(1).toString());
  }

  return urlSafeEncrypted;
};

// Function to decrypt a string
export const decrypt = (urlSafeCipherText: string): string => {
  const realCipherText = fromUrlSafeBase64(urlSafeCipherText.substring(0, 24)); // Ensure the text is at least 24 characters

  const bytes = CryptoJS.AES.decrypt(realCipherText, securityKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return decrypted;
};

// Example usage:
const originalText: string = 'a'; // Single character to encrypt
const encryptedText: string = encrypt(originalText);
console.log('Original:', originalText);
console.log('Encrypted (URL-safe):', encryptedText);

const decryptedText: string = decrypt(encryptedText);
console.log('Decrypted:', decryptedText);
