import apiClient from '@/api/apiClient';
import { API_PROD_URL, CRYPTO_KEY } from '@/constants/env';
import axios, { AxiosInstance} from 'axios';
import CryptoJS from 'crypto-js';

class QualificationService {
    private client: AxiosInstance;
    private cryptoKey: string;

    constructor() {
        this.client = apiClient();
        this.cryptoKey = CRYPTO_KEY || 'default_key';
    }

    private handleError(error: any): never {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message || 'An unexpected issue occurred. Please try again later.';
            throw new Error(errorMessage);
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected issue occurred. Please try again later.');
        }
    }

    decryptData(encryptedData: string) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.cryptoKey);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error: any) {
            this.handleError(error);
        }
    }

    encryptData(data: any) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), this.cryptoKey).toString();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async initiateScreening(projectCode: string) {
        try {
            const response = await this.client.get(`/projects/screening/initiate/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }
    async cintInitiateScreening(projectCode: string, language: string) {
        try {
            const response = await this.client.get(`/cint/screening/initiate/${projectCode}/${language}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async initiateInflowScreening(projectCode: string,referralCode: any,auth:string) {
        try{
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${API_PROD_URL}/projects/inflow/screening/initiate/${projectCode}/${referralCode}`,
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${auth}`
                }
            };
            const response = await axios.request(config);
            return response.data;

        }
        catch(error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message)
            }
            this.handleError(error);
        }
    }
    async responentScreeningFinisherInflow(projectCode: string,responses: { questionId: number; answer: string }[],auth:string) {
        try{
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${API_PROD_URL}/projects/screening/respond`,
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${auth}`
                },
                data:{

                projectCode,
                    responses

                }
            };
            const response = await axios.request(config);
            return response.data;

        }
        catch(error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message)
            }
            this.handleError(error);
        }
    }

    async responentScreeningFinisher(projectCode: string, responses: { questionId: number; answer: string }[]) {
        try {
            const response = await this.client.post('/projects/screening/respond', {
                projectCode,
                responses
            });
            console.log("respns on service: ", response)
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async responentScreeningCintFinisher(surveyId: number, responses: any[]) {
        try {
            // Create DTO instance
            const payload = {
                surveyId,
                responses: responses.map((response) => ({
                    questionId: response.questionId,
                    answer: response.answer,
                    precodes: response.precodes,
                })),
            };
    
            // Send the request
            const response = await this.client.post('/cint/handle-screening-responses', payload);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async checkCintFinalStatus(projectCode: string) {
        try {
            const response = await this.client.patch('cint/cint-final-check', {
                projectCode: projectCode
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async updateRespondentStatus(encryptedData: string) {
        try {
            const response = await this.client.patch('/projects/update/respondent/status', {
                data: encryptedData
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateCintRespondentStatus(encryptedData: string) {
        try {
            const response = await this.client.patch('/cint/update/respondent/status', {
                data: encryptedData
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async updateInflowRespondentStatus(encryptedData: string,auth:string) {
        try {

            const config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `${API_PROD_URL}/projects/update/respondent/status`,
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${auth}`
                },
                data:{
                  data:encryptedData
                }

            };

            const response = await axios.request(config)

            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async clientUpdateRespondentStatus(payload: any) {
        try {
            const response = await this.client.post('/projects/client-response', {
                ...payload
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async clientCintUpdateRespondentStatus(payload: any) {
        try {
            const response = await this.client.post('/cint/client-response', {
                ...payload
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async clientTolunaUpdateRespondentStatus(payload: any) {
        try {
            const response = await this.client.post('/toluna/handle-client-response', {
                ...payload
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async clientDIYUpdateRespondentStatus(payload: any) {
        try {
            const response = await this.client.post('/diy/projects/update-diy-respondent-status', {
                ...payload
            });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getSurveyLink(projectCode: string) {
        try {
            const response = await this.client.get(`/projects/survey-link/${projectCode}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


}

export default QualificationService;
