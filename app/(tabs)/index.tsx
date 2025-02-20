import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import tw from 'twrnc'
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GeneralLayout from '@/layouts/GeneralLayout';
import AbstractBG from '@/components/svgs/AbstractBG';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerComponent from '@/components/page-sections/home-page/banner-component';

export default function TabOneScreen() {
  const router = useRouter()
  const tips = [
    {
      id: 1,
      heading: "Complete Your Profile",
      tip: "Fill in your profile details to get more targeted surveys and increase your earnings."
    },
    {
      id: 2,
      heading: "Stay Active",
      tip: "Check back daily for new surveys. The more active you are, the more opportunities you'll have."
    },
    {
      id: 3,
      heading: "Be Honest",
      tip: "Always provide honest answers to maintain a high quality score and get more surveys."
    }
  ];

  const [currentTip, setCurrentTip] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
          {/* <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
          <BannerComponent />
          {/*TODO: Auto cycling Tips */}
          <View style={tw`bg-zinc-200/50 rounded-xl border border-zinc-200/50 p-4 mt-4`}>
            <View style={tw`flex flex-row items-center justify-between mb-2`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Ionicons name="bulb-outline" size={24} color="#32B3C2" />
                <Text style={tw`text-gray-500 text-sm`}>
                  Tip {currentTip + 1} of {tips.length}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCurrentTip((prev) => (prev + 1) % tips.length)}
                style={tw`flex-row items-center gap-1`}
              >
                <Text style={tw`text-[#32B3C2] text-sm`}>Next tip</Text>
                <Ionicons name="chevron-forward" size={16} color="#32B3C2" />
              </TouchableOpacity>
            </View>

            <Text style={tw`text-gray-800 font-bold text-lg mb-1`}>
              {tips[currentTip].heading}
            </Text>
            <Text style={tw`text-gray-600`}>
              {tips[currentTip].tip}
            </Text>
          </View>
          {/* TODO:warn user Complete profiile to get more rewards and its description  */}
          <View style={tw`bg-orange-50 rounded-xl border border-orange-100 p-4 mt-4`}>
            <View style={tw`flex-row items-start gap-3`}>
              <View style={tw`bg-orange-100 rounded-full p-2`}>
                <Ionicons name="warning-outline" size={24} color="#F97316" />
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-800 font-bold text-lg mb-1`}>
                  Complete Your Profile
                </Text>
                <Text style={tw`text-gray-600 mb-3`}>
                  Fill in your profile details to unlock more survey opportunities and increase your earning potential.
                </Text>

                <TouchableOpacity
                  style={tw`bg-[#32B3C2] py-2 px-4 rounded-lg self-start flex-row items-center gap-2`}
                  onPress={() => router.push('/(tabs)/profiling')}
                >
                  <Text style={tw`text-white font-medium`}>Complete Profile</Text>
                  <Ionicons name="chevron-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
