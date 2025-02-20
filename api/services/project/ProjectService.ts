import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, CreateCawiInitialDto, CreateCawiIncrementDto, CreateRecontactProjectDto, CreateCapiProjectDto } from '@/utils/Types';
import apiClient from '@/api/apiClient';

interface FetchProjectsParams {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    clientName?: string;
    countryCode?: string;
    projectType?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
}

class ProjectService {
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

    async createCawiInitial(payload: CreateCawiInitialDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/projects/cawi/initial/create', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async createCawiIncrement(payload: CreateCawiIncrementDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/projects/cawi/increment/create', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async createRecontactProject(payload: CreateRecontactProjectDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/projects/cawi/recontact/create', payload);
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

    async fetchAllProjects(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/projects/fetch/table');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProjectsByPage(params: FetchProjectsParams): Promise<ApiResponse> {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', params.page.toString());
            queryParams.append('limit', params.limit.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.status) queryParams.append('status', params.status);
            if (params.clientName) queryParams.append('clientName', params.clientName);
            if (params.countryCode) queryParams.append('countryCode', params.countryCode);
            if (params.projectType) queryParams.append('projectType', params.projectType);
            if (params.startDate) queryParams.append('startDate', params.startDate);
            if (params.endDate) queryParams.append('endDate', params.endDate);

            const response: AxiosResponse<ApiResponse> = await this.client.get(
                `/projects/fetch/table?${queryParams.toString()}`
            );
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProjectsTable(limit: number, page: number, startDate?: string, endDate?: string, search?: string): Promise<ApiResponse> {
        try {
            let url = `/projects/fetch/table?limit=${limit}&page=${page}`;
            if (startDate) {
                url += `&startDate=${startDate}`;
            }
            if (endDate) {
                url += `&endDate=${endDate}`;
            }
            if (search) {
                url += `&search=${search}`;
            }
            const response: AxiosResponse<ApiResponse> = await this.client.get(url);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProjectCodes(client: string, countryCode: string, projectType: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/projects/fetch/project-codes?client=${client}&countryCode=${countryCode}&projectType=${projectType}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProjectDetails(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/projects/fetch/project-details/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchLiveProjects(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/projects/fetch/live-projects');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchAllRespondents(
        projectCode: string,
        query: {
            limit?: number;
            page?: number;
            startDate?: string;
            endDate?: string;
            search?: string;
            statuses?: string[];
            sortOrder?: 'asc' | 'desc';
        }
    ): Promise<ApiResponse> {
        try {
            const queryString = new URLSearchParams(query as any).toString();
            const response: AxiosResponse<ApiResponse> = await this.client.get(
                `/projects/fetch/repondents/all/${projectCode}?${queryString}`
            );
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async fetchInflowProjects(projectCode: any,page?:number,perPage?:number,search?:string,status?:string): Promise<ApiResponse> {
        try {
            const params: Record<string, any> = {};


            if (page ) params.page = page;
            if (perPage ) params.limit = perPage;
            if (search) params.search = search;
            if (status) params.status = status;
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/projects/fetch/inflows/${projectCode}`,{ params });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateProjectStatus(projectCode: string, status: 'LIVE' | 'PAUSED' | 'COMPLETED'): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.patch(`/projects/update/status/${projectCode}/${status}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProjectRestrictions(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/projects/fetch/restrictions/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchProjectManagers(projectCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/projects/fetch/project-managers/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async addProjectManager(projectCode: string, email: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post(`/projects/create/project-manager/${projectCode}`, { email });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async deleteProjectManager(projectCode: string, email: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post(`/projects/delete/project-manager/${projectCode}`, { email });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async fetchEligibleProjects(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/projects/eligible');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }
       async fetchCintProjects(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/projects/cint');
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

    async fetchParticipants(
        projectCode: string,
        limit: number = 10,
        page: number = 1,
        startDate?: string,
        endDate?: string,
        search?: string,
        statuses?: string[],
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<ApiResponse> {
        try {
            const params = {
                limit,
                page,
                startDate,
                endDate,
                search,
                statuses: statuses?.join(','),
                sortOrder
            };

            const response: AxiosResponse<ApiResponse> = await this.client.get(
                `/projects/fetch/${projectCode}/participants`,
                { params }
            );

            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


}

export default ProjectService;
