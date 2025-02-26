import { Text, View, ScrollView, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import SettingsLayout from '@/layouts/SettingsLayout'
import tw from 'twrnc'
import PrimaryAlert from '@/components/alerts/primary-alert'
import BalanceCard from '@/components/page-sections/payouts/balance-card'
import CountryDropdown from '@/components/dropdowns/country-dropdown'
import { countryOptions } from '@/utils/countryOptions'
import { mobileMoneyOptions } from '@/utils/mobileMoneyOptions'
import PayoutService from '@/api/services/payouts/PayoutService'
import ProfileService from '@/api/services/profile/ProfileService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

interface MobileMoneyState {
  loading: boolean
  error: string | null
  selectedCountry: string
  phoneCode: number
  phoneNumber: string
  amount: string
  provider: string
  remainingCooldown: number
}

const COOLDOWN_DURATION = 10 * 60 * 1000 // 10 minutes
const MIN_AMOUNT = 3.00
const MAX_AMOUNT = 10.00

const MobileMoney = () => {
  const [state, setState] = useState<MobileMoneyState>({
    loading: false,
    error: null,
    selectedCountry: countryOptions[0].value,
    phoneCode: countryOptions[0].phoneCode,
    phoneNumber: '',
    amount: '',
    provider: '',
    remainingCooldown: 0
  })

  useEffect(() => {
    checkCooldown()
    loadUserPhoneNumber()
  }, [])

  useEffect(() => {
    if (state.remainingCooldown > 0) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          remainingCooldown: Math.max(0, prev.remainingCooldown - 1000)
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [state.remainingCooldown])

  const checkCooldown = async () => {
    try {
      const lastTransactionTime = await AsyncStorage.getItem('lastMobileMoneyTime')
      if (lastTransactionTime) {
        const elapsedTime = Date.now() - parseInt(lastTransactionTime)
        const remainingTime = Math.max(0, COOLDOWN_DURATION - elapsedTime)
        setState(prev => ({ ...prev, remainingCooldown: remainingTime }))
      }
    } catch (error) {
      console.error('Error checking cooldown:', error)
    }
  }

  const loadUserPhoneNumber = async () => {
    try {
      const profileService = new ProfileService()
      const response = await profileService.getUserProfile()
      if (response.data && response.data.personDetails && response.data.personDetails.phoneNumber) {
        setState(prev => ({ 
          ...prev, 
          phoneNumber: response.data.personDetails.phoneNumber.replace(/\D/g, '')
        }))
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleMobileMoneyPayout = async () => {
    if (state.remainingCooldown > 0) {
      Alert.alert('Error', 'Please wait for the cooldown period to end')
      return
    }

    if (!state.provider) {
      Alert.alert('Error', 'Please select a mobile money provider')
      return
    }

    if (!state.amount || parseFloat(state.amount) < MIN_AMOUNT || parseFloat(state.amount) > MAX_AMOUNT) {
      Alert.alert('Error', `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}`)
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const payoutService = new PayoutService()
      const response = await payoutService.mobileMoney({
        phoneNumber: `${state.phoneCode}${state.phoneNumber}`,
        operator: state.provider,
        amount: parseFloat(state.amount)
      })

      await AsyncStorage.setItem('lastMobileMoneyTime', Date.now().toString())
      setState(prev => ({
        ...prev,
        loading: false,
        remainingCooldown: COOLDOWN_DURATION,
        amount: ''
      }))

      Alert.alert('Success', 'Mobile money payout completed successfully')
      router.push('/(tabs)')
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }))
      Alert.alert('Error', error.message)
    }
  }

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const availableProviders = mobileMoneyOptions[state.selectedCountry] || []

  return (
    <SettingsLayout title="Mobile Money">
      <ScrollView 
        style={tw`flex-1`} 
        contentContainerStyle={tw`p-4 pb-32`}
      >
        {/* Header Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            Mobile Money Payout
          </Text>
          <Text style={tw`text-gray-600 leading-5`}>
            Receive funds directly to your mobile money wallet.
          </Text>
        </View>

        {/* Balance Card */}
        <BalanceCard minimumPayout={3} />

        {/* Error Message */}
        {state.error && (
          <PrimaryAlert message={state.error} type='error' />
        )}

        {/* Mobile Money Form */}
        <View style={tw`bg-white rounded-xl p-6 shadow-sm mb-6`}>
          <Text style={tw`text-gray-800 font-bold mb-4`}>Payout Details</Text>
          
          {/* Country Selection */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-600 mb-2`}>Country</Text>
            <CountryDropdown
              initialCountry={state.selectedCountry}
              onSelect={({ value, phoneCode }) => {
                setState(prev => ({ 
                  ...prev, 
                  selectedCountry: value,
                  phoneCode: phoneCode,
                  provider: '' // Reset provider when country changes
                }));
              }}
            />
          </View>

          {/* Provider Selection */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-600 mb-2`}>Mobile Money Provider</Text>
            <View style={tw`border border-gray-200 rounded-xl overflow-hidden`}>
              <View style={tw`bg-gray-50 p-4`}>
                {availableProviders.length > 0 ? (
                  availableProviders.map((provider) => (
                    <TouchableOpacity
                      key={provider.value}
                      style={tw`py-3 px-2 border-b border-gray-100 flex-row items-center justify-between ${state.provider === provider.value ? 'bg-gray-100' : ''}`}
                      onPress={() => setState(prev => ({ ...prev, provider: provider.value }))}
                    >
                      <Text style={tw`text-gray-800`}>{provider.label}</Text>
                      {state.provider === provider.value && (
                        <View style={tw`w-5 h-5 rounded-full bg-[#32B3C2] items-center justify-center`}>
                          <Text style={tw`text-white font-bold text-xs`}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={tw`text-gray-500 py-2 px-4`}>No providers available for selected country</Text>
                )}
              </View>
            </View>
          </View>

          {/* Phone Number Input */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-600 mb-2`}>Phone Number</Text>
            <View style={tw`flex-row`}>
              <View style={tw`bg-gray-100 p-4 rounded-l-xl border-r border-gray-200`}>
                <Text style={tw`text-gray-600`}>+{state.phoneCode}</Text>
              </View>
              <TextInput
                style={tw`flex-1 bg-gray-50 p-4 rounded-r-xl`}
                placeholder="Phone Number"
                value={state.phoneNumber}
                onChangeText={(text) => setState(prev => ({ 
                  ...prev, 
                  phoneNumber: text.replace(/[^0-9]/g, '') 
                }))}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Amount Input */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-600 mb-2`}>Amount (USD)</Text>
            <TextInput
              style={tw`bg-gray-50 p-4 rounded-xl`}
              placeholder="Enter amount in USD"
              value={state.amount}
              onChangeText={(text) => setState(prev => ({ ...prev, amount: text }))}
              keyboardType="decimal-pad"
            />
            <Text style={tw`text-gray-500 mt-2 text-sm`}>
              Min: ${MIN_AMOUNT.toFixed(2)} - Max: ${MAX_AMOUNT.toFixed(2)}
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={tw`bg-[#32B3C2] p-4 rounded-xl ${(state.loading || state.remainingCooldown > 0 || !state.provider || !state.amount) ? 'opacity-50' : ''}`}
            onPress={handleMobileMoneyPayout}
            disabled={state.loading || state.remainingCooldown > 0 || !state.provider || !state.amount}
          >
            <Text style={tw`text-white text-center font-bold`}>
              {state.remainingCooldown > 0 
                ? `Wait ${formatTime(state.remainingCooldown)}`
                : state.loading 
                  ? 'Processing...' 
                  : 'Complete Payout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {state.loading && (
        <View style={tw`absolute inset-0 bg-black/50 flex items-center justify-center`}>
          <ActivityIndicator size="large" color="#32B3C2" />
        </View>
      )}
    </SettingsLayout>
  )
}

export default MobileMoney