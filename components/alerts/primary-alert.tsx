import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'

type Props = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const PrimaryAlert = ({ message, type }: Props) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return tw`bg-green-50 text-green-800`;
      case 'error':
        return tw`bg-red-50 text-red-800`;
      case 'warning':
        return tw`bg-yellow-50 text-yellow-800`;
      case 'info':
        return tw`bg-blue-50 text-blue-800`;
      default:
        return tw`bg-gray-50 text-gray-800`;
    }
  }

  return (
    <View 
      style={[
        tw`px-4 py-3 rounded-lg mb-4`,
        getAlertStyle()
      ]}
    >
      <Text style={[
        tw`text-sm leading-5 text-center font-semibold`,
        getAlertStyle()
      ]}>
        {message}
      </Text>
    </View>
  )
}

export default PrimaryAlert

const styles = StyleSheet.create({})