export interface UpdateNotificationPayload {
    channel: string;
    categories: Array<{
        category: string;
        state: string;
    }>;
}