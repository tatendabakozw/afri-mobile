import { Text, View, TouchableOpacity, TextInput, Keyboard, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import AuthLayout from '@/layouts/AuthLayout'
import tw from 'twrnc'
import PrimaryButton from '@/components/buttons/primary-button';

const CELL_COUNT = 6;
const CELL_SIZE = 48;

const Verification = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<Array<TextInput | null>>([])
  const shakeAnimation = useRef(new Animated.Value(0)).current
  const fadeAnimation = useRef(new Animated.Value(1)).current

  // Timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const animateError = () => {
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start()

    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start()
  }

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')

    // Auto-advance
    if (value && index < CELL_COUNT - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === CELL_COUNT - 1 && !newCode.includes('')) {
      Keyboard.dismiss()
      handleVerify()
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace
      const newCode = [...code]
      newCode[index - 1] = ''
      setCode(newCode)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const completeCode = code.join('')
    if (completeCode.length !== CELL_COUNT) {
      setError('Please enter the complete code')
      animateError()
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Verifying code:', completeCode)
      // Handle success
    } catch (err) {
      setError('Invalid verification code')
      animateError()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCode(['', '', '', '', '', ''])
      setError('')
      setResendTimer(30)
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <View style={tw`flex-1 w-full justify-center px-6`}>
        <Text style={tw`text-3xl text-center font-bold text-gray-800 mb-2`}>
          Verify your account
        </Text>
        <Text style={tw`text-gray-500 mb-8 text-center`}>
          Please enter the 6-digit verification code sent to your email
        </Text>

        <Animated.View 
          style={[
            tw`flex-row justify-between mb-8`,
            {
              transform: [{ translateX: shakeAnimation }],
              opacity: fadeAnimation
            }
          ]}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              style={[
                tw`w-12 h-12 text-center text-xl bg-white border rounded-lg mx-1`,
                digit ? tw`border-[#29A1AF] border-2` : tw`border-gray-200`,
                error ? tw`border-red-500` : null
              ]}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectionColor="#29A1AF"
              autoComplete="one-time-code"
              returnKeyType={index === CELL_COUNT - 1 ? "done" : "next"}
              blurOnSubmit={false}
            />
          ))}
        </Animated.View>

        {error ? (
          <Animated.Text 
            style={[
              tw`text-red-500 text-center mb-4`,
              { opacity: fadeAnimation }
            ]}
          >
            {error}
          </Animated.Text>
        ) : null}

        <PrimaryButton
          title="Verify"
          onPress={handleVerify}
          style={tw`w-full mb-8`}
          loading={isLoading}
        />

        <View style={tw`flex-row justify-center items-center`}>
          <Text style={tw`text-gray-500 mr-1`}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity 
            onPress={handleResend}
            disabled={resendTimer > 0 || isLoading}
          >
            <Text 
              style={[
                tw`font-bold`,
                resendTimer > 0 ? tw`text-gray-400` : tw`text-[#29A1AF]`
              ]}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  )
}

export default Verification