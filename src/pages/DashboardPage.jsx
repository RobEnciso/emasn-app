import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjects } from '../services/projectService';
import Layout from '../components/Layout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // The user's role can be stored in metadata when they are created
  const userRole = user?.user_metadata?.role || 'client';

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const renderProjectCard = ({ item }) => (
    <Link to={`/project/${item.id}`} style={{ textDecoration: 'none' }}>
      <Card style={styles.projectCard}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </Card>
    </Link>
  );

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <View style={styles.headerActions}>
          {userRole === 'internal' && (
            <Button
              title="New Project"
              onPress={() => navigate('/projects/new')}
            />
          )}
          
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#FDB813" />}
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={projects}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No projects found.</Text>
            </View>
          )}
        />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Montserrat, sans-serif',
    color: '#212121',
  },
  grid: {
    paddingVertical: 8,
  },
  projectCard: {
    flex: 1,
    margin: 8,
    minWidth: 300,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Montserrat, sans-serif',
    color: '#212121',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    color: '#616161',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter, sans-serif',
    color: '#616161',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default DashboardPage;
