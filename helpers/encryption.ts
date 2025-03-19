import { CRYPTO_KEY } from '@/constants/env';
import * as Crypto from 'expo-crypto';

interface EncryptionData {
  [key: string]: any;
}

const ENCRYPTION_KEY = CRYPTO_KEY || 'default_key';

export const encryptData = async (data: EncryptionData): Promise<string> => {
    console.log("enbcryotuion key, ", ENCRYPTION_KEY)
  try {
    const jsonString = JSON.stringify(data);
    // Generate a hash of the data
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      jsonString + ENCRYPTION_KEY
    );
    // Combine the data with its hash
    const payload = {
      data: jsonString,
      hash
    };
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = async <T>(encodedData: string): Promise<T> => {
  try {
    const decoded = decodeURIComponent(atob(encodedData));
    const { data, hash } = JSON.parse(decoded);
    
    // Verify the hash
    const verifyHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data + ENCRYPTION_KEY
    );
    
    if (hash !== verifyHash) {
      throw new Error('Data integrity check failed');
    }
    
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};