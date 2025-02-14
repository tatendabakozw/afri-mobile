import React, { useState, useEffect } from 'react';
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

interface Option {
  label: string;
  value: string;
}

interface PrimaryDropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const PrimaryDropdown: React.FC<PrimaryDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  label,
  searchable = false,
  searchPlaceholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    if (searchable) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, options]);

  const toggleDropdown = () => {
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setIsOpen(false);
        setSearchQuery('');
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

  const renderItem = ({ item }: { item: Option }) => (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-100 active:bg-gray-50`}
      onPress={() => {
        onChange(item.value);
        toggleDropdown();
      }}
    >
      <Text style={tw`text-gray-800 ${value === item.value ? 'font-medium' : ''}`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={tw`text-gray-800`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
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

      {/* Search */}
      {searchable && (
        <View style={tw`px-6 py-3 border-b border-gray-100`}>
          <View style={tw`flex-row items-center bg-gray-50 rounded-xl px-4`}>
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholder}
              style={tw`flex-1 h-11 ml-3 text-base text-gray-800`}
              placeholderTextColor="#94A3B8"
            />
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={tw`p-1`}
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}

      {/* Options List */}
      <FlatList
        data={searchable ? filteredOptions : options}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`px-6 py-4 flex-row items-center justify-between active:bg-gray-50
              ${item.value === value ? 'bg-gray-50' : ''}`}
            onPress={() => {
              onChange(item.value);
              toggleDropdown();
            }}
          >
            <Text style={tw`text-base ${item.value === value ? 'text-[#32B3C2] font-medium' : 'text-gray-800'}`}>
              {item.label}
            </Text>
            {item.value === value && (
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

export default PrimaryDropdown;