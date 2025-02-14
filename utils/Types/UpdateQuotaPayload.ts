export interface UpdateQuotaPayload {
    quotas: {
        quotaId: number;
        limit: number;
        isClosed: boolean;
    }[];
    totalCompleteLimit: number;
}