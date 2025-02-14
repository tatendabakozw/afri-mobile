import {ProfileSliceState} from "./ProfileSliceState";

export interface ProfileSliceFinalState {
    profile: ProfileSliceState | null;
    loading: boolean;
    error: string | null;
}