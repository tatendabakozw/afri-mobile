// components/alerts/ConfirmationAlert.tsx
import React, { useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

type ConfirmationAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons?: {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }[];
  onClose?: () => void;
};

const ConfirmationAlert = ({ 
    visible, 
    title, 
    message, 
    buttons = [], 
    onClose 
  }: ConfirmationAlertProps) => {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      if (visible) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 40
        }).start();
      }
    }, [visible]);
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={tw`flex-1 justify-center items-center px-6`}>
            <BlurView intensity={60} style={tw`absolute inset-0 bg-black/40`} />
            
            <Animated.View 
              style={[
                tw`w-full max-w-sm`,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={tw`bg-white rounded-3xl overflow-hidden shadow-2xl`}>
                {/* Content */}
                <View style={tw`px-6 pt-8 pb-6`}>
                  <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-3`}>
                    {title}
                  </Text>
                  <Text style={tw`text-gray-600 text-center text-base leading-6`}>
                    {message}
                  </Text>
                </View>
  
                {/* Buttons */}
                <View style={tw`border-t border-gray-100 flex-row`}>
                  {buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={button.onPress}
                      style={[
                        tw`flex-1 px-6 py-4 active:bg-gray-50`,
                        index < buttons.length - 1 && tw`border-r border-gray-100`
                      ]}
                    >
                      <Text 
                        style={[
                          tw`text-center font-semibold text-base`,
                          button.style === 'destructive' && tw`text-red-500`,
                          button.style === 'cancel' && tw`text-gray-500`,
                          button.style === 'default' && tw`text-[#32B3C2]`,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
export default ConfirmationAlert;