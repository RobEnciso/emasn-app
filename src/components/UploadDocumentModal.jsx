import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Button from './Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { uploadDocument, addDocumentRecord } from '../services/projectService.js';


const UploadDocumentModal = ({ isVisible, onClose, onDocumentUploaded, projectId }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
  if (!file) {
    setError('Please select a file to upload.');
    return;
  }
  try {
    setError('');
    setLoading(true);

    // 1. Subir el archivo al Almacenamiento
    const filePath = await uploadDocument(file, projectId);

    // 2. Preparar el registro para la base de datos
    const documentData = {
      project_id: projectId,
      name: file.name,
      file_path: filePath,
      uploaded_by: user.id,
    };

    // 3. Guardar el registro en la tabla 'documents'
    await addDocumentRecord(documentData);

    onDocumentUploaded(); // Avisar a la página que se subió un documento
    onClose(); // Cerrar el modal si todo fue exitoso

  } catch (err) {
    setError('Failed to upload document.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Upload Document</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View>
            <Text style={styles.label}>Select File</Text>
            <input
              type="file"
              onChange={handleFileChange}
              style={styles.inputStyle}
            />
            {file && <Text style={styles.fileNameText}>Selected: {file.name}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} variant="secondary" />
            <Button
              title="Upload"
              onPress={handleSubmit}
              loading={loading}
              disabled={!file || loading}
              style={{ marginLeft: 16 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 24,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Montserrat, sans-serif',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        color: '#212121',
        marginBottom: 8,
    },
    inputStyle: {
        fontSize: '1rem',
        padding: '8px',
        fontFamily: 'Inter, sans-serif',
    },
    fileNameText: {
        marginTop: 16,
        fontFamily: 'Inter, sans-serif',
        color: '#616161',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
});

export default UploadDocumentModal;