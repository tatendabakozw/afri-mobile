import { AxiosInstance, AxiosResponse } from 'axios';
import apiClient from '@/api/apiClient';
import { ApiResponse } from '@/utils/Types';

interface DeleteAccountPayload {
    reason: string;
}

interface ChangePasswordPayload {
    currentPassword: string;
    password: string;
    retypePassword: string;
}

interface RecoverOtpPayload {
    email: string;
}

interface VerifyOtpPayload {
    email: string;
    otp: string;
}

interface RecoverAccountPayload {
    email: string;
    reason: string;
}

class AccountService {
    private client: AxiosInstance;

    constructor() {
        this.client = apiClient();
    }

    /**
     * Handle errors from API requests.
     * @param error - The error object.
     * @throws {Error} - The formatted error message.
     */
    private handleError(error: any): never {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message || "An unexpected issue occurred. Please try again later.";
            throw new Error(errorMessage);
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error("An unexpected issue occurred. Please try again later.");
        }
    }

    async enableTwoFactorAuth(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.patch('/user/settings/account/two-factor/on');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async disableTwoFactorAuth(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.patch('/user/settings/account/two-factor/off');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async deleteAccount(payload: DeleteAccountPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/settings/account/delete-account', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/settings/account/change-password', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async requestOtp(payload: RecoverOtpPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/recover/request-otp', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async resendOtp(payload: RecoverOtpPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/recover/resend-request-otp', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/recover/verify-otp', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async recoverAccount(payload: RecoverAccountPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/recover', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }
}

export default AccountService;
