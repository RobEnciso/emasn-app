import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.navContainer}>
      <Link to="/" style={styles.logoLink}>
        <Text style={styles.logoText}>EMASN</Text>
      </Link>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoLink: {
  textDecorationLine: 'none',
},
  logoText: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    color: '#616161',
    marginRight: 24,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoutButtonText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
});

export default Navbar;