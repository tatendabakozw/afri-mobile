import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import ProfileService from '@/api/services/profile/ProfileService'

interface Props {
    minimumPayout: number
}

const BalanceCard = ({ minimumPayout }: Props) => {
    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(false)

    const fetchUserBalance = async () => {
        setLoading(true)
        try {
            const profileService = new ProfileService()
            const response = await profileService.getUserRewardBalance()
            if (response.success) {
                setBalance(response.data.rewardBalance)
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching balance:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserBalance()
    }, [])

    return (
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
            <Text style={tw`text-gray-500 mb-2`}>Available Balance</Text>
            <Text style={tw`text-3xl font-bold text-gray-800`}>
                ${balance.toFixed(2)}
            </Text>
            <View style={tw`flex-row items-center mt-4 bg-orange-50 p-3 rounded-lg`}>
                <Ionicons name="warning-outline" size={20} color="#F97316" />
                <Text style={tw`ml-2 text-orange-700`}>
                    Minimum withdrawal amount is ${minimumPayout}
                </Text>
            </View>
        </View>
    )
}

export default BalanceCard

const styles = StyleSheet.create({})