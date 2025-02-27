import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function RedirectsLayout() {
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
            <Stack.Screen
                name="cint-enrollment"
                options={{
                    headerShown: false,
                    title: 'Cint Enrollment'
                }}
            />
            <Stack.Screen
                name="enrollment"
                options={{
                    headerShown: false,
                    title: 'Enrollment'
                }}
            />

        </Stack>
    );
}