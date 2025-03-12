import axios from 'axios';
import { GeoIpResponse, GeoIpResult } from './Types';
import { ABSTRACT_API_KEY, ABSTRACT_API_URL, API_IPIFY_URL } from '@/constants/env';

const getUserIpAddress = async (): Promise<string | null> => {
    try {
        const ipifyUrl = API_IPIFY_URL;
        if (!ipifyUrl) {
            console.error('IPIFY URL is not set');
            return null;
        }
        const response = await axios.get(ipifyUrl);
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
};

const getGeoIpData = async (ipAddress: string): Promise<GeoIpResult> => {
    const apiKey = ABSTRACT_API_KEY;
    const abstractApiUrl = ABSTRACT_API_URL;
    if (!apiKey || !abstractApiUrl) {
        return { data: null, subdivisionCode: null, postalCode: null };
    }

    try {
        const response = await axios.get<GeoIpResponse>(
            `${abstractApiUrl}/?api_key=${apiKey}&ip_address=${ipAddress}`
        );

        const data = response.data;
        const subdivisionCode = `${data.country_code}-${data.region_iso_code}`;
        const postalCode = data.postal_code || '';

        return {
            data,
            subdivisionCode,
            postalCode,
        };
    } catch (error) {
        return { data: null, subdivisionCode: null, postalCode: null };
    }
};

const getGeoIp = async (): Promise<GeoIpResult> => {
    const ipAddress = await getUserIpAddress();
    if (!ipAddress) {
        return { data: null, subdivisionCode: null, postalCode: null };
    }
    return await getGeoIpData(ipAddress);
};

export default getGeoIp;
