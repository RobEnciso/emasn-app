import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjectById, getTasksForProject, getDocumentsForProject } from '../services/projectService';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const ProjectPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userRole = user?.user_metadata?.role || 'client';

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [projectData, tasksData, documentsData] = await Promise.all([
          getProjectById(id),
          getTasksForProject(id),
          getDocumentsForProject(id),
        ]);
        setProject(projectData);
        setTasks(tasksData);
        setDocuments(documentsData);
      } catch (err) {
        setError('Failed to load project data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProjectData();
    }
  }, [id]);

  if (loading) {
    return <Layout><ActivityIndicator size="large" color="#FDB813" /></Layout>;
  }

  if (error) {
    return <Layout><Text style={styles.errorText}>{error}</Text></Layout>;
  }

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.title}>{project?.name}</Text>
        <Text style={styles.description}>{project?.description}</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            {userRole === 'internal' && <Button title="Add Task" variant="secondary" />}
          </View>
          <Card>
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStatus}>{item.status}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet.</Text>}
            />
          </Card>
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Documents</Text>
            {userRole === 'internal' && <Button title="Upload File" variant="secondary" />}
          </View>
          <Card>
            <FlatList
              data={documents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.docItem}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {/* In a real app, this would be a download link */}
                  <Text style={styles.itemLink}>View</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No documents yet.</Text>}
            />
          </Card>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#212121' },
  description: { fontSize: 16, fontFamily: 'Inter, sans-serif', color: '#616161', marginTop: 8 },
  contentContainer: { flexDirection: 'row', gap: 24 },
  section: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#212121' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  docItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  itemName: { fontSize: 16, fontFamily: 'Inter, sans-serif' },
  itemStatus: { fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#FDB813', fontWeight: 'bold' },
  itemLink: { fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#FDB813', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', paddingVertical: 20, fontFamily: 'Inter, sans-serif', color: '#9E9E9E' },
  errorText: { color: 'red', textAlign: 'center' },
});

export default ProjectPage;
