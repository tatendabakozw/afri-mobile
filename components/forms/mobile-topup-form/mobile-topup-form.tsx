import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import PrimaryButton from '@/components/buttons/primary-button'

interface MobileTopupFormProps {
  balance: number
  onSubmit: (data: any) => void
  loading: boolean
  provider: 'sochitel' | 'reloadly'
}

const MobileTopupForm = ({ 
  balance, 
  onSubmit, 
  loading,
  provider 
}: MobileTopupFormProps) => {
  const [form, setForm] = useState({
    country: '',
    operator: '',
    phoneNumber: '',
    amount: ''
  })

  const handleSubmit = () => {
    onSubmit({
      ...form,
      provider
    })
  }

  const isValid = 
    form.country && 
    form.operator && 
    form.phoneNumber && 
    form.amount && 
    Number(form.amount) <= balance

  return (
    <View style={tw`bg-white rounded-xl p-6 shadow-sm`}>
      <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>
        Top-up Details
      </Text>

      <View style={tw`space-y-4`}>
        {/* <CountryPicker
          value={form.country}
          onChange={country => setForm(prev => ({ ...prev, country }))}
        /> */}

        {/* <OperatorPicker
          country={form.country}
          value={form.operator}
          onChange={operator => setForm(prev => ({ ...prev, operator }))}
        /> */}

        <View>
          <Text style={tw`text-sm text-gray-600 mb-2`}>Phone Number</Text>
          <TextInput
            style={tw`bg-gray-50 p-4 rounded-lg border border-gray-200`}
            placeholder="Enter phone number"
            value={form.phoneNumber}
            onChangeText={phoneNumber => setForm(prev => ({ ...prev, phoneNumber }))}
            keyboardType="phone-pad"
          />
        </View>

        <View>
          <Text style={tw`text-sm text-gray-600 mb-2`}>Amount (USD)</Text>
          <TextInput
            style={tw`bg-gray-50 p-4 rounded-lg border border-gray-200`}
            placeholder="Enter amount"
            value={form.amount}
            onChangeText={amount => setForm(prev => ({ ...prev, amount }))}
            keyboardType="decimal-pad"
          />
        </View>

        <PrimaryButton
          title={loading ? 'Processing...' : 'Submit'}
          onPress={handleSubmit}
          disabled={!isValid || loading}
        />
      </View>
    </View>
  )
}

export default MobileTopupForm