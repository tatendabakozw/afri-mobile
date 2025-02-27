import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';
import ProjectService from '@/api/services/project/ProjectService';
import SurveyLoading from '@/components/loading-components/survey-loading';
import DiyService from '@/api/services/diy/DiyService';
import { encryptData } from '@/helpers/encryption';
import { useRouter } from 'expo-router';

type Survey = {
    id: number;
    projectCode: string;
    projectId?: number;
    amount: string;
    duration: string;
    expires: string;
    countryCode: string;
    deviceRestrictions: string[];
    type: 'main' | 'featured';
    surveyHostingType?: string
    projectType?: "cint_projects" | 'main_projects' | 'diy_projects' | 'tolune_reg'
    url: string
    tolunaProfileCompleted?: boolean
};


const SurveysList = () => {

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
    const router = useRouter()
    const fetchSurveys = useMemo(() => async () => {
        setLoading(true);
        let fetchedSurveys: Survey[] = [];

        try {
            const [
                internalResponse,
                featuredResponse, 
                cintResponse,
                tolunaRegResponse
            ] = await Promise.all([
                new ProjectService().fetchEligibleProjects(),
                new DiyService().fetchUserEligibleDIYProjects(),
                new DiyService().fetchUserEligibleCintProjects(),
                new ProjectService().checkTolunaRegistration()
            ]);


            const tolunaRegSurveys = tolunaRegResponse.data.status ? tolunaRegResponse.data.surveys.map((project: any, index: number) => ({
                id: project.SurveyID,
                projectCode: project.SurveyID,
                countryCode: '',
                deviceRestrictions: [],
                amount: project.MemberAmount,
                duration: project.Duration,
                // expires: t('surveyList.expires_in'),
                type: 'main' as const,
                projectType: "tolune_reg",
                url: decodeURIComponent(project.URL)
            })) 
            : [];

            const mainSurveys = internalResponse.data.map((project: any, index: number) => ({
                id: index + 1,
                projectCode: project.projectCode,
                countryCode: project.countryCode,
                deviceRestrictions: project.deviceRestrictions,
                amount: project.amount,
                duration: project.duration,
                // expires: t('surveyList.expires_in'),
                type: 'main' as const,
                projectType: "main_projects"
            }));

            const featuredSurveys = featuredResponse?.data?.data?.map((project: any, index: number) => ({
                id: mainSurveys.length + index + 1,
                projectCode: project.projectCode,
                projectId: project.projectId,
                countryCode: project.countryCode,
                deviceRestrictions: project.deviceRestrictions,
                amount: project.amount,
                duration: project.duration,
                // expires: t('surveyList.expires_in'),
                type: 'featured' as const,
                surveyHostingType: project?.surveyHostingType,
                projectType:"diy_projects"
            }));

            const cintSurveys = cintResponse?.data?.data?.map((project: any, index: number) => ({
                id: mainSurveys.length + index + 1,
                projectCode: project.projectCode,
                projectId: project.projectId,
                countryCode: project.countryCode,
                deviceRestrictions: project.deviceRestrictions,
                amount: project.amount,
                duration: project.duration,
                // expires: t('surveyList.expires_in'),
                type: 'featured' as const,
                surveyHostingType: project?.surveyHostingType,
                page:"",
                projectType:"cint_projects"
            }));

            fetchedSurveys = [
                ...mainSurveys,
                ...(tolunaRegSurveys || []), 
                ...(featuredSurveys || []), 
                ...(cintSurveys || [])
            ];
        } catch (error: any) {
            setAlert({ message: error.message, type: 'error' });
        }

        setSurveys(fetchedSurveys);
        setLoading(false);
    }, []);

    const handleStartSurvey =async (survey: Survey) => {
        const data = survey.type === 'featured' ? {
            projectCode: survey.projectCode,
            projectId: survey.projectId,
            countryCode: survey.countryCode,
            deviceRestrictions: survey.deviceRestrictions,
            surveyHostingType: survey.surveyHostingType
        } : {
            projectCode: survey.projectCode,
            projectId: survey.projectId,
            countryCode: survey.countryCode,
            deviceRestrictions: survey.deviceRestrictions,
        };

        const encodedData = await encryptData(data);

        if (survey.projectType === 'cint_projects') {
            router.push(`/(redirects)/cint-enrollment?data=${encodeURIComponent(encodedData)}`);
            return;
        }

        if (survey.projectType === 'tolune_reg') {
            // Handle external URL opening in React Native
            Linking.openURL(survey.url);
            return;
        }

        router.push(`/(redirects)/enrollment?data=${encodeURIComponent(encodedData)}`);
    };

    useEffect(() => {
        fetchSurveys();
    }, [fetchSurveys]);

    return (
        <View style={tw`flex flex-col overflow-hidden`}>
            {/* Table Header */}
            <View style={tw`flex flex-row items-center p-3 rounded-xl w-full `}>
                <Text style={tw`flex-1 text-left font-bold text-gray-950`}>Amount</Text>
                <Text style={tw`flex-1 text-center font-bold text-gray-950`}>Duration</Text>
                <Text style={tw`flex-1 text-right font-bold text-gray-950`}>Start</Text>
            </View>

            {/* Survey Rows */}
            {loading ? (
                <SurveyLoading />
            ) : surveys.length > 0 ? (
                surveys.map((survey, index) => (
                    <TouchableOpacity
                    onPress={() => handleStartSurvey(survey)}
                        key={survey.id}
                        style={tw`flex flex-row items-center p-3 rounded-xl w-full ${index % 2 === 0 ? 'bg-zinc-200/50' : ''
                            }`}
                    >
                        <Text style={tw`flex-1 text-left text-gray-950 font-bold`}>
                            {survey.amount}
                        </Text>
                        <Text style={tw`flex-1 text-center text-gray-600`}>
                            {survey.duration}
                        </Text>
                        <Text style={tw`flex-1 text-right text-gray-600`}>
                            <Ionicons name="chevron-forward" size={24} color="#32B3C2" />
                        </Text>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={tw`py-8 items-center`}>
                    <Text style={tw`text-gray-500 text-base`}>No surveys available</Text>
                </View>
            )}
        </View>
    )
}

export default SurveysList

const styles = StyleSheet.create({})