import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './Navbar.jsx';

const Layout = ({ children }) => {
  return (
    <View style={styles.fullPage}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullPage: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 48,
    width: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 1200, 
  },
});

export default Layout;