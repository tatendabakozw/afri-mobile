import {AuthState} from "./AuthState";
import { UserSliceState } from "./UserSliceState";
import {ProfileSliceFinalState} from "./ProfileSliceFinalState";
import {NotificationSliceState} from "./NotificationSliceState";
import {ProjectsSliceState} from "./Project";
import {ClientsSliceState} from "./Clients";

export interface RootState {
    auth: AuthState
    user: UserSliceState
    profile: ProfileSliceFinalState
    notification: NotificationSliceState
    projects: ProjectsSliceState
    clients: ClientsSliceState
    payoutlimit: any
    datasets: any
    rewards: any
    country: any
}