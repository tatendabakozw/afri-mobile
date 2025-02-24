import { AxiosInstance, AxiosResponse } from "axios";
import apiClient from "@/api/apiClient";
import {  ApiResponse,
    Payout,
    CreateBankAccountDto,
    RequestPayoutDto,
    UpdateBankAccountDto,MobileMoneyDto } from "@/utils/Types";

interface PayoutResponse extends ApiResponse {
    data: Payout[];
    pagination: {
        totalPages: number;
        activePage: number;
        totalItemsCount: number;
        itemsCountPerPage: number;
    };
}

interface OperatorCheckPayload {
    countryCode: string;
    phoneNumber: string;
    productType?: string;  // Only needed for Sochitel fallback
}

class PayoutService {
    private client: AxiosInstance;

    constructor() {
        this.client = apiClient();
    }

    async getPayouts(): Promise<PayoutResponse> {
        try {
            const response: AxiosResponse<PayoutResponse> = await this.client.get('/payouts');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    // check availability of the operator
    async checkReloadlyAvailability(): Promise<any> {
        try {
            const response: AxiosResponse<PayoutResponse> = await this.client.get('/reloadly-payments/check/reloadly/availability');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    //check availability of reloadly
    async checkFlutterwaveAvailability(): Promise<any> {
        try {
            const response: AxiosResponse<PayoutResponse> = await this.client.get('/payouts/check/flutterwave/availability');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    // check sotchitel availability
    async checkSochitelAvailability(): Promise<any> {
        try {
            const response: AxiosResponse<PayoutResponse> = await this.client.get('/sochitel-payments/check/balance');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getAllPayouts(page:number,perPage:number,search?:string,status?:string): Promise<PayoutResponse> {
        try {
            const params: Record<string, any> = {};

            if (page !== undefined) params.page = page;
            if (perPage !== undefined) params.perPage = perPage;
            if (search) params.search = search;
            if (status) params.status = status;
            
            const response: AxiosResponse<PayoutResponse> = await this.client.get('/payouts/all',{ params });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async addBankAccount(payload: CreateBankAccountDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/payouts/add-bank-account', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async requestPayout(payload: RequestPayoutDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/payouts/request-payout', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateBankAccount(payload: UpdateBankAccountDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.put('/payouts/update-bank-account', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async mobileMoney(payload: MobileMoneyDto): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/payouts/mobile-money', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getUserBankAccounts(): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get('/payouts/bank-accounts');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getMobileMoneyOperators(phoneNumber: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/payouts/mobile-money-operators/${phoneNumber}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getBanksByCountry(countryCode: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/payouts/banks?countryCode=${countryCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getBankBranches(bankId: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.get(`/payouts/bank-branches?bankId=${bankId}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async createReloadlyPayment(payload: any): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.client.post('/reloadly-payments/create/payment/reloadly', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async checkOperator(payload: any): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.client.post('/reloadly-payments/check/reloadly/operator', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async getSochitelOperators(payload: {
        countryCode: string;
        productType: string;
    }): Promise<ApiResponse> {
        try {
            const response: AxiosResponse<ApiResponse> = await this.client.post('/sochitel-payments/check/operator', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async checkAllOperators(payload: OperatorCheckPayload): Promise<any> {
        try {
            // Try Reloadly first
            try {
                const reloadlyResponse = await this.checkOperator({
                    phoneNumber: payload.phoneNumber,
                    countryCode: payload.countryCode
                });
                if (reloadlyResponse?.data) {
                    return {
                        ...reloadlyResponse,
                        provider: 'reloadly'
                    };
                }
            } catch (error) {
                // Silently fail and try Sochitel
                console.log('Reloadly check failed, trying Sochitel');
            }
    
            // Try Sochitel as fallback
            if (payload.countryCode && payload.productType) {
                const sochitelResponse = await this.getSochitelOperators({
                    countryCode: payload.countryCode,
                    productType: payload.productType
                });
                if (sochitelResponse?.data?.length > 0) {
                    return {
                        ...sochitelResponse,
                        provider: 'sochitel'
                    };
                }
            }
    
            throw new Error('No available operators found for the given criteria');
        } catch (error: any) {
            this.handleError(error);
        }
    }
    
    async createUnifiedPayment(payload: any): Promise<ApiResponse> {
        try {
            switch (payload.provider) {
                case 'reloadly':
                    return await this.createReloadlyPayment(payload);
                case 'sochitel':
                    const response = await this.client.post('/sochitel-payments/create/payment', payload);
                    return response.data;
                default:
                    throw new Error('Invalid payment provider specified');
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }
    async createUnifiedPaymentSochitel(payload:any):Promise<ApiResponse>{
        try {
            const response = await this.client.post('/sochitel-payments/create/payment/sochitel', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async getUserPayouts(page: number = 1, perPage: number = 10, status?: string | string[]): Promise<PayoutResponse> {
        try {
            const response: AxiosResponse<PayoutResponse> = await this.client.get(
                `/payouts/user?page=${page}&perPage=${perPage}${status ? `&status=${status}` : ''}`
            );
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
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
}

export default PayoutService;
