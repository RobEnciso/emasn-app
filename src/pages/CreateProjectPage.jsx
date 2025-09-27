import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/userService.js';
import { createProject } from '../services/projectService.js';
import Layout from '../components/Layout.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

const CreateProjectPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    start_date: '',
    end_date: '',
    total_budget: '', // <-- Campo nuevo en el estado
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const users = await getUsers();
        setClients(users);
      } catch (err) { setError('Failed to fetch clients.'); }
    };
    fetchClients();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.client_id || !formData.start_date) {
      setError('Project name, client, and start date are required.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const projectData = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        total_budget: formData.total_budget || 0, // Enviar 0 si está vacío
      };
      const [newProject] = await createProject(projectData);
      navigate(`/project/${newProject.id}`);
    } catch (err) {
      setError('Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Create New Project</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Input
          label="Project Name"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
        />
        <Input
          label="Description"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          multiline
        />

        {/* --- INICIO DE LA MODIFICACIÓN --- */}
        <Input
          label="Total Budget ($)"
          value={formData.total_budget}
          onChangeText={(value) => handleChange('total_budget', value)}
          placeholder="e.g., 84180.00"
          keyboardType="numeric"
        />
        {/* --- FIN DE LA MODIFICACIÓN --- */}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assign Client</Text>
          <select value={formData.client_id} onChange={(e) => handleChange('client_id', e.target.value)} style={styles.select}>
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.email}</option>
            ))}
          </select>
        </View>

        <View style={styles.dateContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Start Date</Text>
            <input type="date" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} style={styles.select} />
          </View>
          <View style={{ width: 24 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Date</Text>
            <input type="date" value={formData.end_date} onChange={(e) => handleChange('end_date', e.target.value)} style={styles.select}/>
          </View>
        </View>

        <Button title="Create Project" onPress={handleSubmit} loading={loading} />
      </View>
    </Layout>
  );
};

// La sección de estilos no necesita cambios
const styles = StyleSheet.create({
  container: { maxWidth: 800, width: '100%', alignSelf: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#212121', marginBottom: 24, },
  errorText: { color: 'red', marginBottom: 16, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#212121', marginBottom: 8 },
  select: { height: 50, width: '100%', borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 4, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Inter, sans-serif', backgroundColor: '#FFFFFF', appearance: 'none', marginBottom: 16 },
  dateContainer: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default CreateProjectPage;