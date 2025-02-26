import { Text, View, ScrollView, ActivityIndicator, TextInput, Alert, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import SettingsLayout from '@/layouts/SettingsLayout'
import tw from 'twrnc'
import PrimaryAlert from '@/components/alerts/primary-alert'
import BalanceCard from '@/components/page-sections/payouts/balance-card'
import CountryDropdown from '@/components/dropdowns/country-dropdown'
import { countryOptions } from '@/utils/countryOptions'
import { supportedBankTransferCountries } from '@/utils/bankTransferOptions'
import PayoutService from '@/api/services/payouts/PayoutService'
import ProfileService from '@/api/services/profile/ProfileService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface BankTransferState {
  loading: boolean
  error: string | null
  selectedCountry: string
  amount: string
  bankAccounts: BankAccount[]
  showAddAccountModal: boolean
  remainingCooldown: number
}

interface BankAccount {
  firstName: string
  lastName: string
  bankOptions: string
  bankId: string
  bankName: string
  branchCode: string
  email: string
  accountNumber: string
  mobileNumber: string
  address: string
}

interface BankOption {
  id: number
  name: string
  code: string
}

const COOLDOWN_DURATION = 10 * 60 * 1000 // 10 minutes
const MIN_AMOUNT = 5.00
const MAX_AMOUNT = 10.00

const BankTransfer = () => {
  const [state, setState] = useState<BankTransferState>({
    loading: false,
    error: null,
    selectedCountry: countryOptions.find(c => supportedBankTransferCountries.includes(c.value))?.value || 'NG',
    amount: '',
    bankAccounts: [],
    showAddAccountModal: false,
    remainingCooldown: 0
  })
  
  const [bankOptions, setBankOptions] = useState<BankOption[]>([])
  const [newBankAccount, setNewBankAccount] = useState<Partial<BankAccount>>({
    firstName: '',
    lastName: '',
    bankId: '',
    accountNumber: '',
    mobileNumber: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    checkCooldown()
    fetchBankAccounts()
    fetchBankOptions()
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
      const lastTransactionTime = await AsyncStorage.getItem('lastBankTransferTime')
      if (lastTransactionTime) {
        const elapsedTime = Date.now() - parseInt(lastTransactionTime)
        const remainingTime = Math.max(0, COOLDOWN_DURATION - elapsedTime)
        setState(prev => ({ ...prev, remainingCooldown: remainingTime }))
      }
    } catch (error) {
      console.error('Error checking cooldown:', error)
    }
  }

  const fetchBankAccounts = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const payoutService = new PayoutService()
      const response = await payoutService.getUserBankAccounts()
      setState(prev => ({ 
        ...prev, 
        bankAccounts: response.data || [],
        loading: false
      }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false
      }))
    }
  }

  const fetchBankOptions = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const payoutService = new PayoutService()
      const response = await payoutService.getBanksByCountry(state.selectedCountry)
      setBankOptions(response.data || [])
      setState(prev => ({ ...prev, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false
      }))
    }
  }

  const handleBankTransfer = async () => {
    if (state.remainingCooldown > 0) {
      Alert.alert('Error', 'Please wait for the cooldown period to end')
      return
    }

    if (!state.amount || parseFloat(state.amount) < MIN_AMOUNT || parseFloat(state.amount) > MAX_AMOUNT) {
      Alert.alert('Error', `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}`)
      return
    }

    if (state.bankAccounts.length === 0) {
      Alert.alert('Error', 'Please add a bank account first')
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const payoutService = new PayoutService()
      const response = await payoutService.requestPayout({
        amount: parseFloat(state.amount)
      })

      await AsyncStorage.setItem('lastBankTransferTime', Date.now().toString())
      setState(prev => ({
        ...prev,
        loading: false,
        remainingCooldown: COOLDOWN_DURATION,
        amount: ''
      }))

      Alert.alert('Success', 'Bank transfer initiated successfully')
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

  const handleAddBankAccount = async () => {
    if (!newBankAccount.firstName || !newBankAccount.lastName || !newBankAccount.bankId || !newBankAccount.accountNumber) {
      Alert.alert('Error', 'Please fill all required fields')
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const payoutService = new PayoutService()
      const selectedBank = bankOptions.find(bank => bank.id.toString() === newBankAccount.bankId)
      
      await payoutService.addBankAccount({
        ...newBankAccount as BankAccount,
        bankName: selectedBank?.name || '',
        // bankOptions: state.selectedCountry
      })

      // Refresh bank accounts list
      await fetchBankAccounts()
      
      // Close modal and reset form
      setState(prev => ({
        ...prev,
        showAddAccountModal: false,
        loading: false
      }))
      
      setNewBankAccount({
        firstName: '',
        lastName: '',
        bankId: '',
        accountNumber: '',
        mobileNumber: '',
        email: '',
        address: ''
      })
      
      Alert.alert('Success', 'Bank account added successfully')
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
    <SettingsLayout title="Bank Transfer">
      <ScrollView 
        style={tw`flex-1`} 
        contentContainerStyle={tw`p-4 pb-32`}
      >
        {/* Header Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            Bank Transfer Payout
          </Text>
          <Text style={tw`text-gray-600 leading-5`}>
            Withdraw funds directly to your bank account.
          </Text>
        </View>

        {/* Balance Card */}
        <BalanceCard minimumPayout={5} />

        {/* Error Message */}
        {state.error && (
          <PrimaryAlert message={state.error} type='error' />
        )}

        {/* Bank Account Section */}
        <View style={tw`bg-white rounded-xl p-6 shadow-sm mb-6`}>
          <Text style={tw`text-gray-800 font-bold mb-4`}>Bank Account</Text>
          
          {state.bankAccounts.length === 0 ? (
            <View style={tw`items-center py-6`}>
              <Text style={tw`text-gray-600 mb-4 text-center`}>
                You don't have any bank accounts set up yet.
              </Text>
              <TouchableOpacity
                style={tw`bg-[#32B3C2] py-3 px-6 rounded-xl`}
                onPress={() => setState(prev => ({ ...prev, showAddAccountModal: true }))}
              >
                <Text style={tw`text-white font-bold`}>Add Bank Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {state.bankAccounts.map((account, index) => (
                <View key={index} style={tw`bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200`}>
                  <Text style={tw`text-gray-800 font-bold mb-1`}>{account.bankName.toUpperCase()}</Text>
                  <Text style={tw`text-gray-600 mb-1`}>Account: {account.accountNumber}</Text>
                  <Text style={tw`text-gray-600`}>Name: {account.firstName} {account.lastName}</Text>
                </View>
              ))}
              
              {/* Amount Input */}
              <View style={tw`mt-6`}>
                <Text style={tw`text-gray-600 mb-2`}>Amount (USD)</Text>
                <TextInput
                  style={tw`bg-gray-50 p-4 rounded-xl mb-2`}
                  placeholder="Enter amount in USD"
                  value={state.amount}
                  onChangeText={(text) => setState(prev => ({ ...prev, amount: text }))}
                  keyboardType="decimal-pad"
                />
                <Text style={tw`text-gray-500 mb-4 text-sm`}>
                  Min: ${MIN_AMOUNT.toFixed(2)} - Max: ${MAX_AMOUNT.toFixed(2)}
                </Text>
              </View>
              
              {/* Submit Button */}
              <TouchableOpacity
                style={tw`bg-[#32B3C2] p-4 rounded-xl ${(state.loading || state.remainingCooldown > 0 || !state.amount) ? 'opacity-50' : ''}`}
                onPress={handleBankTransfer}
                disabled={state.loading || state.remainingCooldown > 0 || !state.amount}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  {state.remainingCooldown > 0 
                    ? `Wait ${formatTime(state.remainingCooldown)}`
                    : state.loading 
                      ? 'Processing...' 
                      : 'Complete Transfer'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Bank Account Modal */}
      <Modal
        visible={state.showAddAccountModal}
        animationType="slide"
        transparent={true}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-xl p-6 w-full max-w-md`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>Add Bank Account</Text>
              <TouchableOpacity 
                onPress={() => setState(prev => ({ ...prev, showAddAccountModal: false }))}
                style={tw`p-2`}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={tw`max-h-96`}>
              {/* First Name */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>First Name</Text>
                <TextInput
                  style={tw`bg-gray-50 p-4 rounded-xl border border-gray-200`}
                  placeholder="Enter first name"
                  value={newBankAccount.firstName}
                  onChangeText={(text) => setNewBankAccount(prev => ({ ...prev, firstName: text }))}
                />
              </View>
              
              {/* Last Name */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Last Name</Text>
                <TextInput
                  style={tw`bg-gray-50 p-4 rounded-xl border border-gray-200`}
                  placeholder="Enter last name"
                  value={newBankAccount.lastName}
                  onChangeText={(text) => setNewBankAccount(prev => ({ ...prev, lastName: text }))}
                />
              </View>
              
              {/* Bank Selection */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Select Bank</Text>
                <View style={tw`bg-gray-50 rounded-xl border border-gray-200`}>
                  <ScrollView style={tw`max-h-32`}>
                    {bankOptions.map((bank) => (
                      <TouchableOpacity
                        key={bank.id}
                        style={tw`py-3 px-4 border-b border-gray-100 ${newBankAccount.bankId === bank.id.toString() ? 'bg-gray-100' : ''}`}
                        onPress={() => setNewBankAccount(prev => ({ ...prev, bankId: bank.id.toString() }))}
                      >
                        <Text style={tw`text-gray-800`}>{bank.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              
              {/* Account Number */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Account Number</Text>
                <TextInput
                  style={tw`bg-gray-50 p-4 rounded-xl border border-gray-200`}
                  placeholder="Enter account number"
                  value={newBankAccount.accountNumber}
                  onChangeText={(text) => setNewBankAccount(prev => ({ ...prev, accountNumber: text }))}
                  keyboardType="number-pad"
                />
              </View>
              
              {/* Mobile Number */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Mobile Number</Text>
                <TextInput
                  style={tw`bg-gray-50 p-4 rounded-xl border border-gray-200`}
                  placeholder="Enter mobile number"
                  value={newBankAccount.mobileNumber}
                  onChangeText={(text) => setNewBankAccount(prev => ({ ...prev, mobileNumber: text }))}
                  keyboardType="phone-pad"
                />
              </View>
              
              {/* Email */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Email</Text>
                <TextInput
                  style={tw`bg-gray-50 p-4 rounded-xl border border-gray-200`}
                  placeholder="Enter email"
                  value={newBankAccount.email}
                  onChangeText={(text) => setNewBankAccount(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={tw`bg-[#32B3C2] p-4 rounded-xl mt-4`}
              onPress={handleAddBankAccount}
            >
              <Text style={tw`text-white text-center font-bold`}>
                {state.loading ? 'Saving...' : 'Save Bank Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {state.loading && (
        <View style={tw`absolute inset-0 bg-black/50 flex items-center justify-center`}>
          <ActivityIndicator size="large" color="#32B3C2" />
        </View>
      )}
    </SettingsLayout>
  )
}

export default BankTransfer