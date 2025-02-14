// app/(settings)/_layout.tsx

import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function SettingsLayout() {
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
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
          title: 'Settings'
        }}
      />
      <Stack.Screen 
        name="profile"
        options={{
          headerShown: false,
          title: 'My Profile'
        }}
      />
      <Stack.Screen 
        name="security"
        options={{
          headerShown: false,
          title: 'Security'
        }}
      />
      <Stack.Screen 
        name="notifications"
        options={{
          headerShown: false,
          title: 'Notifications'
        }}
      />
      <Stack.Screen 
        name="profiling"
        options={{
          headerShown: false,
          title: 'Profiling Settings'
        }}
      />
    </Stack>
  );
}