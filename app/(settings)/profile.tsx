import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import SettingsLayout from '@/layouts/SettingsLayout';
import tw from 'twrnc';

interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  country: string;
  gender: string;
}

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`mb-6`}>
    <Text style={tw`text-sm text-gray-500 mb-1`}>{label}</Text>
    <View style={tw`p-4 bg-gray-50 rounded-lg`}>
      <Text style={tw`text-base text-gray-800`}>{value || 'Not provided'}</Text>
    </View>
  </View>
);

const Profile = () => {
  const [profile, setProfile] = useState<ProfileInfo>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-01-01',
    country: 'South Africa',
    gender: 'Male'
  });

  // TODO: Fetch actual profile data from API
  useEffect(() => {
    // Add API call here to fetch profile data
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SettingsLayout title="Profile">
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
      >
        <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>
            Personal Information
          </Text>

          <ProfileField 
            label="First Name" 
            value={profile.firstName} 
          />
          
          <ProfileField 
            label="Last Name" 
            value={profile.lastName} 
          />

          <ProfileField 
            label="Email" 
            value={profile.email} 
          />

          <ProfileField 
            label="Date of Birth" 
            value={formatDate(profile.dateOfBirth)} 
          />

          <ProfileField 
            label="Gender" 
            value={profile.gender} 
          />

          <ProfileField 
            label="Country" 
            value={profile.country} 
          />
        </View>
      </ScrollView>
    </SettingsLayout>
  );
};

export default Profile;