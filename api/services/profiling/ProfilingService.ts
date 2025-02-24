import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, CreateCapiProjectDto } from '@/utils/Types';
import apiClient from '@/api/apiClient';

class ProfilingService {
    private client: AxiosInstance;

    constructor() {
        this.client = apiClient();
    }

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



    async createRespondentAnswer(payload: any): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/profiling/answer', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }



    async createCapiProject(payload: CreateCapiProjectDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/projects/capi/create', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProfilingQuestions(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/profiling/answered-unanswered');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

}

export default ProfilingService;
