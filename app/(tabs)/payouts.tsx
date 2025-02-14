import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import GeneralLayout from '@/layouts/GeneralLayout'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import PrimaryButton from '@/components/buttons/primary-button'

const Payouts = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const balance = 0.00 // Replace with actual balance
  const minimumPayout = 5.00

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-32`}>
       {/* Rewards heading */}
      <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
        Rewards
      </Text>

      {/* Rewards description */}
      <Text style={tw`text-gray-600 mb-6 leading-6`}>
        Welcome to your rewards page! Here, you can track the 
        status of the surveys you've completed and the rewards 
        you've earned. We value your time and opinions, and 
        we're committed to ensuring a transparent and efficient 
        rewards process.
      </Text>
        {/* Balance Card */}
        <View style={tw`bg-white rounded-xl p-6 mb-6`}>
          <Text style={tw`text-gray-500 mb-2`}>Available Balance</Text>
          <Text style={tw`text-3xl font-bold text-gray-800`}>
            ${balance.toFixed(2)}
          </Text>
          {balance < minimumPayout && (
            <View style={tw`flex-row items-center mt-4 bg-orange-50 p-3 rounded-lg`}>
              <Ionicons name="warning-outline" size={20} color="#F97316" />
              <Text style={tw`ml-2 text-orange-700`}>
                Minimum withdrawal amount is ${minimumPayout}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
          Select Payment Method
        </Text>

        {[
  { 
    id: 'bank_flw', 
    name: 'Bank Transfer', 
    provider: 'via Flutterwave',
    icon: 'card',
    minAmount: 10,
    description: 'Transfer directly to your bank account'
  },
  { 
    id: 'momo_flw', 
    name: 'Mobile Money', 
    provider: 'via Flutterwave',
    icon: 'phone-portrait',
    minAmount: 5,
    description: 'Instant transfer to your mobile wallet'
  },
  { 
    id: 'topup_reloadly', 
    name: 'Mobile Top-up', 
    provider: 'via Reloadly',
    icon: 'phone-portrait',
    minAmount: 5,
    description: 'Recharge your mobile balance'
  },
  { 
    id: 'topup_sochitel', 
    name: 'Mobile Top-up', 
    provider: 'via Sochitel',
    icon: 'phone-portrait',
    minAmount: 5,
    description: 'Recharge your mobile balance'
  }
].map((method) => (
  <TouchableOpacity
    key={method.id}
    style={tw`flex-row items-center p-4 bg-white rounded-xl mb-3 border ${
      selectedMethod === method.id ? 'border-[#32B3C2]' : 'border-gray-200'
    }`}
    onPress={() => setSelectedMethod(method.id)}
    disabled={balance < method.minAmount}
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
    </View>
    {selectedMethod === method.id && (
      <Ionicons name="checkmark-circle" size={24} color="#32B3C2" />
    )}
  </TouchableOpacity>
))}

        {/* Withdraw Button */}
        <PrimaryButton
          title="Withdraw Funds"
          onPress={() => console.log('Withdraw:', selectedMethod)}
          disabled={!selectedMethod || balance < minimumPayout}
          style={tw`mt-6`}
        />
      </ScrollView>
    </GeneralLayout>
  )
}

export default Payouts