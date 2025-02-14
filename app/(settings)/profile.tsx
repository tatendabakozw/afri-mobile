import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import SettingsLayout from '@/layouts/SettingsLayout';
import ProfileService from '@/api/services/profile/ProfileService';
import PrimaryAlert from '@/components/alerts/primary-alert';
import tw from 'twrnc';

interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  country: string;
  gender: string;
  phoneNumber: string;
  city: string;
  address: string;
  languages: string[];
  payoutAccounts: Array<{
    bankName: string;
    accountNumber: string;
  }>;
}

const ProfileField = ({ label, value, verified }: { label: string; value: string; verified?: boolean }) => (
  <View style={tw`mb-6`}>
    <Text style={tw`text-sm text-gray-500 mb-1`}>{label}</Text>
    <View style={tw`p-4 bg-gray-50 rounded-lg`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-base text-gray-800`}>{value || 'Not provided'}</Text>
        {verified && (
          <Text style={tw`text-xs text-[#29A1AF]`}>(Verified)</Text>
        )}
      </View>
    </View>
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={tw`text-lg font-semibold text-gray-700 mb-4 mt-6`}>{title}</Text>
);

const Profile = () => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const profileService = new ProfileService();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await profileService.getUserProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    const age = new Date().getFullYear() - date.getFullYear();
    return `${date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })} (${age} years)`;
  };

  const displayAccount = (accounts: any[]) => {
    if (!accounts || accounts.length === 0) return 'Not provided';
    const account = accounts[0];
    const lastFour = account.accountNumber.slice(-4);
    return `${account.bankName} - ****${lastFour}`;
  };

  if (isLoading) {
    return (
      <SettingsLayout title="Profile">
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#29A1AF" />
        </View>
      </SettingsLayout>
    );
  }

  if (error) {
    return (
      <SettingsLayout title="Profile">
        <View style={tw`flex-1 p-4`}>
          <PrimaryAlert type="error" message={error} />
        </View>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Profile">
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
        <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>Personal Information</Text>

          <ProfileField label="First Name" value={profile?.firstName || ''} />
          <ProfileField label="Last Name" value={profile?.lastName || ''} />
          <ProfileField label="Email" value={profile?.email || ''} verified />
          <ProfileField label="Date of Birth" value={formatDate(profile?.dateOfBirth || '')} />
          <ProfileField label="Gender" value={profile?.gender || ''} />

          <SectionTitle title="Contact Information" />
          <ProfileField label="Phone" value={profile?.phoneNumber || ''} verified />
          <ProfileField label="Email" value={profile?.email || ''} />

          <SectionTitle title="Location Information" />
          <ProfileField label="Country" value={profile?.country || ''} />
          <ProfileField label="City" value={profile?.city || ''} />
          <ProfileField label="Address" value={profile?.address || ''} />

          <SectionTitle title="Payment Information" />
          <ProfileField 
            label="Connected Account" 
            value={displayAccount(profile?.payoutAccounts || [])} 
          />
        </View>
      </ScrollView>
    </SettingsLayout>
  );
};

export default Profile;