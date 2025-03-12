import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import WebView from 'react-native-webview';
import { decryptData, encryptData } from '@/helpers/encryption';
import PrimaryAlert from '@/components/alerts/primary-alert';
import getGeoIp from '@/utils/geo-ip';
import QuestionItem from '@/components/question-item/question-item';
import QualificationService from '@/api/services/qualification/QualificationService';
import EnrollmentLayout from '@/layouts/EnrollmentLayout';
import ConfirmationAlert from '@/components/alerts/confirmation-alert';

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
            setCopySuccess("Link copied successfully!");
        } catch (error) {
            setCopySuccess("Failed to copy link.");
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
            setResponses((prev: any) => {
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
            const decryptedData = await decryptData(params.data as string);
            if (!decryptedData) {
                setError("Invalid or expired link. Redirecting to home...");
                return;
            }
            const { projectCode } = decryptedData as any;

            console.log("🚀 ===== SUBMISSION START =====");
            console.log("📝 Project Code:", projectCode);

            setLoading(true);

            const formattedResponses = Object.keys(responses).map((key) => {
                const answer = responses[Number(key)];
                return {
                    questionId: Number(key),
                    answer: Array.isArray(answer) ? answer.join(',') : answer
                };
            });

            console.log("📤 Request Data:", {
                projectCode,
                responses: formattedResponses
            });

            const response = await qualificationService.responentScreeningFinisher(
                projectCode,
                formattedResponses
            );

            // response is already the data object, no need for response?.data
            console.log("📥 API Response:", response);

            if (response?.status === TARGET_SUITABLE) {
                console.log("✅ Status is TARGET_SUITABLE");
                const encryptedStartStatus = await encryptData({
                    projectCode,
                    status: 'STARTED'
                });
                await qualificationService.updateRespondentStatus(encryptedStartStatus);
                
                if (response.surveyLink) {
                    redirectToExternalSite(response.surveyLink);
                } else {
                    redirectToResult(projectCode, 'TARGET_UNSUITABLE');
                }
            } else {
                const status = response?.status?.toUpperCase() || 'TARGET_UNSUITABLE';
                redirectToResult(projectCode, status);
            }
        } catch (error: any) {
            console.log("💥 ERROR in submission:", {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            if (error.response?.status === 403) {
                redirectToResult(pCode, 'TARGET_UNSUITABLE');
            } else if (error.response?.status === 400 && error.response.data.message === 'QUOTA_FULL') {
                redirectToResult(pCode, 'QUOTA_FULL');
            } else {
                setAlert({
                    type: 'error',
                    message: "An error occurred while submitting answers. Please try again later."
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error: any) => {
        console.log("error: ", error)
        const errorMessage =
            error.response?.status === 403
                ? "Forbidden: You are not permitted to participate in this survey."
                : error.response?.data?.errors
                    ? error.response.data.errors[0].message || "Invalid or expired link. Redirecting to home..."
                    : "Invalid or expired link. Redirecting to home...";
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

                // The response structure is different - questions are at the top level
                const questions = response?.data?.questions || [];

                if (questions.length > 0) {
                    setQuestions(questions);
                } else {
                    // If no questions, treat as TARGET_SUITABLE
                    if (globalHostingType !== 'INTERNAL') {
                        // Since there's no surveyLinkTemplate in the response,
                        // we might need to get it from another endpoint or handle differently
                        // For now, redirect to unsuitable
                        redirectToResult(projectCode, 'TARGET_UNSUITABLE');
                        return;
                    }
                    // Handle internal survey start if needed
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
           <EnrollmentLayout>
             <ScrollView style={tw`flex-1`}>
                <View style={tw`p-4`}>
                    <Text style={tw`text-2xl font-bold mb-4`}>
                        Device Not Supported
                    </Text>
                    <Text style={tw`text-base mb-4`}>
                        Your current device is not supported for this survey. Please copy the link below and use it on a supported device.
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
                                Copy Link
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
                            Supported Devices:
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
           </EnrollmentLayout>
        );
    }

    return (
        <EnrollmentLayout loading={loading || redirecting}>
            <ScrollView style={tw`flex-1 bg-white`}>
                <View style={tw`p-4`}>
                    {/* Only show non-validation alerts at the top */}
                    {alert && alert.type !== 'error' && (
                        <PrimaryAlert
                            type={alert.type}
                            message={alert.message}
                        />
                    )}

                    {!error ? (
                        <>
                            <Text style={tw`text-2xl font-bold mb-4`}>
                                Help Us Know You Better
                            </Text>
                            <Text style={tw`text-base mb-4`}>
                                A few simple questions will help us match you with the perfect surveys.
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

                            <View>
                                {/* Add error message above the buttons */}
                                {alert?.type === 'error' && (
                                    <Text style={tw`text-red-500 text-center mb-4`}>
                                        {alert.message}
                                    </Text>
                                )}

                                <View style={tw`flex-row justify-between mt-6`}>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={tw`bg-[#32B3C2] px-6 py-3 rounded-lg flex-1 mr-2`}
                                    >
                                        <Text style={tw`text-white text-center font-medium`}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleCancel}
                                        style={tw`bg-gray-200 px-6 py-3 rounded-lg flex-1 ml-2`}
                                    >
                                        <Text style={tw`text-gray-700 text-center font-medium`}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                <ConfirmationAlert
                    visible={showConfirmModal}
                    title="Cancel"
                    message="Cancelling now will prevent you from receiving the reward. Are you sure you want to cancel?"
                    buttons={[
                        {
                            text: "No",
                            onPress: () => setShowConfirmModal(false),
                            style: "cancel"
                        },
                        {
                            text: "Yes",
                            onPress: handleConfirmCancel,
                            style: "destructive"
                        }
                    ]}
                    onClose={() => setShowConfirmModal(false)}
                />
            </ScrollView>
        </EnrollmentLayout>
    );
};

export default FeatureSurveyScreening;