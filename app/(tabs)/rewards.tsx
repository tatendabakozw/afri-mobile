import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import GeneralLayout from '@/layouts/GeneralLayout'
import PrimaryAlert from '@/components/alerts/primary-alert'
import RewardService from '@/api/services/rewards/RewardsService'

interface Survey {
  id: number
  title: string
  date: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  amount: number
  type: string
}

const Rewards = () => {
  const [rewards, setRewards] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const rewardsPerPage = 6

  const rewardsService = new RewardService()

  const fetchRewards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await rewardsService.getUserRewards(currentPage, rewardsPerPage)
      if (response.success) {
        setRewards(response.data.rewards)
        setTotalPages(Math.ceil(response.data.totalRewards / rewardsPerPage))
      } else {
        setError(response.message || 'Failed to fetch rewards')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching rewards')
    } finally {
      setLoading(false)
    }
  }, [currentPage, rewardsPerPage])

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600'
      case 'REJECTED': return 'text-red-600'
      default: return 'text-orange-600'
    }
  }

  const getStatusIcon = (status: Survey['status']) => {
    switch (status) {
      case 'APPROVED': return 'checkmark-circle'
      case 'REJECTED': return 'close-circle'
      default: return 'time'
    }
  }

  const getStatusIconColor = (status: Survey['status']) => {
    switch (status) {
      case 'APPROVED': return '#16A34A'
      case 'REJECTED': return '#DC2626'
      default: return '#F97316'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const totalEarnings = rewards
    .filter(s => s.status === 'APPROVED')
    .reduce((sum, survey) => sum + survey.amount, 0)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  console.log("rewards fronm api: ", rewards)

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

        {/* Error Message */}
        {error && (
          <View style={tw`mb-6`}>
            <PrimaryAlert type="error" message={error} />
            <TouchableOpacity
              style={tw`bg-[#32B3C2] py-2 px-4 rounded-lg mt-2 self-start`}
              onPress={fetchRewards}
            >
              <Text style={tw`text-white font-medium`}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={tw`py-12 items-center justify-center`}>
            <ActivityIndicator size="large" color="#32B3C2" />
          </View>
        ) : rewards.length > 0 ? (
          <>
            {rewards.map(reward => (
              <View
                key={reward.date}
                style={tw`bg-white rounded-xl p-4 mb-3 border border-gray-100`}
              >
                <View style={tw`flex-row justify-between items-start mb-2`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-medium text-gray-800 mb-1`}>
                      {reward.title || reward.type}
                    </Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Completed on {formatDate(reward.date)}
                    </Text>
                  </View>
                  <Text style={tw`font-bold text-[#32B3C2]`}>
                    ${reward.amount.toFixed(2)}
                  </Text>
                </View>

                <View style={tw`flex-row items-center`}>
                  <View style={tw`flex-row items-center`}>
                    <Ionicons
                      name={getStatusIcon(reward.status)}
                      size={16}
                      color={getStatusIconColor(reward.status)}
                    />
                    <Text style={tw`ml-1 capitalize ${getStatusColor(reward.status)}`}>
                      {reward.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={tw`flex-row justify-center mt-4 mb-6`}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <TouchableOpacity
                    key={`page-${page}`}  // Fixed unique key
                    style={tw`mx-1 px-3 py-2 rounded-lg ${currentPage === page ? 'bg-[#32B3C2]' : 'bg-gray-200'}`}
                    onPress={() => handlePageChange(page)}
                  >
                    <Text style={tw`${currentPage === page ? 'text-white' : 'text-gray-700'}`}>
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={tw`bg-white rounded-xl p-8 items-center justify-center`}>
            <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
            <Text style={tw`text-lg font-medium text-gray-800 mt-4 text-center`}>
              No rewards yet
            </Text>
            <Text style={tw`text-gray-500 mt-2 text-center`}>
              Complete surveys to start earning rewards
            </Text>
          </View>
        )}

        {/* Notes Section */}
        <View style={tw`mt-6 bg-gray-50 p-4 rounded-xl`}>
          <Text style={tw`font-bold text-gray-800 mb-3`}>Notes</Text>
          <View style={tw`mb-2`}>
            <Text style={tw`font-medium text-gray-800`}>Approved:</Text>
            <Text style={tw`text-gray-600`}>
              Rewards that have been verified and added to your balance
            </Text>
          </View>
          <View style={tw`mb-2`}>
            <Text style={tw`font-medium text-gray-800`}>Pending:</Text>
            <Text style={tw`text-gray-600`}>
              Rewards that are being processed and verified
            </Text>
          </View>
          <View>
            <Text style={tw`font-medium text-gray-800`}>Rejected:</Text>
            <Text style={tw`text-gray-600`}>
              Rewards that were not approved due to quality issues
            </Text>
          </View>
        </View>
      </ScrollView>
    </GeneralLayout>
  )
}

export default Rewards