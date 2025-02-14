export interface UpdateUserProfilePayload {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    phoneNumber: string;
    country: string;
    city: string;
    address: string;
    subdivisionCode?: string;
    zipCode?: string;
    longitude?: number;
    latitude?: number;
    languages: string[];
}
