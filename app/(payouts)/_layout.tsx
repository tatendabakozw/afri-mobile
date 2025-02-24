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
        <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="bank-transfer"
        options={{
          headerShown: false,
          title: 'Bank Transfer'
        }}
      />
      <Stack.Screen 
        name="mobile-money"
        options={{
          headerShown: false,
          title: 'Mobile Money'
        }}
      />
      <Stack.Screen 
        name="mobile-topup"
        options={{
          headerShown: false,
          title: 'Mobile Top-up'
        }}
      />
      <Stack.Screen 
        name="mobile-topup-v2"
        options={{
          headerShown: false,
          title: 'Mobile Top Up v2'
        }}
      />
     
    </Stack>
  );
}