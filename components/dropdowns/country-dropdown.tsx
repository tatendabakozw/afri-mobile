import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { countryOptions } from '@/utils/countryOptions';

type Props = {
  onSelect?: (country: { value: string; phoneCode: number }) => void;
  initialCountry?: string;
  label?: string;
  error?: string;
  placeholder?: string;
};

const CountryDropdown = ({ 
  onSelect, 
  initialCountry = 'KE',
  label,
  error,
  placeholder = 'Select Country'
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [selectedCountry, setSelectedCountry] = useState(
    countryOptions.find(country => country.value === initialCountry) || countryOptions[0]
  );

  const toggleDropdown = () => {
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    } else {
      setIsOpen(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSelectCountry = (country: typeof countryOptions[0]) => {
    setSelectedCountry(country);
    onSelect?.({ value: country.value, phoneCode: country.phoneCode });
    toggleDropdown();
  };

  return (
    <View style={tw`mb-4`}>
      {label && (
        <Text style={tw`text-gray-700 text-sm font-medium mb-2`}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={toggleDropdown}
        style={[
          tw`h-12 px-4 bg-white rounded-xl border flex-row items-center justify-between`,
          error ? tw`border-red-500` : tw`border-gray-200`,
        ]}
      >
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-lg mr-2`}>
            {selectedCountry.label.split(' ')[0]}
          </Text>
          <Text style={tw`text-gray-800`}>
            {selectedCountry.label.split(' ').slice(1).join(' ')}
          </Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {error && (
        <Text style={tw`mt-1 text-red-500 text-sm`}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={toggleDropdown}
      >
        <TouchableOpacity
          style={tw`flex-1 bg-black/40`}
          activeOpacity={1}
          onPress={toggleDropdown}
        >
          <Animated.View
            style={[
              tw`bg-white rounded-t-3xl absolute bottom-0 left-0 right-0 shadow-2xl`,
              {
                transform: [{
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                }],
              },
            ]}
          >
            {/* Header */}
            <View style={tw`px-6 py-5 border-b border-gray-100 flex-row justify-between items-center`}>
              <Text style={tw`text-xl font-semibold text-gray-800`}>
                {placeholder}
              </Text>
              <TouchableOpacity 
                onPress={toggleDropdown}
                style={tw`w-8 h-8 rounded-full bg-gray-100 items-center justify-center`}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <FlatList
              data={countryOptions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`px-6 py-4 flex-row items-center justify-between active:bg-gray-50
                    ${item.value === selectedCountry.value ? 'bg-gray-50' : ''}`}
                  onPress={() => handleSelectCountry(item)}
                >
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-lg mr-2`}>
                      {item.label.split(' ')[0]}
                    </Text>
                    <Text style={tw`text-base ${
                      item.value === selectedCountry.value ? 'text-[#32B3C2] font-medium' : 'text-gray-800'
                    }`}>
                      {item.label.split(' ').slice(1).join(' ')}
                    </Text>
                  </View>
                  {item.value === selectedCountry.value && (
                    <Ionicons name="checkmark" size={20} color="#32B3C2" />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={item => item.value}
              style={tw`max-h-80`}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CountryDropdown;