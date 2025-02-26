import apiClient from "@/api/apiClient";
import { AxiosInstance } from "axios";

class RewardService {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient();
  }

  private handleError(error: any): never {
    if (error.response && error.response.data) {
      const errorMessage =
          error.response.data.message ||
          "An unexpected issue occurred. Please try again later.";
      throw new Error(errorMessage);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected issue occurred. Please try again later.");
    }
  }

  async markParticipants(
      projectCode: string,
      payload: { ids: number | string[]; action: "COMPLETED" | "DISQUALIFIED" }
  ) {
    try {
      const response = await this.client.post(
          `/projects/update/${projectCode}/mark-participants`,
          payload
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }


  async updateRewardStatus(payload: { id: any | any[]; status: string; projectCode: string }) {
    try {
      const response = await this.client.patch(`/rewards/update/id`, payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  // TODO: add updateUserRewardBalance method
  async updateUserRewardBalance(payload: {
    userId: number;
    newBalance: number;
  }) {
    try {
      const response = await this.client.post('/user/admins/update-reward-balance', payload);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async fetchRewards({
                       page,
                       perPage,
                       status,
                       projectCode,
                       searchQuery,
                       sortOrder,
                     }: {
    page: number;
    perPage: number;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "" | Array<"PENDING" | "APPROVED" | "REJECTED" | "">;
    projectCode: any;
    searchQuery?: string;
    sortOrder?: "asc" | "desc";
  }) {
    try {
      const statusQueryParam = Array.isArray(status) ? status.join(",") : status;
      const response = await this.client.get(
          `/rewards/fetch/all?page=${page}&perPage=${perPage}&status=${statusQueryParam}&projectCode=${projectCode}&searchQuery=${searchQuery || ''}&sortOrder=${sortOrder || 'asc'}`
      );
      return response?.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }


  async getUserRewards(page: number, perPage: number, status?: string | string[]) {
    try {
      const response = await this.client.get(
          `/rewards/user?page=${page}&perPage=${perPage}${status ? `&status=${status}` : ''}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getAllRewards(page:number,perPage:number,search?:string,status?:string): Promise<any> {
    try {
        const params: Record<string, any> = {};

        if (page !== undefined) params.page = page;
        if (perPage !== undefined) params.perPage = perPage;
        if (search) params.searchQuery = search;
        if (status) params.status = status;
        
        const response:any = await this.client.get('/rewards/fetch/all/paginated',{ params });
        return response.data;
    } catch (error: any) {
        this.handleError(error);
    }
}
}

export default RewardService;
