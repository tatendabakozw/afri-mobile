import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function ResultsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: Colors.light.background
                },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
           
        </Stack>
    );
}