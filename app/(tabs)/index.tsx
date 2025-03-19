import { ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import tw from 'twrnc'
import { useEffect } from 'react';
import GeneralLayout from '@/layouts/GeneralLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerComponent from '@/components/page-sections/home-page/banner-component';
import CompleteProfileWarning from '@/components/page-sections/home-page/complete-profile-warning';
import TipsComponent from '@/components/page-sections/home-page/tips-component';
import SurveysList from '@/components/page-sections/home-page/surveys-list';
import { router, useLocalSearchParams } from 'expo-router';


export default function TabOneScreen() {

  useEffect(() => {
    const logToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token:', token);
    };
    logToken();
  }, []);

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`}>
        {/* <TouchableOpacity onPress={() => router.push('/(results)')}>
<Text>asdflkjlksdf</Text>
        </TouchableOpacity> */}
        <View style={[tw`p-4 pb-32`, styles.container]}>
          <BannerComponent />
          <TipsComponent />
          <CompleteProfileWarning />
          <View style={tw`mt-6`}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-gray-800 font-bold text-lg text-center w-full`}>Available Surveys</Text>
            </View>
            <SurveysList />
          </View>
        </View>
      </ScrollView>
    </GeneralLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
