export interface AnswerOptionTranslation {
    language: string;
    label: string;
}

export interface AnswerOption {
    value: string;
    label: string;
    translations?: AnswerOptionTranslation[];
}

export interface ScreeningQuestionTranslation {
    language: string;
    translatedText: string;
}

export interface CreateUpdateScreeningQuestionPayload {
    criteriaKey: string;
    question: string;
    questionType: string;
    answerType: string;
    answerOptions: AnswerOption[];
    translations?: ScreeningQuestionTranslation[];
    countryCode?: string;
}

export interface ScreeningQuestion {
    id: number;
    criteriaKey: string;
    question: string;
    questionType: string;
    answerType: string;
    answerOptions: AnswerOption[];
    selectedAnswers?: string[];
    countryCode?: string;
}



