export interface ApiResponse {
    statusCode: number,
    success: boolean,
    message?: string,
    errors?: Array<{
        error: string;
        message: string;
    }>;
    data?: any,
}