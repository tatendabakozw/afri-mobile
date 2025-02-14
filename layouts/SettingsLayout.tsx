import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import tw from 'twrnc'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SettingsLayoutProps {
    children: React.ReactNode
    title: string
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, title }) => {
    const insets = useSafeAreaInsets()
    return (
        <View style={[tw`flex-1 bg-[#f5fbfc]`]}>
            {/* Header */}
            <View style={[tw`flex-row items-center p-4 bg-white border-b border-gray-100`, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`mr-3 p-2`}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={tw`text-xl font-bold text-gray-800`}>{title}</Text>
            </View>

            {/* Content */}
            {children}
        </View>
    )
}

export default SettingsLayout