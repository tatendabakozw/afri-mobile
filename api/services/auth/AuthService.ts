import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, UserRegistrationPayload, UserLoginPayload, EmailVerificationPayload, ResendVerificationPayload } from "@/utils/Types";
import apiClient from '@/api/apiClient';
import { saveTokens } from '@/helpers/saveTokens';

interface APIError {
    response?: {
        data: ApiResponse;
    };
    message?: string;
    errors?: Array<{
        error: string;
        message: string;
    }>;
}

class AuthService {
    private client: AxiosInstance;

    constructor() {
        this.client = apiClient();
    }

    async registerUser(payload: UserRegistrationPayload): Promise<ApiResponse> {
        if (payload.password !== payload.retypePassword) {
            throw new Error("Passwords do not match.");
        }
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/register', payload);
            return response.data;
        } catch (error: any) {
            let finalErrorMessage = "An unexpected issue occurred, and we couldn't process your request. Please try again later.";
            if (error.message) {
                const periodIndex = error.message.indexOf('.');
                if (periodIndex !== -1 && periodIndex + 1 < error.message.length) {
                    finalErrorMessage = error.message.substring(periodIndex + 1).trim();
                    if (!finalErrorMessage) {
                        finalErrorMessage = "An unexpected issue occurred, and we couldn't process your request. Please try again later.";
                    }
                }
            }

            throw new Error(finalErrorMessage);
        }
    }

    async loginUser(payload: UserLoginPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/login', payload);
            // console.log("data from login ",response.data);
            const { accessToken, jwt, refreshToken } = response.data.data;
            await saveTokens(accessToken, jwt, refreshToken);
            return response.data;
        } catch (error: any) {
            if (!error.message) {
                throw new Error("Network error: Unable to connect to the server. Please check your internet connection.");
            }
            // if (error.status === 401) {
            //     throw new Error(error.message);
            // }
            if (error.message.statusCode) {
                const { statusCode } = error.message;
                console.log(statusCode);
                switch (statusCode) {
                    case 409:
                        throw new Error("Invalid username or password.");
                    case 401:
                        throw new Error("Invalid credentials.");
                    case 400:
                        throw new Error("Invalid request. Please check your inputs and try again.");
                    case 403:
                        throw new Error("Access denied. Please contact support if this is unexpected.");
                    case 404:
                        throw new Error("Service not found. Please try again later.");
                    case 500:
                        throw new Error("Server error. Please try again later.");
                    case 503:
                        throw new Error("Service unavailable. Please try again later.");
                    default:
                        throw new Error("An unexpected issue occurred. Please try again later.");
                }
            }
            throw new Error(error.message || "An unexpected issue occurred. Please try again later.");
        }
    }

    async verifyEmail(payload: EmailVerificationPayload): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/verify-email', payload);
            return response.data;
        } catch (rawError: any) {
            const error: APIError = rawError;

            console.error('Verify Email Error:', error);

            if (error.response && error.response.data && !error.response.data.success) {
                if (error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
                if (error.response.data.errors && error.response.data.errors.length > 0) {
                    throw new Error(error.response.data.errors[0].message);
                }
            }

            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }

            throw new Error("Failed to verify email. Please try again later.");
        }
    }

    async verifyLogin(payload: EmailVerificationPayload): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/verify-2fa', payload);
            return response.data;
        } catch (rawError: any) {
            const error: APIError = rawError;

            console.error('Verify Email Error:', error);

            if (error.response && error.response.data && !error.response.data.success) {
                if (error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
                if (error.response.data.errors && error.response.data.errors.length > 0) {
                    throw new Error(error.response.data.errors[0].message);
                }
            }

            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }

            throw new Error("Failed to verify email. Please try again later.");
        }
    }

    async resendVerificationEmail(payload: ResendVerificationPayload): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/resend-verification', payload);
            return response.data;
        } catch (rawError: any) {
            console.error('Resend Verification Email Error:', rawError);

            const error: APIError = rawError;

            if (error.response && error.response.data) {
                if (!error.response.data.success) {
                    if (error.response.data.message) {
                        throw new Error(error.response.data.message);
                    }
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        throw new Error(error.response.data.errors[0].message);
                    }
                }
            }

            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }

            throw new Error("Failed to resend verification code. Please try again later.");
        }
    }

    async resendOtp(payload: ResendVerificationPayload): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/resend-2fa', payload);
            return response.data;
        } catch (rawError: any) {
            console.error('Resend Verification Email Error:', rawError);

            const error: APIError = rawError;

            if (error.response && error.response.data) {
                if (!error.response.data.success) {
                    if (error.response.data.message) {
                        throw new Error(error.response.data.message);
                    }
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        throw new Error(error.response.data.errors[0].message);
                    }
                }
            }

            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }

            throw new Error("Failed to resend verification code. Please try again later.");
        }
    }

    async forgotPassword(payload: { email: string }): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/forgot-password', payload);
            return response.data;
        } catch (rawError: any) {
            const error: APIError = rawError;
            if (error.response && error.response.data) {
                if (!error.response.data.success) {
                    if (error.response.data.message) {
                        throw new Error(error.response.data.message);
                    }
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        throw new Error(error.response.data.errors[0].message);
                    }
                }
            }
            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }
            throw new Error("Failed to process forgot password request. Please try again later.");
        }
    }

    async resendForgotPassword(payload: { email: string }): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/resend-forgot-password', payload);
            return response.data;
        } catch (rawError: any) {
            const error: APIError = rawError;
            if (error.response && error.response.data) {
                if (!error.response.data.success) {
                    if (error.response.data.message) {
                        throw new Error(error.response.data.message);
                    }
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        throw new Error(error.response.data.errors[0].message);
                    }
                }
            }
            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }
            throw new Error("Failed to resend forgot password email. Please try again later.");
        }
    }

    async resetPassword(payload: { email: string, password: string, retypePassword: string }): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/reset-password', payload);
            return response.data;
        } catch (rawError: any) {
            const error: APIError = rawError;
            if (error.response && error.response.data) {
                if (!error.response.data.success) {
                    if (error.response.data.message) {
                        throw new Error(error.response.data.message);
                    }
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        throw new Error(error.response.data.errors[0].message);
                    }
                }
            }
            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }
            throw new Error("Failed to reset password. Please try again later.");
        }
    }

    async verifyResetPassword(payload: { email: string, otp: string }): Promise<ApiResponse> {
        try {
            const response = await this.client.post('/user/verify/reset/password', payload);
            return response.data;
        } catch (rawError: any) {
            const error: APIError = rawError;
            if (error.response && error.response.data) {
                if (!error.response.data.success) {
                    if (error.response.data.message) {
                        throw new Error(error.response.data.message);
                    }
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        throw new Error(error.response.data.errors[0].message);
                    }
                }
            }
            if (error.message) {
                throw new Error(error.message);
            }
            if (error.errors && error.errors.length > 0) {
                throw new Error(error.errors[0].message);
            }
            throw new Error("Failed to verify reset password. Please try again later.");
        }
    }
}

export default AuthService;
