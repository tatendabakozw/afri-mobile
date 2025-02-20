import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';
import ProjectService from '@/api/services/project/ProjectService';

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

    const [currentPage, setCurrentPage] = useState(1);
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    const surveysPerPage = 3;

    const fetchSurveys = useMemo(() => async () => {
        setLoading(true);
        let fetchedSurveys: Survey[] = [];
      
        try {
            const [
                internalResponse, 
                // featuredResponse, 
                // cintResponse,
                // tolunaRegResponse
            ] = await Promise.all([
                new ProjectService().fetchEligibleProjects(),
                // new DiyService().fetchUserEligibleDIYProjects(),
                // new DiyService().fetchUserEligibleCintProjects(),
                // new ProjectService().checkTolunaRegistration()
            ]);
      
      
            // const tolunaRegSurveys = tolunaRegResponse.data.status ? tolunaRegResponse.data.surveys.map((project: any, index: number) => ({
            //     id: project.SurveyID,
            //     projectCode: project.SurveyID,
            //     countryCode: '',
            //     deviceRestrictions: [],
            //     amount: project.MemberAmount,
            //     duration: project.Duration,
            //     expires: t('surveyList.expires_in'),
            //     type: 'main' as const,
            //     projectType: "tolune_reg",
            //     url: decodeURIComponent(project.URL)
            // })) 
            // : [];
      
            const mainSurveys = internalResponse.data.map((project: any, index: number) => ({
                id: index + 1,
                projectCode: project.projectCode,
                countryCode: project.countryCode,
                deviceRestrictions: project.deviceRestrictions,
                amount: project.amount,
                duration: project.duration,
                // expires: t('surveyList.expires_in'),
                type: 'main' as const,
                projectType:"main_projects"
            }));
      
            // const featuredSurveys = featuredResponse?.data?.data?.map((project: any, index: number) => ({
            //     id: mainSurveys.length + index + 1,
            //     projectCode: project.projectCode,
            //     projectId: project.projectId,
            //     countryCode: project.countryCode,
            //     deviceRestrictions: project.deviceRestrictions,
            //     amount: project.amount,
            //     duration: project.duration,
            //     expires: t('surveyList.expires_in'),
            //     type: 'featured' as const,
            //     surveyHostingType: project?.surveyHostingType,
            //     projectType:"diy_projects"
            // }));
      
            // const cintSurveys = cintResponse?.data?.data?.map((project: any, index: number) => ({
            //     id: mainSurveys.length + index + 1,
            //     projectCode: project.projectCode,
            //     projectId: project.projectId,
            //     countryCode: project.countryCode,
            //     deviceRestrictions: project.deviceRestrictions,
            //     amount: project.amount,
            //     duration: project.duration,
            //     expires: t('surveyList.expires_in'),
            //     type: 'featured' as const,
            //     surveyHostingType: project?.surveyHostingType,
            //     page:"",
            //     projectType:"cint_projects"
            // }));
      
            fetchedSurveys = [
                ...mainSurveys, 
                // ...(tolunaRegSurveys || []), 
                // ...(featuredSurveys || []), 
                // ...(cintSurveys || [])
            ];
        } catch (error: any) {
            setAlert({ message: error.message, type: 'error' });
        }
      
        setSurveys(fetchedSurveys);
        setLoading(false);
      }, []);

    useEffect(() => {
        fetchSurveys();
    }, [fetchSurveys]);

    console.log("surveys from api: ", surveys)

    return (
        <View style={tw`flex flex-col overflow-hidden`}>
            {/* Table Header */}
            <View style={tw`flex flex-row items-center p-3 rounded-xl w-full `}>
                <Text style={tw`flex-1 text-left font-bold text-gray-950`}>Amount</Text>
                <Text style={tw`flex-1 text-center font-bold text-gray-950`}>Duration</Text>
                <Text style={tw`flex-1 text-right font-bold text-gray-950`}>Start</Text>
            </View>

            {/* Survey Rows */}
            {[
                {
                    id: 1,
                    title: "Consumer Habits Survey",
                    amount: 2.50,
                    duration: "10 min",
                    startDate: "Now"
                },
                {
                    id: 2,
                    title: "Technology Usage Study",
                    amount: 3.75,
                    duration: "15 min",
                    startDate: "In 2h"
                },
                {
                    id: 3,
                    title: "Shopping Experience",
                    amount: 1.50,
                    duration: "5 min",
                    startDate: "Today"
                }
            ].map((survey, index) => (
                <TouchableOpacity
                    key={survey.id}
                    style={tw`flex flex-row items-center p-3 rounded-xl w-full  ${index % 2 === 0 ? 'bg-zinc-200/50' : ''
                        }`}
                >
                    <Text style={tw`flex-1 text-left text-gray-950 font-bold`}>
                        ${survey.amount.toFixed(2)}
                    </Text>
                    <Text style={tw`flex-1 text-center text-gray-600`}>
                        {survey.duration}
                    </Text>
                    <Text style={tw`flex-1 text-right text-gray-600`}>
                        <Ionicons name="chevron-forward" size={24} color="#32B3C2" />
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default SurveysList

const styles = StyleSheet.create({})