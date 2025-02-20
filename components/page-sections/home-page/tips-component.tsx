import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

const TipsComponent = () => {
    const [currentTip, setCurrentTip] = useState(0);

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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
    return (
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
    )
}

export default TipsComponent

const styles = StyleSheet.create({})