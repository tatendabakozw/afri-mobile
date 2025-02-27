import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, CreateDIYProjectPayload, UpdateDIYProjectPayload, RespondentAnswerDto, CompleteSurveyPayload } from '@/utils/Types';
import apiClient from '@/api/apiClient';

class DiyService {
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

    async createDIYProject(payload: CreateDIYProjectPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/diy/projects/create', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getAllUserDIYProjects(page: number, limit: number): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/diy/projects', {
                params: { page, limit },
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getAllDIYProjects(page: number, limit: number): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/diy/projects/admin', {
                params: { page, limit },
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getDIYProjectByCode(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/diy/projects/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getDIYProjectQuestionsByCode(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/diy/projects/questions/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getDIYProjectResultsByCode(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/diy/projects/results/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getProjectMetrics(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/diy/projects/metrics/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateDIYProject(projectCode: string, payload: UpdateDIYProjectPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.put(`/diy/projects/${projectCode}`, payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async deleteDIYProject(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.delete(`/diy/projects/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async toggleDIYProjectStatus(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post(`/diy/projects/toggle-status/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }



    async updateRespondentStatus(projectId: number): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post(`/diy/projects/update-respondent-status/target-unsuitable`, { projectId });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchUserEligibleDIYProjects(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/diy/projects/user/eligible/diy-projects');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

     async fetchUserEligibleCintProjects(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/cint/eligible-projects');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async checkTolunaRegistration(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/toluna/check-registration');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
      }


    async initiateDiyProjectScreening(payload: { projectCode: string, projectId: number }): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/diy/projects/initiate-screening', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getRespondentById(respondentId: number): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/diy/projects/respondent/${respondentId}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async handleRespondentAnswers(payload: { projectId: number; projectCode: string; responses: RespondentAnswerDto[] }): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/diy/projects/handle-respondent-answers', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async completeSurvey(payload: CompleteSurveyPayload): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/diy/projects/complete-survey', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async processPayment(paymentDetails: any): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/diy/projects/process-payment', paymentDetails);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }



}

export default DiyService;
