import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react'
import tw from 'twrnc'

const SurveyLoading = () => {
  return (
    <>
    {[1, 2, 3].map((item) => (
      <View 
        key={item}
        style={tw`flex-row items-center p-3 rounded-xl w-full bg-gray-100 mb-2`}
      >
        <View style={tw`flex-1`}>
          <View style={tw`h-5 w-16 bg-gray-200 rounded-md`} />
        </View>
        <View style={tw`flex-1 items-center`}>
          <View style={tw`h-5 w-20 bg-gray-200 rounded-md`} />
        </View>
        <View style={tw`flex-1 items-end`}>
          <View style={tw`h-6 w-6 bg-gray-200 rounded-full`} />
        </View>
      </View>
    ))}
  </>
  )
}

export default SurveyLoading

const styles = StyleSheet.create({})