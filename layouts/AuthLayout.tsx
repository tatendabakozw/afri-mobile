import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from 'twrnc'
import LanguageDropdown from "@/components/dropdowns/language-dropdown";
import AuthBG from "@/components/svgs/AuthBG";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-[#f5fbfc] w-full`}>
      {/* Set StatusBar style to dark */}
      <StatusBar style="dark" />

      {/* TODO: add a language dropdown alighned on the right, with arabic, english, french and dutch */}
      <LanguageDropdown />

      {/* Background SVG */}
      <AuthBG style={StyleSheet.absoluteFill} width="100%" height="100%" />

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {children}
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

export default AuthLayout;
