export enum UserRole {
    Panelist = 'panelist',
    Admin = 'admin',
    SuperAdmin = 'super_admin',
    ProjectManager = 'project_manager',
    Developer = 'developer',
}

export interface UserState {
    id: string;
    email: string;
    role: UserRole;
}