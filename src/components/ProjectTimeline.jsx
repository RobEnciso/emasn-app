import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const categoryColors = {
  'Preliminares': '#FDB813',
  'Obra Negra': '#42A5F5',
  'Instalaciones': '#2962FF',
  'Acabados': '#EC407A',
  'Equipamiento y Herrería': '#AB47BC',
  'Limpieza y Entrega': '#EF5350',
};

// Función auxiliar para parsear fechas
const parseDate = (dateString) => new Date(dateString + 'T00:00:00');

const ProjectTimeline = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <Text style={styles.emptyText}>No tasks with dates to display.</Text>;
  }

  const validTasks = tasks.filter(t => t.start_date && t.due_date);
  if (validTasks.length === 0) {
    return <Text style={styles.emptyText}>No tasks with valid dates.</Text>;
  }

  // 1. Calcular el rango total del proyecto en días
  const allDates = validTasks.flatMap(t => [parseDate(t.start_date), parseDate(t.due_date)]);
  const projectStartDate = new Date(Math.min(...allDates));
  const projectEndDate = new Date(Math.max(...allDates));
  const totalDurationDays = (projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24) + 1;

  return (
    <View style={styles.timelineContainer}>
      {validTasks.map(task => {
        const taskStart = parseDate(task.start_date);
        const taskEnd = parseDate(task.due_date);

        // 2. Calcular la duración y el inicio de cada tarea en días
        const offsetDays = (taskStart - projectStartDate) / (1000 * 60 * 60 * 24);
        const durationDays = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1;

        // 3. Convertir a porcentajes para el estilo CSS
        const leftPercentage = (offsetDays / totalDurationDays) * 100;
        const widthPercentage = (durationDays / totalDurationDays) * 100;

        return (
          <View key={task.id} style={styles.taskRow}>
            <Text style={styles.taskName}>{`${task.category}: ${task.name}`}</Text>
            <View style={styles.barBackground}>
              <View style={[
                styles.taskBar,
                {
                  left: `${leftPercentage}%`,
                  width: `${widthPercentage}%`,
                  backgroundColor: categoryColors[task.category] || '#9E9E9E',
                }
              ]}>
                <Text style={styles.barText}>{task.name}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: { padding: 10 },
  taskRow: { marginBottom: 16 },
  taskName: { fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#616161', marginBottom: 4 },
  barBackground: {
    width: '100%',
    height: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    position: 'relative', // Contenedor para la barra de tarea
  },
  taskBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    paddingLeft: 8,
    minWidth: '5%', // Ancho mínimo para tareas cortas
  },
  barText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  emptyText: { textAlign: 'center', paddingVertical: 20, fontFamily: 'Inter, sans-serif', color: '#9E9E9E' },
});

export default ProjectTimeline;