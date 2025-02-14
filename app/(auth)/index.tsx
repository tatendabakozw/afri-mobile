import { Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AuthLayout from '@/layouts/AuthLayout';
import { router } from 'expo-router';
import tw from 'twrnc'
import AuthService from '@/api/services/auth/AuthService';
import { getMessage } from '@/helpers/getMessage';
import PrimaryInput from '@/components/inputs/primary-input';
import PrimaryAlert from '@/components/alerts/primary-alert';
import PrimaryButton from '@/components/buttons/primary-button';

const Index = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState('');
  const [buttonError, setButtonError] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const authService = new AuthService();

  async function loginUser(email: string, password: string) {
    return authService.loginUser({ email, password });
  }

  const handleSubmit = async () => {
    try {
      if (!email) {
        setButtonError(true);
        setValidationError('This field is required');
        return;
      } else {
        setButtonError(false);
        setValidationError('');
        setError('');
        setIsLoading(true);

        const response:any = await loginUser(email, password);

        // if (response.enable2FA) {
        //   // Handle 2FA scenario
        //   const secretKey = process.env.REACT_APP_CRYPTO_KEY || "default_secret_key";
        //   const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();
        //   router.push(`/login/verify?email=${encodeURIComponent(encryptedEmail)}`);
        // } else {
        //   // Handle successful login
        //   console.log('Login successful:', response);
        //   // router.push('/(tabs)')
        // }
        // console.log('Login successful:', response);
        router.replace('/(tabs)')
      }
    } catch (error: any) {
      setButtonError(true);
      setIsLoading(false);
      if (getMessage(error) === "Invalid username or password." || getMessage(error) === "Invalid credentials") {
        setError('Invalid credentials. Please try again.');
      } else if (getMessage(error) === "Account has not been verified. An email has been sent to your mail") {
        // const secretKey = process.env.REACT_APP_CRYPTO_KEY || "default_secret_key";
        // const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();
        // router.push(`/account/verify?email=${encodeURIComponent(encryptedEmail)}`);
        setError('Account has not been verified. An email has been sent to your mail');
      } else if (getMessage(error) === "Account is not active. Please, contact support") {
        setError('Account is not active. Please, contact support.');
      } else if (getMessage(error) === "Network error: Unable to connect to the server. Please check your internet connection.") {
        setError('Network error: Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
        <Text style={tw`text-gray-500 text-center mb-8`}>
          Please login to continue
        </Text>

        {/* Email address */}
        <PrimaryInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          errorMessage={validationError}
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

        {/* Error alert */}
        {error ? (
          <PrimaryAlert message={error} type="error" />
        ) : null}

        {/* Login button */}
        <PrimaryButton
          onPress={handleSubmit}
          loading={isLoading}
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

export default Index