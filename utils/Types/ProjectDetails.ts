const enum ProjectStatus {
    DRAFT = 'DRAFT',
    LIVE = 'LIVE',
    COMPLETED = 'COMPLETED',
    PAUSED = 'PAUSED',
}

export interface ProjectMetrics {
    ir: number;
    base: number | null;
    loi: number;
    cpi: number;
    actualIr: number | null;
    averageLoi: number | null;
    potentialOutliers: number;
    totalCompletes: number;
    quartiles: {
        Q1: number;
        Q2: number;
        Q3: number;
    }
}

export interface Quota {
    id: number;
    criteria: string;
    limit: number;
    totalEngaged: number;
    isClosed: boolean;
}

export interface Client {
    id: number;
    name: string;
    code: string;
}

export interface Respondent {
    respondentId: number;
    status: string;
    actualLoi: number | null;
    quotaId: number;
    quotaCriteria: string;
    createdAt: string;
}

export interface IncentivePackage {
    id: number;
    loi: number;
    usdAmount: number;
    localAmount: number;
    localCurrency: string;
    createdAt: string;
    isActive?: boolean;
}

export interface Restriction {
    type: string;
    restriction: string;
}

export interface TargetCriteria {
    criteria: string;
    values: string;
}

export interface TargetGroup {
    targetCriteria: TargetCriteria[];
    quotas: Quota[];
}

export interface Interviewer {
    name: string;
    respondents: Respondent[];
}

export interface ProjectDetails {
    status: ProjectStatus | null;
    id: number;
    projectCode: string;
    description: string;
    projectType: string;
    countryCode: string;
    client: Client;
    isLive: boolean;
    totalCompleteLimit: number;
    enabledViaWebApp: boolean;
    enabledForAdmin: boolean;
    isReadyToRun: boolean;
    sampleId: string;
    isRecontact: boolean;
    surveyLinkTemplate: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    restrictions: Restriction[];
    exclusions: any[];
    waves: any[];
    projectMetrics: ProjectMetrics;
    incentivePackages: IncentivePackage[];
    targetGroups: TargetGroup[];
    projectTags: any[];
    invitations: any[];
    respondents: Respondent[];
    projectStatusHistories: any[];
    projectInflows: any[];
    recontactCriteria: any[];
    respondentStatuses: Array<{ status: string; total: number }>;
    interviewers: Interviewer[];
}