import GeneralNavbar from "@/components/navigation/general-navbar";
import React from "react";
import { View } from "react-native";
import tw from 'twrnc'

interface GeneralLayoutProps {
  children: React.ReactNode;
}

const GeneralLayout: React.FC<GeneralLayoutProps> = ({ children }) => {
  return (
    <View style={tw`flex-1 bg-[#f5fbfc]`}>
      <GeneralNavbar />
      {children}
    </View>
  );
};

export default GeneralLayout;