export interface LinkDto {
    testLink: string;
    liveLink: string;
}

export interface DateDto {
    startDate: string | null;
    endDate: string | null;
}

export interface AgeRangeDto {
    min: number;
    max: number;
}

export interface AnswerDto {
    value: string;
    label: string;
}

export interface CustomCriteriaDto {
    question: string;
    criteriaKey: string;
    answers: AnswerDto[];
    questionType: string;
    answerType: string;
}

export interface TargetAudienceDto {
    gender: string[];
    ageRanges: AgeRangeDto[];
    customCriteria?: CustomCriteriaDto[];
}

export interface TargetRelationDto {
    parent: string;
    children: TargetRelationDto[];
    limit: number;
}

export interface InterviewerDto {
    name: string;
}

export interface TargetRelation {
    parent: string;
    children: TargetRelation[];
    limit?: number;
}

export interface Admin {
    id: number;
    personDetails: {
        firstName: string;
        lastName: string;
        email: string;
    };
}



export interface CreateCawiInitialDto {
    projectType: string;
    client: string;
    countryCode: string;
    wave: number;
    description: string;
    isLive: boolean;
    totalCompleteLimit: number;
    enabledViaWebApp: boolean;
    enabledForAdmin: boolean;
    isReadyToRun: boolean;
    sampleId: string;
    isRecontact: boolean;
    surveyLinkTemplate: string;
    languageRestrictions: string[];
    excludeCriteria: string[];
    deviceRestrictions: string[];
    recontactFrom: string;
    external: boolean;
    surveyLinkLive: string;
    surveyLinkTest: string;
    interviewers: InterviewerDto[];
    cpi: string;
    ir: string;
    loi: string;
    usdAmount: string;
    localCurrency: string;
    totalLocalAmount: string;
    projectManagers: string[];
    targetAudience: TargetAudienceDto;
    targetRelations: TargetRelationDto[];
    liveStatus: string;
    enableViaWebApp: string;
    enableViaAdmin: string;
    forceAllQuotas: string;
    projectNumber?: number;
}

export interface CreateCawiIncrementDto {
    projectCode: string;
    waveNumber: number;
    isLive: boolean;
    status: string;
    totalCompleteLimit: number;
    enabledViaWebApp: boolean;
    enabledForAdmin: boolean;
    isReadyToRun: boolean;
    isRecontact: boolean;
    languageRestrictions: string[];
    deviceRestrictions: string[];
    excludeCriteria: string[];
    cpi: string;
    ir: string;
    loi: string;
    usdAmount: string;
    localCurrency: string;
    totalLocalAmount: string;
    projectManagers: string[];
    quotaLimit: number;
    links: LinkDto;
}

export interface CreateRecontactProjectDto {
    projectCode: string;
    criteriaType: 'respondent_status' | 'date_range' | 'respondent_id';
    criteriaValue: string | string[];
    links: LinkDto;
    dates: DateDto;
    cpi: string;
    ir: string;
    loi: string;
    usdAmount: string;
    localCurrency: string;
    totalLocalAmount: string;
    projectManagers: string[];
    isLive: boolean;
    status: string;
    enabledViaWebApp: boolean;
    enabledForAdmin: boolean;
    isReadyToRun: boolean;
    languageRestrictions: string[];
    excludeCriteria: string[];
    deviceRestrictions: string[];
}

export interface CreateCapiProjectDto {
    projectType: string;
    client: string;
    countryCode: string;
    wave: number;
    description: string;
    isLive: boolean;
    status: string;
    totalCompleteLimit: number;
    enabledViaWebApp: boolean;
    enabledForAdmin: boolean;
    isReadyToRun: boolean;
    sampleId: string;
    isRecontact: boolean;
    surveyLinkTemplate: string;
    dates: DateDto;
    external: boolean;
    interviewers: InterviewerDto[];
    cpi: string;
    ir: string;
    loi: string;
    usdAmount: string;
    localCurrency: string;
    totalLocalAmount: string;
    projectManagers: string[];
    targetAudience: TargetAudienceDto;
    targetRelations: TargetRelationDto[];
    links: LinkDto;
}
