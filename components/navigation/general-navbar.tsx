import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { StatusBar } from "expo-status-bar";
import tw from 'twrnc'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import NetworkIndicator from '../network-indicator/network-indicator';

const GeneralNavbar = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()



  return (
    <View style={[tw`bg-white px-4`, {
      paddingTop: insets.top
    }]}>
      <View style={tw`flex-row items-center justify-between py-4`}>
        {/* Set StatusBar style to dark */}
        <StatusBar style="dark" />
        {/* Left section - can be used for branding/title */}
        <View style={tw``}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={tw`h-8 w-8`}
            resizeMode="contain"
          />
        </View>

        {/* Middle Section with Online Status */}
        <NetworkIndicator />

        {/* Profile Icon */}
        <TouchableOpacity onPress={() => router.push('/(settings)/profile')} style={tw`p-2`}>
          <Ionicons name="person-circle-outline" size={24} color="#32B3C2" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GeneralNavbar

const styles = StyleSheet.create({})