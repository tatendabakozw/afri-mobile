import React from "react";
import { Stack } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={({ navigation, route }) => ({
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: useClientOnlyValue(false, true),
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShown:false
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          title: "Verify Indentity",
          headerShown:false
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerShown:false
        }}
      />
    </Stack>
  );
}