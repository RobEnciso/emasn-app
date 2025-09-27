import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProjectSidebar = ({ activeView, setActiveView }) => {
  const menuItems = ['Cronograma', 'Documentos', 'Finanzas'];

  return (
    <View style={styles.sidebarContainer}>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.menuItem,
            activeView === item && styles.activeMenuItem
          ]}
          onPress={() => setActiveView(item)}
        >
          <Text style={[
            styles.menuText,
            activeView === item && styles.activeMenuText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 200,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  activeMenuItem: {
    backgroundColor: '#FDB81320', // Amarillo transparente
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
    color: '#212121',
  },
  activeMenuText: {
    fontWeight: 'bold',
  },
});

export default ProjectSidebar;