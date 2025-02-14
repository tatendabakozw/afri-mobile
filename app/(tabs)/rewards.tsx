import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import GeneralLayout from '@/layouts/GeneralLayout'

interface Survey {
  id: number
  title: string
  completedDate: string
  status: 'pending' | 'approved' | 'rejected'
  amount: number
}

const Rewards = () => {
  const surveys: Survey[] = [
    {
      id: 1,
      title: "Consumer Habits Survey",
      completedDate: "2024-03-15",
      status: "approved",
      amount: 2.50
    },
    {
      id: 2,
      title: "Technology Usage Study",
      completedDate: "2024-03-14",
      status: "pending",
      amount: 3.75
    }
  ]

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600'
      case 'rejected': return 'text-red-600'
      default: return 'text-orange-600'
    }
  }

  const totalEarnings = surveys
    .filter(s => s.status === 'approved')
    .reduce((sum, survey) => sum + survey.amount, 0)

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-32`}>
        {/* Header */}
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
          Rewards History
        </Text>
        <Text style={tw`text-gray-600 mb-6`}>
          Track your completed surveys and earned rewards
        </Text>

        {/* Earnings Summary */}
        <View style={tw`bg-white rounded-xl p-6 mb-6`}>
          <Text style={tw`text-gray-500 mb-2`}>Total Earnings</Text>
          <Text style={tw`text-3xl font-bold text-gray-800`}>
            ${totalEarnings.toFixed(2)}
          </Text>
        </View>

        {/* Surveys List */}
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
          Completed Surveys
        </Text>

        {surveys.map(survey => (
          <View 
            key={survey.id}
            style={tw`bg-white rounded-xl p-4 mb-3 border border-gray-100`}
          >
            <View style={tw`flex-row justify-between items-start mb-2`}>
              <View style={tw`flex-1`}>
                
                <Text style={tw`text-sm text-gray-500`}>
                  Completed on {new Date(survey.completedDate).toLocaleDateString()}
                </Text>
              </View>
              <Text style={tw`font-bold text-[#32B3C2]`}>
                ${survey.amount.toFixed(2)}
              </Text>
            </View>

            <View style={tw`flex-row items-center`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons 
                  name={survey.status === 'approved' ? 'checkmark-circle' : 
                        survey.status === 'rejected' ? 'close-circle' : 'time'}
                  size={16}
                  color={survey.status === 'approved' ? '#16A34A' :
                         survey.status === 'rejected' ? '#DC2626' : '#F97316'}
                />
                <Text style={tw`ml-1 capitalize ${getStatusColor(survey.status)}`}>
                  {survey.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </GeneralLayout>
  )
}

export default Rewards