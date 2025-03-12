import Constants from 'expo-constants';

// Access your environment variables
const {
  apiProdUrl,
  cryptoKey,
  transformerKey,
  abstractApiKey,
  abstractApiUrl,
  exchangeRateApiKey,
  exchangeRateApiUrl,
  apiIpifyUrl,
  surveyjsKey,
  stripePublicKey,
  zendeskKey,
  zohoKey,
  googleClientId,
} = Constants.expoConfig?.extra || {};

// Export all environment variables
export const API_PROD_URL = apiProdUrl;
export const CRYPTO_KEY = cryptoKey;
export const TRANSFORMER_KEY = transformerKey;
export const ABSTRACT_API_KEY = abstractApiKey;
export const ABSTRACT_API_URL = abstractApiUrl;
export const EXCHANGE_RATE_API_KEY = exchangeRateApiKey;
export const EXCHANGE_RATE_API_URL = exchangeRateApiUrl;
export const API_IPIFY_URL = apiIpifyUrl;
export const SURVEYJS_KEY = surveyjsKey;
export const STRIPE_PUBLIC_KEY = stripePublicKey;
export const ZENDESK_KEY = zendeskKey;
export const ZOHO_KEY = zohoKey;
export const GOOGLE_CLIENT_ID = googleClientId;