export enum ProjectStatus {
    DRAFT = 'DRAFT',
    LIVE = 'LIVE',
    COMPLETED = 'COMPLETED',
    PAUSED = 'PAUSED',
    STOPPED = 'STOPPED'
}

export interface ProjectManager {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface Project {
    id: number;
    projectCode: string;
    description: string;
    status: ProjectStatus;
    projectManager: ProjectManager[];
    client: string;
    countryCode: string;
    projectType: string;
    isLive: boolean;
    enabledViaWebApp: boolean;
    startDate: string;
    createdAt: string;
}

export interface ProjectsSliceState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}
