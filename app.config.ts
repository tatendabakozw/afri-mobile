export default {
    expo: {
      name: "AfriSight",
      android: {
        package: "com.bako.afrisight"
      },
      extra: {
        apiProdUrl: process.env.API_PROD_URL,
        cryptoKey: process.env.CRYPTO_KEY,
        transformerKey: process.env.TRANSFORMER_KEY,
        abstractApiKey: process.env.ABSTRACT_API_KEY,
        abstractApiUrl: process.env.ABSTRACT_API_URL,
        exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY,
        exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL,
        apiIpifyUrl: process.env.API_IPIFY_URL,
        surveyjsKey: process.env.SURVEYJS_KEY,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
        zendeskKey: process.env.ZENDESK_KEY,
        zohoKey: process.env.ZOHO_KEY,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        eas: {
          projectId: "e8d0c8fe-cd0b-4517-aaa4-980cc63e9787"
        }
      },
      eas: {
        projectId: "e8d0c8fe-cd0b-4517-aaa4-980cc63e9787"  
      }
    },
  };