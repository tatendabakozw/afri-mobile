import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from 'twrnc'
import AuthBG from "@/components/svgs/AuthBG";

interface EnrollmentLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

const EnrollmentLayout: React.FC<EnrollmentLayoutProps> = ({ children, loading = false }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-[#f5fbfc] w-full`}>
      {/* Set StatusBar style to dark */}
      <StatusBar style="dark" />

      {/* Background SVG */}
      <AuthBG style={StyleSheet.absoluteFill} width="100%" height="100%" />

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {loading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#32B3C2" />
          </View>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%"
  },
});

export default EnrollmentLayout;
