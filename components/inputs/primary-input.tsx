import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';

interface PrimaryInputProps extends TextInputProps {
  label?: string; // Optional label for the input
  errorMessage?: string; // Optional error message
}

const PrimaryInput: React.FC<PrimaryInputProps> = ({
  label,
  errorMessage,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          style,
          errorMessage ? styles.inputError : null,
          isFocused ? styles.inputFocused : null,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width:'auto'
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#32B3C2', // Border color when focused
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    fontSize: 12,
    color: 'red',
    textAlign:'right',
  },
});

export default PrimaryInput;
