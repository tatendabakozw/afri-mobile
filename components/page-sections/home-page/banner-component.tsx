import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AbstractBG from '@/components/svgs/AbstractBG'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import ProfileService from '@/api/services/profile/ProfileService'
import { useNavigation } from '@react-navigation/native'

type Props = {
    profile?: any
    onError?: (error: string) => void
}

const BannerComponent = ({ profile, onError }: Props) => {
    const navigation = useNavigation()
    const [rewardBalance, setRewardBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>({})

    useEffect(() => {
        const fetchRewardBalance = async () => {
            try {
                const profileService = new ProfileService()
                const response = await profileService.getUserRewardBalance()
                const nameresponse = await profileService.getUserProfile();
                if(nameresponse.success){
                    setUser(nameresponse.data)
                }
                if (response.success) {
                    setRewardBalance(response.data.rewardBalance)
                }
            } catch (error: any) {
                onError?.(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRewardBalance()
    }, [])

    const capitalizeAndTrim = (text: string) => {
        if (!text || text.trim().length === 0 || ['n/a', 'N/A', 'null'].includes(text.toLowerCase())) {
            return 'Panelist'
        }
        const words = text.split(' ')
        const firstWord = words[0]
        return firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    }

    return (
        <View style={tw`w-full bg-[#32B3C2] rounded-3xl relative overflow-hidden mb-4 shadow-lg`}>
            <View style={[StyleSheet.absoluteFill, tw`opacity-50`]}>
                <AbstractBG style={[StyleSheet.absoluteFill]} />
            </View>
            
            <View style={tw`flex flex-col gap-4 p-6`}>
                {/* Header Section */}
                <View style={tw`flex flex-row items-center justify-between w-full`}>
                    <View>
                        <Text style={tw`text-white/70 text-sm`}>Hello</Text>
                        <Text style={tw`text-white font-bold text-xl`}>
                            {capitalizeAndTrim(user?.personDetails?.firstName || 'Guest')}
                        </Text>
                    </View>
                    <View>
                        <Text style={tw`text-white/70 text-sm`}>Balance</Text>
                        <Text style={tw`text-white font-bold text-xl`}>
                            ${loading ? '...' : rewardBalance.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Info Section */}
                <View style={tw`bg-white/10 rounded-2xl p-4`}>
                    <Text style={tw`text-white/90 text-sm mb-2`}>
                        Minimum withdrawal: <Text style={tw`font-bold`}>$5.00</Text>
                    </Text>
                    <Text style={tw`text-white/80 text-sm leading-5`}>
                        Explore our selection of available surveys and start earning rewards today!
                    </Text>
                </View>

                {/* Actions Section */}
                <View style={tw`flex flex-row items-center gap-3 w-full`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-white rounded-xl p-3 shadow-sm`}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Rewards' as never)}
                    >
                        <View style={tw`flex-row items-center justify-center gap-2`}>
                            <Ionicons name="gift-outline" size={20} color="#32B3C2" />
                            <Text style={tw`text-[#32B3C2] font-semibold`}>Rewards</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={tw`flex-1 bg-white/10 rounded-xl p-3 border border-white/20`}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Payouts' as never)}
                    >
                        <View style={tw`flex-row items-center justify-center gap-2`}>
                            <Ionicons name="cash-outline" size={20} color="white" />
                            <Text style={tw`text-white font-semibold`}>Payouts</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default BannerComponent