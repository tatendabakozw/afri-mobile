export interface UserRegistrationPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    retypePassword: string;
    acceptedTermsAndConditions: boolean;
    dob?: string;
    gender?: string;
    country?: string;
    countryCode?: string;
}