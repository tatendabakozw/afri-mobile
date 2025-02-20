import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import SettingsLayout from '@/layouts/SettingsLayout';
import tw from 'twrnc';
import PrimaryAlert from '@/components/alerts/primary-alert';
import NotificationsService from '@/api/services/notification/NotificationService';

interface NotificationSetting {
  category: string;
  active: boolean;
}

type NotificationSettingsKeyMap = {
  'email': 'emailSettings';
  'sms': 'smsSettings';
  'push': 'pushNotificationSettings';
  'whatsapp': 'whatsappSettings';
};

interface UpdateNotificationPayload {
  channel: string;
  categories: Array<{
    category: string;
    state: 'on' | 'off';
  }>;
}

type NotificationSettingType = 'email' | 'sms' | 'push' | 'whatsapp';

interface NotificationState {
  emailSettings: NotificationSetting[];
  smsSettings: NotificationSetting[];
  pushNotificationSettings: NotificationSetting[];
  whatsappSettings: NotificationSetting[];
  loading: boolean;
  error: string | null;
}

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

const NotificationItem = ({ 
  title, 
  description, 
  enabled, 
  onToggle,
  disabled = false
}: { 
  title: string; 
  description: string; 
  enabled: boolean; 
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <View style={tw`bg-white p-4 rounded-xl mb-4 shadow-sm`}>
    <View style={tw`flex-row justify-between items-center mb-2`}>
      <View style={tw`flex-1 mr-4`}>
        <Text style={tw`text-lg font-semibold text-gray-800 mb-1`}>{title}</Text>
        <Text style={tw`text-gray-500 text-sm`}>{description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: "#CBD5E1", true: "#29A1AF" }}
        ios_backgroundColor="#CBD5E1"
        disabled={disabled}
      />
    </View>
  </View>
);

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<NotificationSettingType>('email');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState<NotificationState>({
    emailSettings: [],
    smsSettings: [],
    pushNotificationSettings: [],
    whatsappSettings: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const notificationService = new NotificationsService();
      const [emailResponse, smsResponse, pushResponse, whatsappResponse] = await Promise.all([
        notificationService.fetchEmailSettings(),
        notificationService.fetchSmsSettings(),
        notificationService.fetchPushNotificationSettings(),
        notificationService.fetchWhatsappSettings()
      ]);

      setNotificationState({
        emailSettings: emailResponse.data || [],
        smsSettings: smsResponse.data || [],
        pushNotificationSettings: pushResponse.data || [],
        whatsappSettings: whatsappResponse.data || [],
        loading: false,
        error: null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notification settings';
      setError(errorMessage);
      setNotificationState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type: NotificationSettingType, index: number) => {
    const settingsKeyMap: NotificationSettingsKeyMap = {
      'email': 'emailSettings',
      'sms': 'smsSettings',
      'push': 'pushNotificationSettings',
      'whatsapp': 'whatsappSettings'
    };
  
    setNotificationState(prev => {
      const settingKey = settingsKeyMap[type];
      const settings = [...prev[settingKey]];
      settings[index] = { ...settings[index], active: !settings[index].active };
  
      return {
        ...prev,
        [settingKey]: settings
      };
    });
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setError(null);
    try {
      const notificationService = new NotificationsService();
      
      // Create an array of update promises
      const updatePromises = Object.entries({
        email: notificationState.emailSettings,
        sms: notificationState.smsSettings,
        push: notificationState.pushNotificationSettings,
        whatsapp: notificationState.whatsappSettings
      }).map(([channel, settings]) => {
        const payload: UpdateNotificationPayload = {
          channel,
          categories: settings.map(setting => ({
            category: setting.category,
            state: setting.active ? 'on' : 'off'
          }))
        };
        return notificationService.updateNotificationSettings(payload);
      });
  
      // Execute all updates in parallel
      await Promise.all(updatePromises);
      
      setError('Preferences saved successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save preferences';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderNotificationItems = (type: NotificationSettingType) => {
    const settingsKeyMap: NotificationSettingsKeyMap = {
      'email': 'emailSettings',
      'sms': 'smsSettings',
      'push': 'pushNotificationSettings',
      'whatsapp': 'whatsappSettings'
    };

    const settings = notificationState[settingsKeyMap[type]];
    const typeLabel = type === 'push' ? 'push notifications' : `${type} notifications`;

    return settings.map((setting, index) => (
      <NotificationItem
        key={`${type}-${index}`}
        title={setting.category}
        description={`Receive ${setting.category.toLowerCase()} notifications via ${type}`}
        enabled={setting.active}
        onToggle={() => handleToggle(type, index)}
        disabled={saving}
      />
    ));
  };

  return (
    <SettingsLayout title="Notifications">
      <View style={tw`flex-1 bg-gray-50`}>
        <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`bg-white`}>
          <View style={tw`flex-row border-b border-gray-200`}>
            <TabButton 
              title="Email" 
              isActive={activeTab === 'email'} 
              onPress={() => setActiveTab('email')} 
            />
            <TabButton 
              title="SMS" 
              isActive={activeTab === 'sms'} 
              onPress={() => setActiveTab('sms')} 
            />
            <TabButton 
              title="Push" 
              isActive={activeTab === 'push'} 
              onPress={() => setActiveTab('push')} 
            />
            <TabButton 
              title="WhatsApp" 
              isActive={activeTab === 'whatsapp'} 
              onPress={() => setActiveTab('whatsapp')} 
            />
          </View>
        </ScrollView>
        </View>

        {loading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#29A1AF" />
          </View>
        ) : (
          <ScrollView style={tw`flex-1 p-4`}>
            {error && (
              <View style={tw`mb-4`}>
                <PrimaryAlert type="error" message={error} />
              </View>
            )}
            
            {renderNotificationItems(activeTab)}

            <TouchableOpacity
              style={[
                tw`bg-[#29A1AF] p-4 rounded-xl mt-4`,
                saving && tw`opacity-50`
              ]}
              onPress={handleSavePreferences}
              disabled={saving}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                {saving ? 'Saving...' : 'Save Preferences'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SettingsLayout>
  );
};

export default Notifications;