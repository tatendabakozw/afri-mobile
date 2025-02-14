import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import { router } from 'expo-router'
import { handleLogout } from '@/utils/logout'
import GeneralLayout from '@/layouts/GeneralLayout'
import ConfirmationAlert from '@/components/alerts/confirmation-alert'

const Settings = () => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'My Profile',
          icon: 'person-outline',
          route: '/(settings)/profile'
        },
        {
          id: 'security',
          title: 'Security',
          icon: 'shield-outline',
          route: '/(settings)/security'
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'notifications-outline',
          route: '/(settings)/notifications'
        },
        {
          id: 'profiling',
          title: 'Profiling Settings',
          icon: 'options-outline',
          route: '/(settings)/profiling'
        }
      ]
    }
  ]

  const confirmLogout = () => {
    setShowLogoutAlert(true);
  };

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-32`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-6`}>Settings</Text>

        {settingsGroups.map((group, index) => (
          <View key={index} style={tw`mb-6`}>
            <Text style={tw`text-gray-500 text-sm mb-2 uppercase`}>
              {group.title}
            </Text>
            <View style={tw`bg-white rounded-xl overflow-hidden border border-gray-100`}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={tw`flex-row items-center p-4 ${itemIndex < group.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={tw`w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3`}>
                    <Ionicons name={item.icon as any} size={20} color="#32B3C2" />
                  </View>
                  <Text style={tw`flex-1 text-gray-800 font-medium`}>
                    {item.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={confirmLogout}
          style={tw`mt-6 flex-row items-center p-4 bg-white rounded-xl border border-gray-100`}
        >
          <View style={tw`w-8 h-8 bg-red-50 rounded-full items-center justify-center mr-3`}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </View>
          <Text style={tw`flex-1 text-red-500 font-medium`}>
            Logout
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <ConfirmationAlert
          visible={showLogoutAlert}
          title="Logout"
          message="Are you sure you want to logout?"
          buttons={[
            {
              text: "Cancel",
              onPress: () => setShowLogoutAlert(false),
              style: "cancel"
            },
            {
              text: "Logout",
              onPress: () => {
                setShowLogoutAlert(false);
                handleLogout();
              },
              style: "destructive"
            }
          ]}
          onClose={() => setShowLogoutAlert(false)}
        />
      </ScrollView>
    </GeneralLayout>
  )
}

export default Settings