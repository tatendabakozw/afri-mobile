import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, NotificationSettings, UpdateNotificationPayload } from "@/utils/Types";
import apiClient from '@/api/apiClient';

interface NotificationResponse extends ApiResponse {
    data: NotificationSettings[];
}

class NotificationsService {
    private client: AxiosInstance;

    constructor() {
        this.client = apiClient();
    }

    async fetchEmailSettings(): Promise<NotificationResponse> {
        try {
            const response: AxiosResponse<NotificationResponse> = await this.client.get('/user/settings/notification/email');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchSmsSettings(): Promise<NotificationResponse> {
        try {
            const response: AxiosResponse<NotificationResponse> = await this.client.get('/user/settings/notification/sms');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchPushNotificationSettings(): Promise<NotificationResponse> {
        try {
            const response: AxiosResponse<NotificationResponse> = await this.client.get('/user/settings/notification/push_notification');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchWhatsappSettings(): Promise<NotificationResponse> {
        try {
            const response: AxiosResponse<NotificationResponse> = await this.client.get('/user/settings/notification/whatsapp');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateNotificationSettings(payload: UpdateNotificationPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/user/settings/notification', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any): never {
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

export default NotificationsService;
