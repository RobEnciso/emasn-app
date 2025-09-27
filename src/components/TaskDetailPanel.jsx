import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const STATUS_OPTIONS = ['To Do', 'En Progreso', 'Completada'];

//                 <-- 1. AÑADE onUpdate AQUÍ
const TaskDetailPanel = ({ task, onClose, onDelete, onUpdate }) => { 
  if (!task) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.panelContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text> 
        </TouchableOpacity>

        <Text style={styles.title}>{task.name}</Text>

        {/* <-- 2. REEMPLAZA la antigua sección de estado por esta nueva --> */}
        <View style={styles.section}>
            <Text style={styles.label}>ESTADO</Text>
            <View style={styles.statusContainer}>
            {STATUS_OPTIONS.map(status => (
                <TouchableOpacity
                    key={status}
                    style={[
                        styles.statusButton,
                        (task.status || 'To Do') === status && styles.statusButtonActive
                    ]}
                    onPress={() => onUpdate(task.id, { status: status })}
                >
                    <Text style={[
                        styles.statusButtonText,
                        (task.status || 'To Do') === status && styles.statusButtonTextActive
                    ]}>
                        {status}
                    </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>
        {/* <-- Fin de la sección reemplazada --> */}

        <View style={styles.section}>
          <Text style={styles.label}>CATEGORÍA</Text>
          <Text style={styles.value}>{task.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>FECHAS</Text>
          <Text style={styles.value}>{task.start_date} → {task.due_date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPCIÓN</Text>
          <Text style={styles.value}>{task.description || 'Sin descripción.'}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => onDelete(task.id)}
          >
            <Text style={styles.buttonText}>Eliminar Tarea</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 400,
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    boxShadow: '-5px 0px 15px rgba(0,0,0,0.1)',
    display: 'flex', // Usamos flexbox para el layout
    flexDirection: 'column', // Los elementos se apilan verticalmente
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8, 
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 26,
    color: '#888888',
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Montserrat, sans-serif',
    marginBottom: 24,
    marginRight: 32, // Espacio para que no choque con el botón de cerrar
  },
  section: {
    marginBottom: 20, // Aumentamos un poco el espacio
  },
  label: {
    fontSize: 12,
    color: '#616161',
    fontFamily: 'Inter, sans-serif',
    marginBottom: 8, // Aumentamos un poco el espacio
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
  },
  actionsContainer: {
    marginTop: 'auto', // Esto empuja el botón de eliminar hasta el final
    paddingTop: 24, // Espacio antes del botón
    borderTopWidth: 1, // Una línea sutil para separar
    borderTopColor: '#f0f0f0',
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EF5350',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  statusButtonActive: {
    backgroundColor: '#FDB813',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  statusButtonTextActive: {
    color: '#FFF',
  },
});

export default TaskDetailPanel;