import { Text, View, ScrollView, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProfileService from '@/api/services/profile/ProfileService'
import PayoutService from '@/api/services/payouts/PayoutService'
import { countryOptions } from '@/utils/countryOptions'
import CountryDropdown from '@/components/dropdowns/country-dropdown'
import SettingsLayout from '@/layouts/SettingsLayout'
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import tw from 'twrnc'
import PrimaryAlert from '@/components/alerts/primary-alert'
import BalanceCard from '@/components/page-sections/payouts/balance-card'

interface TopupState {
  loading: boolean
  error: string | null
  balance: number
  selectedCountry: string
  phoneCode: number
  phoneNumber: string
  amount: string
  providerVerified: boolean
  operatorData: any
  convertedAmount: string
  remainingCooldown: number
  operatorName: string
}

const COOLDOWN_DURATION = 10 * 60 * 1000 // 10 minutes
const MIN_AMOUNT = 3.00
const MAX_AMOUNT = 10.00

const MobileTopup = () => {
  const [state, setState] = useState<TopupState>({
    loading: false,
    error: null,
    balance: 0,
    selectedCountry: countryOptions[0].value,
    phoneCode: countryOptions[0].phoneCode,
    phoneNumber: '',
    amount: '',
    providerVerified: false,
    operatorData: null,
    convertedAmount: '',
    remainingCooldown: 0,
    operatorName: ''
  })

  useEffect(() => {
    checkCooldown()
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
      const lastTransactionTime = await AsyncStorage.getItem('lastTransactionTime')
      if (lastTransactionTime) {
        const elapsedTime = Date.now() - parseInt(lastTransactionTime)
        const remainingTime = Math.max(0, COOLDOWN_DURATION - elapsedTime)
        setState(prev => ({ ...prev, remainingCooldown: remainingTime }))
      }
    } catch (error) {
      console.error('Error checking cooldown:', error)
    }
  }

  const verifyProvider = async () => {
    if (!state.phoneNumber || state.phoneNumber.length < 7) {
      Alert.alert('Error', 'Please enter a valid phone number')
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const payoutService = new PayoutService()
      const response = await payoutService.getSochitelOperators({
        countryCode: state.selectedCountry,
        productType: "1"
      })

      const fullPhoneNumber = `${state.phoneCode}${state.phoneNumber}`.replace('+', '')
      const matchingOperator = response.data.operators.find((operator: any) => {
        return operator.prefixes.some((prefix: string) => fullPhoneNumber.startsWith(prefix))
      })

      if (!matchingOperator) {
        throw new Error('No matching operator found for this phone number')
      }

      setState(prev => ({
        ...prev,
        operatorData: {
          operatorId: matchingOperator.id,
          name: matchingOperator.name,
          country: matchingOperator.country,
          destinationCurrencyCode: matchingOperator.currency,
          fx: { rate: 1 }
        },
        operatorName: matchingOperator.name,
        providerVerified: true,
        loading: false
      }))
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }))
      Alert.alert('Error', error.message)
    }
  }

  // Add the cooldown interval effect
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

  const handleTopUp = async () => {
    if (state.remainingCooldown > 0) {
      Alert.alert('Error', 'Please wait for the cooldown period to end')
      return
    }

    if (!state.amount || parseFloat(state.amount) < MIN_AMOUNT || parseFloat(state.amount) > MAX_AMOUNT) {
      Alert.alert('Error', `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}`)
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const payoutService = new PayoutService()
      // await payoutService.createUnifiedPaymentSochitel({
      //   countryCode: state.operatorData.country.isoName,
      //   number: `${state.phoneCode}${state.phoneNumber}`,
      //   amount: parseFloat(state.amount),
      //   operatorId: String(state.operatorData.operatorId),
      //   currency: state.operatorData.destinationCurrencyCode,
      // })

      // await AsyncStorage.setItem('lastTransactionTime', Date.now().toString())
      setState(prev => ({
        ...prev,
        loading: false,
        remainingCooldown: COOLDOWN_DURATION,
        providerVerified: false,
        phoneNumber: '',
        amount: ''
      }))

      Alert.alert('Success', 'Top-up completed successfully')
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

  return (
    <SettingsLayout title="Sochitel">
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-32`}
      >
        {/* Header Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            Mobile Top-up via Reloadly
          </Text>
          <Text style={tw`text-gray-600 leading-5`}>
            Top up your mobile balance instantly using your earned rewards.
          </Text>
        </View>

        {/* Balance Card */}
        <BalanceCard minimumPayout={3} />

        {/* Error Message */}
        {state.error && (
          <PrimaryAlert message={state.error} type='error' />
        )}

        {!state.providerVerified ? (
          // Phone Number Input Section
          <View style={tw`bg-white rounded-xl p-6 shadow-sm`}>
            <Text style={tw`text-gray-800 font-bold mb-4`}>Enter Phone Number</Text>

            {/* Country Selection */}
            <View style={tw`mb-4`}>
              <CountryDropdown
                initialCountry={state.selectedCountry}
                onSelect={({ value, phoneCode }) => {
                  setState(prev => ({
                    ...prev,
                    selectedCountry: value,
                    phoneCode: phoneCode
                  }));
                }}
              />
            </View>

            {/* Phone Number Input */}
            <View style={tw`flex-row items-center mb-4`}>
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

            <TouchableOpacity
              style={tw`bg-[#32B3C2] p-4 rounded-xl ${(!state.phoneNumber || state.loading) ? 'opacity-50' : ''}`}
              onPress={verifyProvider}
              disabled={!state.phoneNumber || state.loading}
            >
              <Text style={tw`text-white text-center font-bold`}>
                {state.loading ? 'Verifying...' : 'Verify Number'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Amount Input Section
          <View style={tw`bg-white rounded-xl p-6 shadow-sm`}>
            <Text style={tw`text-gray-800 font-bold mb-4`}>{state.operatorName}</Text>
            <TextInput
              style={tw`bg-gray-50 p-4 rounded-xl mb-4`}
              placeholder="Enter amount in USD"
              value={state.amount}
              onChangeText={(text) => setState(prev => ({ ...prev, amount: text }))}
              keyboardType="decimal-pad"
            />
            <Text style={tw`text-gray-600 mb-4`}>
              Min: ${MIN_AMOUNT.toFixed(2)} - Max: ${MAX_AMOUNT.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={tw`bg-[#32B3C2] p-4 rounded-xl ${(state.loading || state.remainingCooldown > 0) ? 'opacity-50' : ''}`}
              onPress={handleTopUp}
              disabled={state.loading || state.remainingCooldown > 0}
            >
              <Text style={tw`text-white text-center font-bold`}>
                {state.remainingCooldown > 0
                  ? `Wait ${formatTime(state.remainingCooldown)}`
                  : state.loading
                    ? 'Processing...'
                    : 'Complete Top-up'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {state.loading && (
          <View style={tw`absolute inset-0 bg-black/50 flex items-center justify-center`}>
            <ActivityIndicator size="large" color="#32B3C2" />
          </View>
        )}
      </ScrollView>
    </SettingsLayout>
  )
}

export default MobileTopup