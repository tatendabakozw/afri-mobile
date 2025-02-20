import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';


const SurveysList = () => {
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