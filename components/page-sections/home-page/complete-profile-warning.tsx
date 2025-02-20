import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';

import React from 'react'
import { useRouter } from 'expo-router';

const CompleteProfileWarning = () => {
      const router = useRouter()
    
  return (
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
  )
}

export default CompleteProfileWarning

const styles = StyleSheet.create({})