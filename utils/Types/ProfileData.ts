export type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    gender: string;
    dob: string;
    subdivisionCode?: string;
    countryCode?: string;
    zipCode?: string;
    languages: string[];
    longitude?: number;
    latitude?: number;
    payoutAccounts?:any[]
};
