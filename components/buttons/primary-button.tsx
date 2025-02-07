import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/constants/Colors'

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style = {},
  textStyle = {},
  disabled = false,
  loading = false,
  error = false,
}) => {
  const [isError, setIsError] = useState(error);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (error) {
      setIsError(true);
      triggerShake();
      const timer = setTimeout(() => setIsError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return (
    <Animated.View
      style={{
        transform: [{ translateX: shakeAnimation }],
        width: "100%"
      }}
    >
      <TouchableOpacity
        onPress={!disabled && !loading ? onPress : undefined}
        style={[
          styles.button,
          style,
          disabled && styles.disabledButton,
          isError && styles.errorButton,
        ]}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.light.background} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.tint, // Primary button color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.light.tabIconDefault, // Disabled state color
    opacity: 0.6,
  },
  errorButton: {
    backgroundColor: '#EF4444', // Error state color
  },
  text: {
    color: Colors.light.background, // Button text color
    fontSize: 16,
    fontWeight: '600',
  },
});
