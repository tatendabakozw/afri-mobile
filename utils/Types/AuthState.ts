import { UserState } from "./UserState";

export interface AuthState {
    isAuthenticated: boolean;
    user: UserState | null;
    jwt: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    mfaRequired: boolean;
    loading: boolean;
    error: string | null;

}