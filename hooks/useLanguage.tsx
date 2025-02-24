import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  language: string;
  setAppLanguage: (lang: string) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app-language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAppLanguage = async (newLanguage: string) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('app-language', newLanguage);
      setLanguage(newLanguage);
      
      // Optional: Reload app to apply language changes
      // await Updates.reloadAsync();
    } catch (error) {
      console.error('Failed to set language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setAppLanguage,
        isLoading 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};