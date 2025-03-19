import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EnrollmentLayout from '@/layouts/EnrollmentLayout';
import PrimaryAlert from '@/components/alerts/primary-alert';
import { decryptData, encryptData } from '@/helpers/encryption';

// You'll need to import these images
const screenOutImage = require('@/assets/images/screenout.png');
const completeImage = require('@/assets/images/complete.png');

const Results = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const requestInProgress = React.useRef(false);


  const sendStatusToBackend = useCallback(async (projectCode: string, status: string) => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;

    try {
      const encryptedData = await encryptData({ projectCode, status })
      const dataHash = encryptedData
      const storedHash = await AsyncStorage.getItem(dataHash);
      
      if (storedHash) {
        requestInProgress.current = false;
        return;
      }

      // Replace with your API call
      await AsyncStorage.setItem(dataHash, 'true');
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Failed to update survey status' });
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    const processSurveyResult = async () => {
      setLoading(true);
      const data = params.data as string;

      if (data) {
        try {
          const decryptedData = await decryptData(data as string);
          let { projectCode, status } = decryptedData as any;

          console.log("descrypted data: ", decryptedData)

          if (status === 'GEO_LOCKED') {
            setStatus('TARGET_UNSUITABLE');
          } else {
            setStatus(status.toUpperCase());
          }

          await sendStatusToBackend(projectCode, status.toUpperCase());
        } catch (error: any) {
          setAlert({ type: 'error', message: error.message || 'Invalid or expired survey link' });
          setLoading(false);
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 5000);
        }
      } else {
        setAlert({ type: 'warning', message: 'Survey status or project code is missing' });
        setLoading(false);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 5000);
      }
    };

    processSurveyResult();
  }, [params.data, decryptData, sendStatusToBackend]);

  const getTitle = () => {
    switch (status) {
      case 'COMPLETED':
        return "Survey Completed Successfully";
      case 'SCREEN_OUT':
      case 'DISQUALIFIED':
        return "Survey Screening Complete";
      case 'QUOTA_FULL':
        return "Survey Quota Reached";
      case 'TARGET_UNSUITABLE':
        return 'Target Unsuitable';
      case 'CLOSED':
        return "Survey Closed";
      case 'BOT_DETECTED':
        return "Access Denied";
      case 'MAX_SURVEY_REACHED':
        return "Daily Survey Limit Reached";
      case 'SURVEY_TAKEN':
        return "Survey Already Taken";
      case 'NO_SURVEYS':
        return "No Surveys Available";
      case 'NO_COOKIES':
        return "Cookies Required";
      case 'SURVEY_NOT_AVAILABLE':
        return "Survey No Longer Available";
      default:
        return "Survey Status";
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'COMPLETED':
        return (
          <View style={tw`space-y-2`}>
            <Text style={tw`text-center text-lg font-medium text-gray-800`}>Thank you for completing the survey!</Text>
            <Text style={tw`text-center text-base text-gray-600`}>Your responses have been successfully recorded.</Text>
            <Text style={tw`text-center text-base text-gray-600`}>Your reward will be credited to your account shortly.</Text>
          </View>
        );
      case 'TARGET_UNSUITABLE':
        return (
          <View style={tw`space-y-2`}>
            <Text style={tw`text-center text-base text-gray-600`}>Unfortunately, you did not qualify for this survey.</Text>
            <Text style={tw`text-center text-base text-gray-600`}>Please try another survey from your dashboard.</Text>
          </View>
        );
      case 'SCREEN_OUT':
      case 'DISQUALIFIED':
        return (
          <View style={tw`space-y-2`}>
            <Text style={tw`text-center text-base text-gray-600`}>Unfortunately, you did not qualify for this survey.</Text>
            <Text style={tw`text-center text-base text-gray-600`}>Please try another survey from your dashboard.</Text>
          </View>
        );
      case 'MAX_SURVEY_REACHED':
        return (
          <Text style={tw`text-center`}>
            You have reached the maximum number of surveys allowed for today (25 starts or 5 completes). Please try again tomorrow.
          </Text>
        );
      case 'SURVEY_TAKEN':
        return (
          <Text style={tw`text-center`}>
            Our records show that you have already taken this survey. Please choose a different survey from your dashboard.
          </Text>
        );
      case 'NO_SURVEYS':
        return (
          <Text style={tw`text-center`}>
            There are currently no surveys available that match your profile. Please check back later for new opportunities.
          </Text>
        );
      case 'NO_COOKIES':
        return (
          <Text style={tw`text-center`}>
            Please enable cookies in your browser to participate in surveys. Cookies are required for proper survey functionality.
          </Text>
        );
      case 'SURVEY_NOT_AVAILABLE':
        return (
          <Text style={tw`text-center`}>
            This survey is no longer active. Please return to your dashboard to find available surveys.
          </Text>
        );
      default:
        return (
          <Text style={tw`text-center`}>
            An unexpected status was received. Please return to your dashboard and try again.
          </Text>
        );
    }
  };

  

  return (
    <EnrollmentLayout loading={loading}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-6 py-12 items-center justify-center min-h-full`}>
          <Image
            source={status === 'COMPLETED' ? completeImage : screenOutImage}
            style={tw`w-32 h-32 mb-8`}
            resizeMode="contain"
          />
          
          <Text style={tw`text-2xl font-semibold mb-6 text-center text-gray-900`}>
            {getTitle()}
          </Text>
          
          <View style={tw`mb-8 w-full max-w-sm`}>
            {getMessage()}
          </View>

          <Text 
            style={tw`text-blue-600 text-base font-medium`}
            onPress={() => router.replace('/(tabs)')}
          >
            Return to Dashboard
          </Text>
        </View>
      </ScrollView>
      
      {alert && (
        <PrimaryAlert 
          type={alert.type}
          message={alert.message}
        />
      )}
    </EnrollmentLayout>
  );
};

export default Results;