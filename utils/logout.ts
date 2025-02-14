// utils/logout.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const handleLogout = async () => {
  try {
    // Clear all authentication tokens
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('jwt');
    
    // Clear any other user-related data
    await AsyncStorage.clear();
    
    // Navigate to login screen
    router.replace('/(auth)');
  } catch (error) {
    console.error('Error during logout:', error);
    // Ensure navigation to login even if clearing storage fails
    router.replace('/(auth)');
  }
};