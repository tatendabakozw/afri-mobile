import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import GeneralLayout from '@/layouts/GeneralLayout'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import PrimaryButton from '@/components/buttons/primary-button'
import ProfileService from '@/api/services/profile/ProfileService'
import { router } from 'expo-router'
import PayoutService from '@/api/services/payouts/PayoutService'
import BalanceCard from '@/components/page-sections/payouts/balance-card'

const PAYOUT_METHODS = [
  {
    id: 'bank_flw',
    name: 'Bank Transfer',
    provider: 'via Flutterwave',
    icon: 'card',
    minAmount: 10,
    description: 'Transfer directly to your bank account',
    type: 'BANK_TRANSFER'
  },
  {
    id: 'momo_flw',
    name: 'Mobile Money',
    provider: 'via Flutterwave',
    icon: 'phone-portrait',
    minAmount: 5,
    description: 'Instant transfer to your mobile wallet',
    type: 'MOBILE_MONEY'
  },
  {
    id: 'topup_reloadly',
    name: 'Mobile Top-up',
    provider: 'via Reloadly',
    icon: 'phone-portrait',
    minAmount: 5,
    description: 'Recharge your mobile balance',
    type: 'RELOADLY'
  },
  {
    id: 'topup_sochitel',
    name: 'Mobile Top-up',
    provider: 'via Sochitel',
    icon: 'phone-portrait',
    minAmount: 5,
    description: 'Recharge your mobile balance',
    type: 'SOCHITEL'
  }
]

const Payouts = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [methodAvailability, setMethodAvailability] = useState({
    RELOADLY: false,
    FLUTTERWAVE: false,
    SOCHITEL: false,
  })
  const [methodLoading, setMethodLoading] = useState({
    RELOADLY: true,
    FLUTTERWAVE: true,
    SOCHITEL: true,
  })

  const minimumPayout = 5.00

  useEffect(() => {
    fetchBalance()
    checkMethodsAvailability()
  }, [])

  const fetchBalance = async () => {
    try {
      const profileService = new ProfileService()
      const response = await profileService.getUserRewardBalance()
      if (response.success) {
        setBalance(response.data.rewardBalance)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkMethodsAvailability = async () => {
    const payoutService = new PayoutService()

    try {
      const [reloadly, flutterwave, sochitel] = await Promise.all([
        payoutService.checkReloadlyAvailability(),
        payoutService.checkFlutterwaveAvailability(),
        payoutService.checkSochitelAvailability()
      ])

      setMethodAvailability({
        RELOADLY: !reloadly.data.isAvailable,
        FLUTTERWAVE: !flutterwave.data.isAvailable,
        SOCHITEL: !sochitel.data.isAvailable
      })
    } catch (error) {
      console.error('Error checking methods availability:', error)
    } finally {
      setMethodLoading({
        RELOADLY: false,
        FLUTTERWAVE: false,
        SOCHITEL: false
      })
    }
  }

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleWithdraw = () => {
    if (!selectedMethod) return

    const method = PAYOUT_METHODS.find(m => m.id === selectedMethod)
    if (!method) return

    switch (method.type) {
      case 'BANK_TRANSFER':
        router.push('/(payouts)/bank-transfer')
        break
      case 'MOBILE_MONEY':
        router.push('/(payouts)/mobile-money')
        break
      case 'RELOADLY':
        router.push('/(payouts)/mobile-topup')
        break
      case 'SOCHITEL':
        router.push('/(payouts)/mobile-topup-v2')
        break
    }
  }

  if (loading) {
    return (
      <GeneralLayout>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#32B3C2" />
        </View>
      </GeneralLayout>
    )
  }

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-32`}>
        {/* Rewards heading */}
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>Payout Methods</Text>

        {/* Rewards description */}
        <Text style={tw`text-gray-600 mb-6 leading-6`}>
        We support different payout methods. Depending on their availability in your country, you will find those available for you below. You can request a payout if you have reached the minimum amount. You can find the minimum amount per payment method below.


        </Text>

        {/* Balance Card */}
        <BalanceCard minimumPayout={minimumPayout} />
        {/* Payment Methods */}
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
          Select Payment Method
        </Text>

        {PAYOUT_METHODS.map((method) => {
          const isAvailable = !methodAvailability[method.type as keyof typeof methodAvailability]
          const isLoading = methodLoading[method.type as keyof typeof methodLoading]

          return (
            <TouchableOpacity
              key={method.id}
              style={tw`flex-row items-center p-4 bg-white rounded-xl mb-3 border 
                ${selectedMethod === method.id ? 'border-[#32B3C2]' : 'border-gray-200'}
                ${(!isAvailable || balance < method.minAmount) ? 'opacity-50' : ''}
              `}
              onPress={() => handleMethodSelect(method.id)}
              disabled={!isAvailable || balance < method.minAmount || isLoading}
            >
              <View style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center`}>
                <Ionicons name={method.icon as any} size={24} color="#32B3C2" />
              </View>

              <View style={tw`flex-1 ml-4`}>
                <Text style={tw`font-medium text-gray-800`}>{method.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>{method.provider}</Text>
                <Text style={tw`text-xs text-gray-400 mt-1`}>{method.description}</Text>
                <Text style={tw`text-sm text-gray-500 mt-1`}>
                  Minimum: ${method.minAmount.toFixed(2)}
                </Text>

                {isLoading && (
                  <View style={tw`flex-row items-center mt-2`}>
                    <ActivityIndicator size="small" color="#32B3C2" />
                    <Text style={tw`ml-2 text-sm text-gray-500`}>
                      Checking availability...
                    </Text>
                  </View>
                )}

                {!isLoading && !isAvailable && (
                  <Text style={tw`text-sm text-red-500 mt-2`}>
                    Temporarily unavailable
                  </Text>
                )}
              </View>

              {selectedMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#32B3C2" />
              )}
            </TouchableOpacity>
          )
        })}

        {/* Withdraw Button */}
        <PrimaryButton
          title="Withdraw Funds"
          onPress={handleWithdraw}
          disabled={!selectedMethod || balance < minimumPayout}
          style={tw`mt-6`}
        />
      </ScrollView>
    </GeneralLayout>
  )
}

export default Payouts