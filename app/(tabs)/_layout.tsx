import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeIcon from '@/components/svgs/icons/HomeIcon';
import UserIcon from '@/components/svgs/icons/UserIcon';
import WalletIcon from '@/components/svgs/icons/WalletIcon';
import RewardsIcon from '@/components/svgs/icons/RewardsIcon';
import SettingsIcon from '@/components/svgs/icons/SettingsIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          marginHorizontal: 8,
          backgroundColor: '#32B3C2',
          borderRadius: 15,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          borderColor: '#F3F4F6'
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon fill={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiling"
        options={{
          title: "Profiling",
          tabBarIcon: ({ color, size }) => (
            <UserIcon fill={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="payouts"
        options={{
          title: "Payouts",
          tabBarIcon: ({ color, size }) => (
            <WalletIcon fill={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color, size }) => (
            <RewardsIcon fill={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon fill={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}