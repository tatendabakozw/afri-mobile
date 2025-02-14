import { AxiosInstance, AxiosResponse } from 'axios';
import {
    ApiResponse,
    UpdateUserProfilePayload,
    VerifyPhoneNumberPayload,
    CheckPhoneNumberPayload,
} from '@/utils/Types';
import apiClient from '@/api/apiClient';

class ProfileService {
    private client: AxiosInstance;

    constructor() {
        this.client = apiClient();
    }

    private handleError(error: any): never {
        if (error.response && error.response.data) {
            const errorMessage =
                error.response.data.message ||
                'An unexpected issue occurred. Please try again later.';
            throw new Error(errorMessage);
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected issue occurred. Please try again later.');
        }
    }

    async getUserProfile(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/user/profile');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateUserProfile(profile: UpdateUserProfilePayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.patch('/user/profile', profile);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getUserRewardBalance(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/user/reward/balance');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async verifyPhoneNumberVerificationCode(payload: VerifyPhoneNumberPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/sms/verify-otp', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async resendPhoneNumberVerificationCode(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/sms/resend-verification-code');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async checkPhoneNumberAvailability(payload: CheckPhoneNumberPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/phone-number/check', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async sendVerifyPhoneNumberSms(phoneNumber: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/sms/verify-phone-number', { phoneNumber });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }
}

export default ProfileService;
