import axios from 'axios';

const exchangeRateCache: { [key: string]: { rate: number; timestamp: number } } = {};
const CACHE_DURATION = 3600 * 1000;

export const getExchangeRate = async (baseCurrency: string, targetCurrency: string): Promise<number | null> => {
    try {
        const cacheKey = `${baseCurrency}_${targetCurrency}`;
        const currentTime = Date.now();

        if (exchangeRateCache[cacheKey] && (currentTime - exchangeRateCache[cacheKey].timestamp) < CACHE_DURATION) {
            return exchangeRateCache[cacheKey].rate;
        }

        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        const apiUrl = process.env.EXCHANGE_RATE_API_URL;

        if (!apiKey || !apiUrl) {
            console.error('Exchange rate API key or API URL is not provided.');
            return null;
        }

        const url = `${apiUrl}/latest?access_key=${apiKey}&base=${baseCurrency}&symbols=${targetCurrency}`;

        const response = await axios.get<{ rates: { [key: string]: number } }>(url);
        const exchangeRate = response.data.rates[targetCurrency];

        if (!exchangeRate) {
            console.error(`Exchange rate for ${targetCurrency} not found.`);
            return null;
        }

        exchangeRateCache[cacheKey] = {
            rate: exchangeRate,
            timestamp: currentTime
        };

        return exchangeRate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
};
