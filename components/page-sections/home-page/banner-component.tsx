import React from 'react'
import AbstractBG from '@/components/svgs/AbstractBG'
import tw from 'twrnc'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    username?: string
    balance?: number
}

const BannerComponent = ({ username = 'User', balance = 0.00 }: Props) => {
    return (
        <View style={tw`w-full bg-[#32B3C2] rounded-3xl relative overflow-hidden my-4 shadow-lg`}>
            <View style={[
                StyleSheet.absoluteFill,
                tw`w-full h-full opacity-50`
            ]}>
                <AbstractBG
                    style={[
                        StyleSheet.absoluteFill,
                    ]}
                />
            </View>
            <View style={tw`flex flex-col gap-6 p-6`}>
                {/* Header Section */}
                <View style={tw`flex flex-row items-center justify-between w-full`}>
                    <View>
                        <Text style={tw`text-white/70 text-sm mb-1`}>Welcome back</Text>
                        <Text style={tw`text-white font-bold text-xl`}>{username}</Text>
                    </View>
                    <View>
                        <Text style={tw`text-white/70 text-sm mb-1`}>Balance</Text>
                        <Text style={tw`text-white font-bold text-xl`}>
                            ${balance.toFixed(2)}
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
                        style={tw`flex-1 bg-white rounded-xl px-4 py-3 shadow-sm`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-[#32B3C2] font-semibold text-center`}>
                            Rewards
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`flex-1 bg-white/10 rounded-xl px-4 py-3 border border-white/20`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-white font-semibold text-center`}>
                            Payouts
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default BannerComponent

const styles = StyleSheet.create({})