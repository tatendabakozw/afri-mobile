import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import WebView from 'react-native-webview';
import DiyService from '@/api/services/diy/DiyService';
import { decryptData, encryptData } from '@/helpers/encryption';
import PrimaryAlert from '@/components/alerts/primary-alert';
import getGeoIp from '@/utils/geo-ip';
import QuestionItem from '@/components/question-item/question-item';
import QualificationService from '@/api/services/qualification/QualificationService';

interface Translation {
    language: string;
    translatedText?: string;
    label?: string;
}

interface AnswerOption {
    label: string;
    option: string;
    translations?: Translation[];
}

interface ScreeningQuestion {
    questionId: number;
    question: string;
    questionType: 'single_choice' | 'multiple_choice' | 'open_text';
    answerOptions: AnswerOption[];
    translations?: Translation[];
}

interface Alert {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

const detectDeviceType = (): 'Mobile' | 'Tablet' | 'Desktop' => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        return 'Mobile';
    }
    return 'Desktop';
};

const FeatureSurveyScreening = () => {
    const params = useLocalSearchParams();
    // const { t } = useTranslation();
    const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
    const [responses, setResponses] = useState<Record<number, string | string[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [alert, setAlert] = useState<Alert | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [geoIpCountry, setGeoIpCountry] = useState<string>('');
    const [deviceRestricted, setDeviceRestricted] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
    const [pCode, setPCode] = useState('');
    const TARGET_SUITABLE = 'TARGET_SUITABLE';
    const [globalHostingType, setGlobalHostingType] = useState<string>('');
    const [redirecting, setRedirecting] = useState<boolean>(false);

    const diyService = new DiyService();
    const qualificationService = new QualificationService();

    const fetchGeoIpDetails = async (): Promise<void> => {
        try {
            const geoIpDetails = await getGeoIp();
            if (geoIpDetails.data) {
                setGeoIpCountry(geoIpDetails.data.country_code);
            }
        } catch {
            return;
        }
    };

    const checkDeviceCompatibility = (deviceRestrictions: string[]): void => {
        if (!deviceRestrictions || !Array.isArray(deviceRestrictions)) {
            // If deviceRestrictions is undefined or not an array, don't restrict any devices
            return;
        }
        
        const deviceType = detectDeviceType();
        if (deviceRestrictions.includes(deviceType.toLowerCase())) {
            setDeviceRestricted(true);
        }
    };

    const handleCopy = async () => {
        try {
            await Clipboard.setStringAsync(params.url as string);
            setCopySuccess("t('preScreening.copy_link_success')");
            setTimeout(() => setCopySuccess(null), 3000);
        } catch (error) {
            setCopySuccess("t('preScreening.copy_link_failure')");
            setTimeout(() => setCopySuccess(null), 3000);
        }
    };

    const redirectToResult = async (projectCode: string, status: string) => {
        const encryptedStatus = await encryptData({ projectCode, status });
        router.push(`/(results)/index?data=${encodeURIComponent(encryptedStatus)}`);
    };

    const redirectToExternalSite = (url: string) => {
        setRedirecting(true);
        setWebViewUrl(url);
    };

    const handleResponseChange = (questionId: number, value: string | string[], type: string) => {
        if (type === 'multiple_choice') {
            setResponses((prev:any) => {
                const currentSelection = (prev[questionId] as string[]) || [];
                return {
                    ...prev,
                    [questionId]: currentSelection.includes(value as string)
                        ? currentSelection.filter(v => v !== value)
                        : [...currentSelection, value]
                };
            });
        } else {
            setResponses(prev => ({ ...prev, [questionId]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            if (hasIncompleteAnswers()) {
                setAlert({ type: 'error', message: "All questions are mandatory" });
                return;
            }

            const decryptedData = await decryptData(params.data as string);
            if (!decryptedData) {
                setAlert({ type: 'error', message: "Error on prescreening" });
                return;
            }

            const { projectCode, projectId } = decryptedData as any;
            setLoading(true);

            const response = await qualificationService.responentScreeningFinisher(
                projectCode,
                formatResponses(responses)
            );

            if (response.data.data.status === TARGET_SUITABLE) {
                const encryptedStartStatus = await encryptData({ 
                    projectCode, 
                    status: 'STARTED' 
                });
                await qualificationService.updateRespondentStatus(encryptedStartStatus);
                redirectToExternalSite(response?.data?.data.surveyLinkTemplate);
            } else {
                redirectToResult(projectCode, response.data.data.status);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                redirectToResult(pCode, 'TARGET_UNSUITABLE');
            } else if (error.response?.status === 400 && error.response.data.message === 'QUOTA_FULL') {
                redirectToResult(pCode, 'QUOTA_FULL');
            } else {
                handleError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const hasIncompleteAnswers = (): boolean => {
        return questions.some((question) => {
            const response = responses[question.questionId];
            if (question.questionType === 'single_choice' || question.questionType === 'open_text') {
                return !response;
            }
            if (question.questionType === 'multiple_choice') {
                return !response || (response as string[]).length === 0;
            }
            return false;
        });
    };

    const formatResponses = (responses: { [key: string]: any }) => {
        return Object.keys(responses).map((key) => ({
            questionId: Number(key),
            answer: Array.isArray(responses[Number(key)])
                ? (responses[Number(key)] as string[]).join(',')
                : (responses[Number(key)] as string),
        }));
    };

    const handleResponseStatus = (status: string) => {
        if (status.toLowerCase() === TARGET_SUITABLE.toLowerCase()) {
            // router.push(`/survey/internal/start?projectCode=${pCode}`);
        } else {
            redirectToResult(pCode, 'TARGET_UNSUITABLE');
        }
    };

    const handleError = (error: any) => {
        console.log("error: ", error)
        const errorMessage =
            error.response?.status === 403
                ? "tForbidden"
                : error.response?.data?.errors
                    ? error.response.data.errors[0].message || "Error on prescreening"
                    :"Error on prescreening";
        setError(errorMessage);
        setAlert({ type: 'error', message: errorMessage });
    };

    const initiateScreeningProcess = useCallback(
        async (projectCode: string, countryCode: string, deviceRestrictions: string[], testFlag: boolean) => {
            try {
                if (!testFlag) {
                    // Check geo-ip location
                    const isGeoIpValid = await validateGeoIpLocation(countryCode);
                    if (!isGeoIpValid) {
                        redirectToResult(projectCode, 'GEO_LOCKED');
                        return;
                    }

                    // Check device compatibility
                    const isDeviceCompatible = validateDeviceCompatibility(deviceRestrictions);
                    if (!isDeviceCompatible) {
                        redirectToResult(projectCode, 'TARGET_UNSUITABLE');
                        return;
                    }
                }

                const response = await qualificationService.initiateScreening(projectCode);
                const status = response?.data?.data?.status;

                if (status === TARGET_SUITABLE) {
                    if (globalHostingType !== 'INTERNAL') {
                        redirectToExternalSite(response?.data?.data.surveyLinkTemplate);
                        return;
                    }
                    // Implement internal survey redirect
                    // router.push(`/(survey)/internal/start?projectCode=${projectCode}`);
                    return;
                } else if (status === 'TARGET_UNSUITABLE') {
                    redirectToResult(projectCode, 'TARGET_UNSUITABLE');
                    return;
                }

                const questions = response?.data?.data?.questions || [];
                if (questions.length === 0) {
                    if (globalHostingType !== 'INTERNAL') {
                        redirectToExternalSite(response?.data?.data.surveyLinkTemplate);
                        return;
                    }
                    // Handle internal survey start
                } else {
                    setQuestions(questions);
                }
            } catch (error: any) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const validateGeoIpLocation = async (countryCode: string): Promise<boolean> => {
        try {
            const geoIpDetails = await getGeoIp();
            if (geoIpDetails?.data?.country_code) {
                const resolvedCountryCode = geoIpDetails.data.country_code.toLowerCase();
                setGeoIpCountry(resolvedCountryCode);
                return resolvedCountryCode === countryCode?.toLowerCase();
            }
        } catch (error) {
            return false;
        }
        return false;
    };

    const validateDeviceCompatibility = (deviceRestrictions: string[]): boolean => {
        if (!deviceRestrictions || !Array.isArray(deviceRestrictions)) {
            return true;
        }
        const deviceType = detectDeviceType();
        if (deviceRestrictions.includes(deviceType.toLowerCase())) {
            setDeviceRestricted(true);
            return false;
        }
        return true;
    };

    const fetchScreeningData = async (): Promise<void> => {
        setLoading(true);
        try {
            if (!params.data) {
                throw new Error("Error on prescreening");
            }

            const decryptedData = await decryptData(params.data as string);
            console.log("prescreening data: ", decryptedData);
            
            if (!decryptedData) {
                throw new Error("Error on prescreening");
            }

            const { 
                projectCode = '', 
                projectId = '', 
                countryCode = '', 
                deviceRestrictions = [], 
                surveyHostingType = '',
                isTest = false 
            } = decryptedData as any;

            setPCode(projectCode);
            setGlobalHostingType(surveyHostingType);

            // Start screening process
            await initiateScreeningProcess(projectCode, countryCode, deviceRestrictions, isTest);

        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScreeningData();
    }, [params.data]);

    const handleCancel = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmCancel = () => {
        setResponses({});
        setShowConfirmModal(false);
        try {
            router.back();
        } catch {
            // Fallback to a default route if back() fails
            router.push('/');  // or whatever your home route is
        }
    };

    const getTranslatedText = (
        translations: Translation[] | undefined,
        defaultText: string
    ) => {
        if (!translations) return defaultText;
        const currentLang = translations.find(t => t.language === 'en'); // or use your language selector
        return currentLang?.translatedText || currentLang?.label || defaultText;
    };

    if (loading || redirecting) {
        return <View>
            <Text>loading</Text>
        </View>;
    }

    if (webViewUrl) {
        return (
            <WebView
                source={{ uri: webViewUrl }}
                style={tw`flex-1`}
                onError={() => {
                    setAlert({
                        type: 'error',
                        message: "t('preScreening.webview_error')"
                    });
                    setWebViewUrl(null);
                }}
            />
        );
    }

    if (deviceRestricted) {
        return (
            <ScrollView style={tw`flex-1 bg-white`}>
                <View style={tw`p-4`}>
                    <Text style={tw`text-2xl font-bold mb-4`}>
                        'preScreening.device_restriction_title'
                    </Text>
                    <Text style={tw`text-base mb-4`}>
                       'preScreening.device_restriction_paragraph'
                    </Text>
                    
                    <View style={tw`bg-gray-100 p-4 rounded-lg mb-4`}>
                        <TextInput
                            value={params.url as string}
                            editable={false}
                            style={tw`bg-white p-2 rounded mb-2`}
                        />
                        <TouchableOpacity 
                            onPress={handleCopy}
                            style={tw`bg-[#32B3C2] p-3 rounded-lg items-center`}
                        >
                            <Text style={tw`text-white font-medium`}>
                              'preScreening.copy_link_button'
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    {copySuccess && (
                        <Text style={tw`text-green-600 text-center mb-4`}>
                            {copySuccess}
                        </Text>
                    )}

                    <View style={tw`mt-4`}>
                        <Text style={tw`text-xl font-bold mb-4`}>
                           'preScreening.supported_devices_heading'
                        </Text>
                        <View style={tw`flex-row justify-around`}>
                            {['Mobile', 'Tablet', 'Desktop'].map((device) => (
                                <View key={device} style={tw`items-center`}>
                                    <Ionicons 
                                        name={
                                            device === 'Mobile' ? 'phone-portrait' :
                                            device === 'Tablet' ? 'tablet-portrait' :
                                            'desktop'
                                        }
                                        size={24}
                                        color="#32B3C2"
                                    />
                                    <Text style={tw`mt-2`}>{device}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`p-4`}>
                {alert && (
                    <PrimaryAlert 
                        type={alert.type} 
                        message={alert.message} 
                        // onClose={() => setAlert(null)} 
                    />
                )}

                {!error ? (
                    <>
                        <Text style={tw`text-2xl font-bold mb-4`}>
                            'preScreening.prescreening_heading'
                        </Text>
                        <Text style={tw`text-base mb-4`}>
                           'preScreening.prescreening_paragraph'
                        </Text>
                    </>
                ) : (
                    <Text style={tw`text-red-500 mb-4`}>{error}</Text>
                )}

                {!error && questions.length > 0 && (
                    <View>
                        {questions.map((question) => (
                            <QuestionItem 
                                key={question.questionId}
                                question={question}
                                responses={responses}
                                onResponseChange={handleResponseChange}
                                getTranslatedText={getTranslatedText}
                            />
                        ))}

                        <View style={tw`flex-row justify-between mt-6`}>
                            <TouchableOpacity 
                                onPress={handleSubmit}
                                style={tw`bg-[#32B3C2] px-6 py-3 rounded-lg flex-1 mr-2`}
                            >
                                <Text style={tw`text-white text-center font-medium`}>
                                    'preScreening.submit_button'
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={handleCancel}
                                style={tw`bg-gray-200 px-6 py-3 rounded-lg flex-1 ml-2`}
                            >
                                <Text style={tw`text-gray-700 text-center font-medium`}>
                                    'preScreening.cancel_button'
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* {showConfirmModal && (
                <ConfirmationModal 
                    onConfirm={handleConfirmCancel}
                    onDeny={() => setShowConfirmModal(false)}
                    message={t('preScreening.cancel_modal_message')}
                />
            )} */}
        </ScrollView>
    );
};

export default FeatureSurveyScreening;