import { UserRole } from "./";

export interface UserProfile {
    email: string;
    role: UserRole;
}

export interface UserSliceState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
}


