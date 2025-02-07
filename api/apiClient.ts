import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/utils/apiUrl';
// import { handleLogout } from '../utils/logout';

interface ApiResponseError {
    message: string;
}

interface CustomError {
    message: string;
    status?: number;
}

const pendingRequests: { [key: string]: Promise<any> } = {};

const apiClient = (baseUrl: string = API_URL): AxiosInstance => {
    if (!baseUrl) {
        throw new Error('API configurations not set.');
    }

    const axiosInstance = axios.create({
        baseURL: baseUrl,
        responseType: 'json',
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    axiosInstance.interceptors.request.use(async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const requestKey = `${config.method}:${config.url}`;

        if (await pendingRequests[requestKey]) {
            return Promise.reject({ __cancelRequest: true, promise: pendingRequests[requestKey] });
        }

        pendingRequests[requestKey] = axiosInstance(config)
            .finally(() => {
                delete pendingRequests[requestKey];
            });

        return config;
    }, error => {
        return Promise.reject(error);
    });

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => {
            const requestKey = `${response.config.method}:${response.config.url}`;
            delete pendingRequests[requestKey];
            return response;
        },
        async (error: AxiosError<ApiResponseError>): Promise<AxiosError | AxiosResponse | CustomError> => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            const requestKey = `${originalRequest.method}:${originalRequest.url}`;
            delete pendingRequests[requestKey];

            if (
                error.response?.status === 401 &&
                (error.response.data.message === "jwt expired" || error.response.data.message === "invalid/missing authorization")
            ) {
                // handleLogout();
                return Promise.reject(new Error('Session expired.'));
            }

            if (error.response?.status === 500) {
                return Promise.reject<CustomError>({ message: 'An unexpected error occurred. Please try again later.', status: 500 });
            }

            if (error.code === 'ECONNABORTED') {
                return Promise.reject<CustomError>({ message: 'Request timed out. Please check your internet connection.', status: error.response?.status });
            }

            const message: string = error.response?.data?.message || error.message || 'An error occurred while making the request.';
            return Promise.reject<CustomError>({ message, status: error.response?.status });
        }
    );

    return axiosInstance;
};

export default apiClient;