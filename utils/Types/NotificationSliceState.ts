import {NotificationSettings} from "./NotificationSettings";
export interface NotificationSliceState {
    emailSettings: NotificationSettings[];
    smsSettings: NotificationSettings[];
    pushNotificationSettings: NotificationSettings[];
    whatsappSettings: NotificationSettings[];
    loading: boolean;
    error: string | null;
}