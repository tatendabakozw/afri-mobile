import PrimaryAlert from '@/components/alerts/primary-alert';
import { View, Text, TouchableOpacity } from 'react-native';
import AuthService from '@/api/services/auth/AuthService';
import { validateEmail } from '@/helpers/validateEmail';
import AuthLayout from '@/layouts/AuthLayout';
import { router } from 'expo-router';
import { useState } from 'react';
import tw from 'twrnc';
import PrimaryInput from '@/components/inputs/primary-input';
import PrimaryButton from '@/components/buttons/primary-button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [buttonError, setButtonError] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  const authService = new AuthService()

  const handleSubmit = async () => {
    // Reset states
    setValidationError('')
    setButtonError(false)
    setAlert(null)

    // Validate email
    if (!email) {
      setButtonError(true)
      setValidationError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setButtonError(true)
      setValidationError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      await authService.forgotPassword({ email })
      setShowResendButton(true)
      setAlert({ 
        type: 'success', 
        message: 'Password reset instructions have been sent to your email' 
      })
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.message || 'Failed to send reset instructions' 
      })
      setButtonError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError('')

    try {
      await authService.resendForgotPassword({ email })
      setAlert({ 
        type: 'success', 
        message: 'Reset instructions have been resent to your email' 
      })
    } catch (error: any) {
      setError(error.message || 'Failed to resend reset instructions')
      setAlert({ 
        type: 'error', 
        message: error.message || 'Failed to resend reset instructions' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <View style={tw`flex-1 w-full justify-center px-6`}>
        <Text style={tw`text-3xl font-bold text-center text-gray-800 mb-2`}>
          Forgot password?
        </Text>
        <Text style={tw`text-gray-500 mb-8 text-center`}>
          Don't worry, it happens to the best of us
        </Text>

        <PrimaryInput
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            setError('')
            setButtonError(false)
          }}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={validationError}
          style={tw`w-full`}
        />

        {alert && (
          <PrimaryAlert 
            type={alert.type}
            message={alert.message}
          />
        )}

        <PrimaryButton
          onPress={handleSubmit}
          title="Send Reset Link"
          error={buttonError}
          loading={isLoading}
          style={tw`w-full mb-4 mt-4`}
        />

        {showResendButton && (
          <PrimaryButton
            onPress={handleResend}
            title="Resend Instructions"
            loading={isLoading}
            style={tw`w-full mb-4`}
          />
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`flex-row justify-center items-center`}
        >
          <Text style={tw`text-gray-500`}>
            Remember your password?{' '}
            <Text style={tw`text-[#32B3C2] font-bold`}>
              Login here
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  )
}

export default ForgotPassword