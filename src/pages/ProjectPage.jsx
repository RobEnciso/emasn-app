import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getProjectById, getTasksForProject, getDocumentsForProject, getDocumentUrl, deleteProject, getPaymentsForProject, deleteTask, updateTask } from '../services/projectService.js';
import Layout from '../components/Layout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import AddTaskModal from '../components/AddTaskModal.jsx';
import UploadDocumentModal from '../components/UploadDocumentModal.jsx';
import CustomGantt from '../components/CustomGantt.jsx';
import DocumentViewerModal from '../components/DocumentViewerModal.jsx';
import DownloadLink from '../components/DownloadLink.jsx';
import AddPaymentModal from '../components/AddPaymentModal.jsx';
import ProjectSidebar from '../components/ProjectSidebar.jsx';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [viewingDocUrl, setViewingDocUrl] = useState(null);
  const [activeView, setActiveView] = useState('Cronograma');

  const userRole = user?.user_metadata?.role || 'client';

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        const [projectData, tasksData, documentsData, paymentsData] = await Promise.all([ getProjectById(id), getTasksForProject(id), getDocumentsForProject(id), getPaymentsForProject(id) ]);
        setProject(projectData);
        setTasks(tasksData);
        setDocuments(documentsData);
        setPayments(paymentsData);
      } catch (err) {
        // AÑADIDO: Muestra el error detallado en la consola
        console.error('Error loading project data:', err);
        setError('Failed to load project data.');
      } 
      finally { setLoading(false); }
    };
    if (id) loadProjectData();
  }, [id]);

  const handleTaskAdded = (newTask) => setTasks(currentTasks => [...currentTasks, newTask]);
  const handleDocumentUploaded = () => getDocumentsForProject(id).then(setDocuments);
  const handlePaymentAdded = (newPayment) => setPayments(currentPayments => [...currentPayments, newPayment]);
  
  const handleUpdateTask = (taskId, updatedFields) => {
  // --- 1. ACTUALIZACIÓN OPTIMISTA ---
  // Actualizamos el estado local de forma inmediata para que la UI reaccione al instante.
  setTasks(currentTasks =>
    currentTasks.map(task => {
      // Si esta es la tarea que cambió, creamos un nuevo objeto
      // copiando la tarea original y sobreescribiendo los campos actualizados.
      if (task.id === taskId) {
        return { ...task, ...updatedFields };
      }
      // Si no, devolvemos la tarea sin cambios.
      return task;
    })
  );

  // --- 2. PETICIÓN AL SERVIDOR ---
  // Enviamos el cambio a Supabase en segundo plano. No usamos "await"
  // porque no necesitamos esperar la respuesta para actualizar la UI.
  updateTask(taskId, updatedFields)
    .catch(error => {
      // Si algo sale mal con Supabase, mostramos un error.
      console.error("ERROR: La actualización falló en el servidor.", error);
      alert("No se pudo guardar el cambio. Por favor, refresca la página.");
      // Aquí se podría implementar una lógica para revertir el cambio en la UI si fuera necesario.
    });
};

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
        return true;
      } catch (error) {
        // AÑADIDO: Muestra el error detallado en la consola
        console.error('Error deleting task:', error);
        alert(`Falló la eliminación de la tarea: ${error.message}`);
        return false;
      }
    }
    return false;
  };

  const handleViewDocument = async (filePath) => {
    try {
      const url = await getDocumentUrl(filePath);
      setViewingDocUrl(url);
    } catch (error) {
      // AÑADIDO: Muestra el error detallado en la consola
      console.error('Error getting document URL:', error);
      alert('Could not get the document URL.');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProject(id);
        alert('Proyecto eliminado exitosamente.');
        navigate('/');
      } catch (error) {
        // AÑADIDO: Muestra el error detallado en la consola
        console.error('Error deleting project:', error);
        alert(`Falló la eliminación del proyecto. Razón: ${error.message}`);
      }
    }
  };

  if (loading) return <Layout><ActivityIndicator size="large" color="#FDB813" /></Layout>;
  if (error) return <Layout><Text style={styles.errorText}>{error}</Text></Layout>;

  const renderMainContent = () => {
    // ... el resto del código no necesita cambios ...
    switch (activeView) {
      case 'Cronograma':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Project Timeline</Text>
              {userRole === 'internal' && <Button title="Add Task" onPress={() => setIsTaskModalVisible(true)} />}
            </View>
            <CustomGantt 
              tasks={tasks} 
              project={project} 
              payments={payments}
              onTaskDelete={handleDeleteTask} 
              onTaskUpdate={handleUpdateTask} 
            />
          </View>
        );
      // ... otros casos del switch ...
      case 'Documentos':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Documents</Text>
              {userRole === 'internal' && <Button title="Upload File" variant="secondary" onPress={() => setIsUploadModalVisible(true)} />}
            </View>
            <Card>
              <FlatList
                data={documents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.docItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={{flexDirection: 'row', gap: 24}}>
                      <TouchableOpacity onPress={() => handleViewDocument(item.file_path)}><Text style={styles.itemLink}>View</Text></TouchableOpacity>
                      <DownloadLink file={item} style={styles.itemLink} />
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No documents yet.</Text>}
              />
            </Card>
          </View>
        );
      case 'Finanzas':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Finanzas</Text>
              {userRole === 'internal' && <Button title="Add Payment" variant="secondary" onPress={() => setIsPaymentModalVisible(true)} />}
            </View>
              <Card>
              <Text>Presupuesto Total: ${project?.total_budget?.toLocaleString('en-US')}</Text>
            </Card>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <AddTaskModal isVisible={isTaskModalVisible} onClose={() => setIsTaskModalVisible(false)} projectId={id} onTaskAdded={handleTaskAdded} />
      <UploadDocumentModal isVisible={isUploadModalVisible} onClose={() => setIsUploadModalVisible(false)} projectId={id} onDocumentUploaded={handleDocumentUploaded} />
      <DocumentViewerModal src={viewingDocUrl} onClose={() => setViewingDocUrl(null)} />
      <AddPaymentModal isVisible={isPaymentModalVisible} onClose={() => setIsPaymentModalVisible(false)} projectId={id} onPaymentAdded={handlePaymentAdded} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{project?.name}</Text>
          <Text style={styles.description}>{project?.description}</Text>
        </View>
        <View style={styles.headerDetails}>
          <Text style={styles.headerText}>Proyecto: {project?.name}</Text>
          <Text style={styles.headerText}>Fecha de Inicio: {project?.start_date}</Text>
          <Text style={styles.headerText}>Fecha de Entrega: {project?.end_date}</Text>
        </View>
      </View>

      <View style={styles.pageContainer}>
        <ProjectSidebar activeView={activeView} setActiveView={setActiveView} />
        <View style={styles.mainContent}>
          {renderMainContent()}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  // ... tus estilos no necesitan cambios ...
  header: { marginBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 32, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' },
  description: { fontSize: 16, fontFamily: 'Inter, sans-serif', color: '#616161', marginTop: 8 },
  headerDetails: { textAlign: 'right', color: '#616161' },
  headerText: { fontFamily: 'Inter, sans-serif', fontSize: 14, },
  pageContainer: { flexDirection: 'row', flex: 1, backgroundColor: '#FFFFFF', borderRadius: 8 },
  mainContent: { flex: 1, padding: 32 },
  contentSection: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' },
  docItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center' },
  itemName: { fontSize: 16, fontFamily: 'Inter, sans-serif' },
  itemLink: { fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#FDB813', fontWeight: 'bold', cursor: 'pointer' },
  emptyText: { textAlign: 'center', paddingVertical: 20, fontFamily: 'Inter, sans-serif', color: '#9E9E9E' },
  errorText: { color: 'red', textAlign: 'center' },
});

export default ProjectPage;