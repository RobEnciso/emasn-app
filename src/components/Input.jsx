import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const Input = ({ label, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholderTextColor="#9E9E9E"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    color: '#212121', // primary
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#FFFFFF',
  },
});

export default Input;
