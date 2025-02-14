import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import tw from 'twrnc'

const NetworkIndicator = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);
    return (
        <View style={tw`flex-row items-center`}>
            <View style={tw`flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full`}>
                <Animated.View style={[
                    tw`w-1.5 h-1.5 rounded-full bg-green-400 mr-2`,
                    {
                        opacity: pulseAnim,
                        shadowColor: '#22C55E',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                    }
                ]} />
                <Text style={tw`text-xs font-medium text-gray-600`}>Online</Text>
            </View>
        </View>
    )
}

export default NetworkIndicator

const styles = StyleSheet.create({})