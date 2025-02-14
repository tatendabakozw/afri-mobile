export interface AgeRange {
    min: number;
    max: number;
}

export interface Answer {
    value: string;
    label: string;
}

export interface CustomCriteria {
    question: string;
    criteriaKey: string;
    answers: Answer[];
    questionType: string;
    answerType: string;
}

export interface TargetAudienceData {
    gender: string[];
    ageRanges: AgeRange[];
    customCriteria: CustomCriteria[];
}

export interface SurveyData {
    title: string;
    description: string;
    json: object;
}

export interface CreateDIYProjectPayload {
    studyName: string;
    description: string;
    countryCodes: string[];
    totalCompleteLimit: number;
    deviceRestrictions: string[];
    languageRestrictions: string[];
    loi: number;
    cpi: number;
    internalStudyName?: string;
    targetAudienceData: TargetAudienceData;
    surveyData?: SurveyData;
}


export interface RespondentAnswerDto {
    questionId: number;
    answer: string;
}

export interface UpdateDIYProjectPayload {
    description?: string;
    countryCode?: string;
    isLive?: boolean;
    status?: string;
    totalCompleteLimit?: number;
    isReadyToRun?: boolean;
    sampleId?: string;
    surveyLinkTemplate?: string;
    startDate?: string;
    endDate?: string;
    surveyData?: string;
    deviceRestrictions?: string;
    languageRestrictions?: string;
    loi?: number;
    cpi?: number;
    studyName?: string;
}

export interface CompleteSurveyPayload {
    projectId: number;
    projectCode: string;
    responses: any;
}
