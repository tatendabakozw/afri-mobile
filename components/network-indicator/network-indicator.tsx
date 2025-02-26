import { Animated, StyleSheet, Text, View, AppState } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import tw from 'twrnc'

const NetworkIndicator = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [isConnected, setIsConnected] = useState(true);
    const appState = useRef(AppState.currentState);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const checkConnection = async () => {
        try {
            // Try multiple endpoints in case one is blocked
            const endpoints = [
                'https://www.google.com',
                'https://www.cloudflare.com',
                'https://www.apple.com',
                'https://www.microsoft.com'
            ];
            
            // Try each endpoint until one succeeds
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint, { 
                        method: 'HEAD',
                        cache: 'no-cache',
                        headers: { 'Cache-Control': 'no-cache' },
                        signal: AbortSignal.timeout(2000) // Shorter timeout per endpoint
                    });
                    
                    if (response.ok) {
                        setIsConnected(true);
                        return; // Exit early if we get a successful response
                    }
                } catch (endpointError) {
                    // Continue to the next endpoint if this one fails
                    continue;
                }
            }
            
            // If we get here, all endpoints failed
            setIsConnected(false);
        } catch (error) {
            setIsConnected(false);
        }
    };

    useEffect(() => {
        // Start pulse animation
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

        // Check connection initially
        checkConnection();

        // Set up interval to check connection periodically
        intervalRef.current = setInterval(checkConnection, 15000); // Check every 15 seconds

        // Set up app state change listener
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) && 
                nextAppState === 'active'
            ) {
                // App has come to the foreground, check connection
                checkConnection();
            }
            appState.current = nextAppState;
        });

        // Clean up
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            subscription.remove();
        };
    }, []);

    return (
        <View style={tw`flex-row items-center`}>
            <View style={tw`flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full`}>
                <Animated.View style={[
                    tw`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} mr-2`,
                    {
                        opacity: pulseAnim,
                        shadowColor: isConnected ? '#22C55E' : '#EF4444',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                    }
                ]} />
                <Text style={tw`text-xs font-medium text-gray-600`}>
                    {isConnected ? 'Online' : 'Offline'}
                </Text>
            </View>
        </View>
    )
}

export default NetworkIndicator

const styles = StyleSheet.create({})