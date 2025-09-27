import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const { error } = await signIn({ email, password });
      if (error) {
        throw error;
      }
      navigate('/'); // Redirect to dashboard on successful login
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>EMASN</Text>
        <Text style={styles.subtitle}>Project Management Login</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9E9E9E"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9E9E9E"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={handleLogin}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#212121" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Using StyleSheet for better organization and performance with React Native Web
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // soft-gray
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 40,
    backgroundColor: '#FFFFFF', // light
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121', // primary
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#212121', // primary
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    marginBottom: 32,
  },
  errorText: {
    color: '#EF4444', // A standard red for errors
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter, sans-serif',
  },
  inputContainer: {
    marginBottom: 16,
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
  button: {
    backgroundColor: '#FDB813', // accent
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#212121', // primary
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
  },
});

export default LoginPage;
