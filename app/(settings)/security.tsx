import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Switch } from 'react-native';
import SettingsLayout from '@/layouts/SettingsLayout';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccountService from '@/api/services/account/AccountService';
import PrimaryAlert from '@/components/alerts/primary-alert';
import { useRouter } from 'expo-router';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertInfo {
  message: string;
  type: AlertType;
}

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
    {children}
  </View>
);

const SectionTitle = ({ title, description }: { title: string; description?: string }) => (
  <View style={tw`mb-6`}>
    <Text style={tw`text-xl font-semibold text-gray-800 mb-2`}>{title}</Text>
    {description && <Text style={tw`text-gray-500 text-sm`}>{description}</Text>}
  </View>
);

const TabButton = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      tw`px-6 py-4 flex-1`,
      isActive && tw`border-b-2 border-[#29A1AF]`
    ]}
  >
    <Text style={[
      tw`text-center text-sm`,
      isActive ? tw`text-[#29A1AF] font-semibold` : tw`text-gray-500`
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled 
}: { 
  title: string; 
  onPress: () => void; 
  variant?: 'primary' | 'danger'; 
  disabled?: boolean 
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      tw`p-4 rounded-xl`,
      variant === 'primary' ? tw`bg-[#29A1AF]` : tw`bg-red-500`,
      disabled && tw`opacity-50`
    ]}
  >
    <Text style={tw`text-white text-center font-medium`}>{title}</Text>
  </TouchableOpacity>
);

const CustomInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry 
}: { 
  placeholder: string; 
  value: string; 
  onChangeText: (text: string) => void; 
  secureTextEntry?: boolean 
}) => (
  <TextInput
    style={tw`bg-gray-50 p-4 rounded-xl text-gray-700 mb-4`}
    placeholder={placeholder}
    placeholderTextColor="#94A3B8"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);

const Security = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('2fa');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({ message: '', type: 'info' });
  const accountService = new AccountService();

  const checkRequiredPasswordChange = async () => {
    const requiresPasswordChange = await AsyncStorage.getItem('requiresPasswordChange');
    if (requiresPasswordChange === 'true') {
      setActiveTab('pm');
      setAlertInfo({
        message: 'Password change is required',
        type: 'warning'
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswords()) return;
    setLoading(true);
    try {
      await accountService.changePassword({
        currentPassword,
        password: newPassword,
        retypePassword: confirmNewPassword,
      });
      setAlertInfo({
        message: 'Password updated successfully',
        type: 'success'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      await AsyncStorage.removeItem('requiresPasswordChange');
    } catch (error: any) {
      setAlertInfo({
        message: error.message || 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      if (isTwoFactorEnabled) {
        await accountService.disableTwoFactorAuth();
      } else {
        await accountService.enableTwoFactorAuth();
      }
      setIsTwoFactorEnabled(!isTwoFactorEnabled);
      setAlertInfo({
        message: `Two-factor authentication ${isTwoFactorEnabled ? 'disabled' : 'enabled'} successfully`,
        type: 'success'
      });
    } catch (error: any) {
      setAlertInfo({
        message: error.message || 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    setLoading(true);
    try {
      // await accountService.deleteAccount();
      setAlertInfo({
        message: 'Account deleted successfully',
        type: 'success'
      });
      // Clear all storage and navigate to login
      await AsyncStorage.clear();
      router.replace('/(auth)');
    } catch (error: any) {
      setAlertInfo({
        message: error.message || 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!currentPassword) {
      setAlertInfo({
        message: 'Current password is required',
        type: 'error'
      });
      return false;
    }
    if (!newPassword) {
      setAlertInfo({
        message: 'New password is required',
        type: 'error'
      });
      return false;
    }
    if (!passwordRegex.test(newPassword)) {
      setAlertInfo({
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
        type: 'error'
      });
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setAlertInfo({
        message: 'Passwords do not match',
        type: 'error'
      });
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <SettingsLayout title="Security">
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#29A1AF" />
        </View>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Security">
      <View style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex-row border-b border-gray-200 bg-white`}>
          <TabButton 
            title="2FA" 
            isActive={activeTab === '2fa'} 
            onPress={() => setActiveTab('2fa')} 
          />
          <TabButton 
            title="Password" 
            isActive={activeTab === 'pm'} 
            onPress={() => setActiveTab('pm')} 
          />
          <TabButton 
            title="Account" 
            isActive={activeTab === 'da'} 
            onPress={() => setActiveTab('da')} 
          />
        </View>

        <ScrollView style={tw`flex-1`}>
          <View style={tw`p-4`}>
            {alertInfo.message && (
              <View style={tw`mb-6`}>
                <PrimaryAlert type={alertInfo.type} message={alertInfo.message} />
              </View>
            )}

            {activeTab === '2fa' && (
              <SectionCard>
                <SectionTitle 
                  title="Two-Factor Authentication" 
                  description="Add an extra layer of security to your account by enabling two-factor authentication."
                />
                <View style={tw`flex-row justify-between items-center bg-gray-50 p-4 rounded-xl`}>
                  <Text style={tw`text-gray-700 font-medium`}>Enable 2FA</Text>
                  <Switch
                    value={isTwoFactorEnabled}
                    onValueChange={handleToggle2FA}
                    trackColor={{ false: "#CBD5E1", true: "#29A1AF" }}
                    ios_backgroundColor="#CBD5E1"
                  />
                </View>
              </SectionCard>
            )}

            {activeTab === 'pm' && (
              <SectionCard>
                <SectionTitle 
                  title="Password Management" 
                  description="Ensure your account stays secure by using a strong password."
                />
                <CustomInput
                  placeholder="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                />
                <CustomInput
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <CustomInput
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry
                />
                <CustomButton
                  title="Update Password"
                  onPress={handlePasswordUpdate}
                />
              </SectionCard>
            )}

            {activeTab === 'da' && (
              <SectionCard>
                <SectionTitle 
                  title="Delete Account" 
                  description="Warning: This action cannot be undone. All your data will be permanently deleted."
                />
                <View style={tw`flex-row items-center bg-gray-50 p-4 rounded-xl mb-6`}>
                  <Switch
                    value={isDeleteConfirmed}
                    onValueChange={setIsDeleteConfirmed}
                    trackColor={{ false: "#CBD5E1", true: "#EF4444" }}
                    ios_backgroundColor="#CBD5E1"
                  />
                  <Text style={tw`ml-3 text-gray-700`}>
                    I understand this action is irreversible
                  </Text>
                </View>
                <CustomButton
                  title="Delete Account"
                  onPress={handleAccountDeletion}
                  variant="danger"
                  disabled={!isDeleteConfirmed}
                />
              </SectionCard>
            )}
          </View>
        </ScrollView>
      </View>
    </SettingsLayout>
  );
};

export default Security;