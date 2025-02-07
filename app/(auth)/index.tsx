import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AuthLayout from '@/layouts/AuthLayout';
import { router } from 'expo-router';
import tw from 'twrnc'
import PrimaryInput from '@/components/buttons/primary-input';
import PrimaryButton from '@/components/buttons/primary-button';

const Index = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('');
  const [buttonError, setButtonError] = useState(false)

  const handleSubmit = () => {
    if (!email) {
      setButtonError(true)
      setError('This field is required');
    } else {
      setError('');
      router.push('/(tabs)')
      console.log('Submitted value:', email);
    }
  };

  return (
    <AuthLayout>
      <View style={tw`flex-1 w-full justify-center px-6`}>
        {/* Welcome back */}
        <Text style={tw`text-4xl font-bold text-center text-gray-800 mb-2`}>
          Welcome back
        </Text>

        {/* Please login */}
        <Text style={tw`text-gray-500 text-center text-md mb-8`}>
          Please login to continue
        </Text>

        {/* Email address */}

        <PrimaryInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          errorMessage={error}
          autoCapitalize="none"
          style={tw`w-full`}
        />

        {/* Password */}
        <PrimaryInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={tw`w-full`}
        />
        {/* Forgot password */}
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={tw`ml-auto mb-8`}>
          <Text style={tw`text-[#29A1AF] text-right text-sm font-bold`}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Login button */}
        <PrimaryButton
          onPress={handleSubmit}
          error={buttonError}
          title="Login"
          style={tw`w-full mb-4`}
        />

        <View style={tw`flex-row items-center w-full justify-center mt-4`}>
          <Text style={tw`text-gray-500`}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={tw`text-[#29A1AF] font-bold`}>
              Sign up here
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  customContainer: {
    width: '80%',
  },
  customInput: {
    borderColor: '#29A1AF',
    borderWidth: 2,
  },
})

export default Index