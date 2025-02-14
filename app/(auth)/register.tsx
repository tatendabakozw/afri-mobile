import { Text, View, TouchableOpacity } from 'react-native';
import PrimaryDropdown from '@/components/dropdowns/primary-dropdown';
import { countryOptions } from '@/utils/countryOptions';
import { genderOptions } from '@/utils/genderOptions';
import AuthLayout from '@/layouts/AuthLayout';
import React, { useState } from 'react';
import { router } from 'expo-router';
import tw from 'twrnc';
import PrimaryInput from '@/components/inputs/primary-input';
import PrimaryButton from '@/components/buttons/primary-button';
import DateInput from '@/components/inputs/date-input';
import { validateEmail } from '@/helpers/validateEmail';

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: string;
  dob: string;
  gender: string;
  country: string;
}

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    day: '',
    month: '',
    year: '',
    gender: '',
    country: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
    dob: '',
    gender: '',
    country: ''
  });

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
      dob: '',
      gender: '',
      country: ''
    };

    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleNextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.day || !formData.month || !formData.year) {
        setErrors(prev => ({
          ...prev,
          dob: 'Date of birth is required'
        }));
        return;
      }
      if (!formData.gender) {
        setErrors(prev => ({
          ...prev,
          gender: 'Gender is required'
        }));
        return;
      }
      if (!formData.country) {
        setErrors(prev => ({
          ...prev,
          country: 'Country is required'
        }));
        return;
      }

      const dob = `${formData.year}-${formData.month.padStart(
        2,
        '0'
      )}-${formData.day.padStart(2, '0')}`;
      router.push('/(auth)/verification')
      console.log('Register attempt:', { ...formData, dob });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AuthLayout>
      <View style={tw`flex-1 w-full justify-center px-6`}>
        {step === 1 && (
          <>
            <Text style={tw`text-3xl text-center font-bold text-gray-800 mb-2`}>
              Let's get started
            </Text>
            <Text style={tw`text-gray-500 mb-8 text-center`}>
              Create your account to continue
            </Text>
            <PrimaryInput
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="First name"
              style={tw`w-full mt-4`}
              errorMessage={errors.firstName}
            />

            <PrimaryInput
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="Last name"
              style={tw`w-full mt-4`}
              errorMessage={errors.lastName}
            />

            <PrimaryInput
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              style={tw`w-full mt-4`}
              errorMessage={errors.email}
            />

            <PrimaryInput
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Password"
              secureTextEntry
              style={tw`w-full mt-4`}
              errorMessage={errors.password}
            />

            <PrimaryInput
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm password"
              secureTextEntry
              style={tw`w-full`}
              errorMessage={errors.confirmPassword}
            />
            <PrimaryButton
              onPress={handleNextStep}
              title="Proceed to Next Step"
              style={tw`w-full mb-4`}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={tw`text-3xl text-center font-bold text-gray-800 mb-2`}>
              Additional Information
            </Text>
            <Text style={tw`text-gray-500 text-center mb-8`}>
              Tell us a bit more about yourself
            </Text>


            <PrimaryButton
              onPress={() => setStep(1)}
              title="Back"
              style={tw`w-full mb-8`}
            />


            <DateInput
              day={formData.day}
              month={formData.month}
              year={formData.year}
              onChangeDay={(value) => handleInputChange('day', value)}
              onChangeMonth={(value) => handleInputChange('month', value)}
              onChangeYear={(value) => handleInputChange('year', value)}
              label="Date of Birth"
              error={errors.dob}
            />

            <PrimaryDropdown
              options={genderOptions}
              value={formData.gender}
              searchable
              onChange={(value) => handleInputChange('gender', value)}
              placeholder="Select gender"
              label="Gender"
              error={errors.gender}
            />

            <PrimaryDropdown
              options={countryOptions}
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
              placeholder="Select country"
              label="Country"
              searchable={true}
              searchPlaceholder="Search countries..."
              error={errors.country}
            />

            <View style={tw`flex-row justify-between w-full`}>

              <PrimaryButton
                onPress={handleNextStep}
                title="Complete Registration"
                style={tw`w-full`}
              />
            </View>
          </>
        )}
        {/* Login Link */}
        <View style={tw`flex-row items-center mt-4 justify-center w-full ml-auto`}>
          <Text style={tw`text-gray-500 text-center `}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)')}>
            <Text style={tw`text-[#29A1AF] font-bold`}>Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;
