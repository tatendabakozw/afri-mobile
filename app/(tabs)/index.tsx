import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import tw from 'twrnc'
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import GeneralLayout from '@/layouts/GeneralLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerComponent from '@/components/page-sections/home-page/banner-component';
import CompleteProfileWarning from '@/components/page-sections/home-page/complete-profile-warning';
import TipsComponent from '@/components/page-sections/home-page/tips-component';

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
        <View style={[tw`p-4 pb-32`, styles.container]}>
          <BannerComponent />
          <TipsComponent />
          <CompleteProfileWarning />
          {/* TODO: a list of available surveys --- with amount duration ans start date */}
          <View style={tw`mt-6`}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-gray-800 font-bold text-lg text-center w-full`}>Available Surveys</Text>
            </View>

            {/* Survey Cards */}
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
