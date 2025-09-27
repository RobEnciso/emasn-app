import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, disabled, loading, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#212121' : '#FDB813'} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: '#FDB813', // accent
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FDB813', // accent
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
  },
  text_primary: {
    color: '#212121', // primary
  },
  text_secondary: {
    color: '#FDB813', // accent
  },
});

export default Button;
