import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const DocumentViewerModal = ({ src, onClose }) => {
  // Si no hay 'src' (fuente de la imagen), no renderizamos nada.
  if (!src) {
    return null;
  }

  return (
    // El fondo oscuro semi-transparente. Al hacerle clic, se cierra.
    <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
      <View style={styles.container}>
        {/* Usamos <img> para poder añadirle el botón de descarga */}
        <img src={src} style={styles.image} alt="Document preview" />

        
      </View>
    </TouchableOpacity>
  );
};

// Usamos StyleSheet, pero algunos estilos son específicos de la web
const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    position: 'relative',
  },
  image: {
    maxWidth: '90vw',
    maxHeight: '80vh',
    borderRadius: 8,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#FDB813',
    color: '#212121',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    textDecoration: 'none',
    cursor: 'pointer',
  },
});

export default DocumentViewerModal;