import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator, Alert } from 'react-native';
import SettingsLayout from '@/layouts/SettingsLayout';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccountService from '@/api/services/account/AccountService';

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const accountService = new AccountService();

  const handlePasswordUpdate = async () => {
    if (!validatePasswords()) return;
    setLoading(true);
    try {
      await accountService.changePassword({
        currentPassword,
        password: newPassword,
        retypePassword: confirmNewPassword,
      });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      await AsyncStorage.removeItem('requiresPasswordChange');
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    setLoading(true);
    try {
      // await accountService.deleteAccount();
      setSuccess('Account deleted successfully');
      // Perform logout and navigate to account deleted screen
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = () => {
    let tempErrors: any = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!currentPassword) {
      tempErrors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (!passwordRegex.test(newPassword)) {
      tempErrors.newPassword = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
    } else if (newPassword !== confirmNewPassword) {
      tempErrors.confirmNewPassword = 'Passwords do not match';
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
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
      <View style={tw`p-4`}>
        {error && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}
        {success && <Text style={tw`text-green-500 mb-4`}>{success}</Text>}

        <Text style={tw`text-lg font-semibold mb-4`}>Password Management</Text>
        <TextInput
          style={tw`border p-2 mb-4`}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={tw`border p-2 mb-4`}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={tw`border p-2 mb-4`}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <Button title="Update Password" onPress={handlePasswordUpdate} />

        <Text style={tw`text-lg font-semibold mt-8 mb-4`}>Account Deletion</Text>
        <View style={tw`flex-row items-center mb-4`}>
          <Text style={tw`mr-2`}>Confirm Account Deletion</Text>
          <Button title={isDeleteConfirmed ? "Yes" : "No"} onPress={() => setIsDeleteConfirmed(!isDeleteConfirmed)} />
        </View>
        <Button title="Delete Account" onPress={handleAccountDeletion} disabled={!isDeleteConfirmed} />
      </View>
    </SettingsLayout>
  );
};

export default Security;

const styles = StyleSheet.create({});