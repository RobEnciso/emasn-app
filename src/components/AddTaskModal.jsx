import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Input from './Input.jsx';
import Button from './Button.jsx';
import { createTask } from '../services/projectService.js';

const AddTaskModal = ({ isVisible, onClose, onTaskAdded, projectId }) => {
  const taskCategories = ['Preliminares', 'Obra Negra', 'Instalaciones', 'Acabados', 'Equipamiento y Herrería', 'Limpieza y Entrega'];
  const [formData, setFormData] = useState({ name: '', description: '', status: 'To Do', due_date: '', start_date: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
  if (!formData.name) {
    setError('Task name is required.');
    return;
  }
  try {
    setError('');
    setLoading(true);
    const taskData = {
      ...formData,
      project_id: projectId,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
    };
    const newTask = await createTask(taskData); // <-- Capturamos la nueva tarea
    onTaskAdded(newTask); // <-- Se la pasamos a la página
    onClose();
  } catch (err) {
    setError('Failed to create task.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Task</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Input label="Task Name" value={formData.name} onChangeText={(value) => handleChange('name', value)} />
          <Input label="Description" value={formData.description} onChangeText={(value) => handleChange('description', value)} multiline />
          <View><Text style={styles.label}>Category</Text><select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} style={styles.selectStyle}><option value="">Select a category</option>{taskCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select></View>
          <View><Text style={styles.label}>Start Date</Text><input type="date" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} style={styles.inputStyle} /></View>
          <View><Text style={styles.label}>Due Date</Text><input type="date" value={formData.due_date} onChange={(e) => handleChange('due_date', e.target.value)} style={styles.inputStyle} /></View>
          <View style={styles.buttonContainer}><Button title="Cancel" onPress={onClose} variant="secondary" /><Button title="Save Task" onPress={handleSubmit} loading={loading} disabled={loading} style={{ marginLeft: 16 }} /></View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'},
  modalView:{width:'90%',maxWidth:500,backgroundColor:'white',borderRadius:8,padding:24,alignItems:'stretch',shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.25,shadowRadius:4,elevation:5},
  modalTitle:{marginBottom:24,textAlign:'center',fontSize:24,fontWeight:'bold',fontFamily:'Montserrat, sans-serif'},
  label:{fontSize:14,fontFamily:'Inter, sans-serif',color:'#212121',marginBottom:8},
  inputStyle:{height:50,width:'100%',borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,paddingHorizontal:16,fontSize:16,fontFamily:'Inter, sans-serif',backgroundColor:'#FFFFFF',marginBottom:16},
  selectStyle:{height:50,width:'100%',borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,paddingHorizontal:16,fontSize:16,fontFamily:'Inter, sans-serif',backgroundColor:'#FFFFFF',marginBottom:16},
  buttonContainer:{flexDirection:'row',justifyContent:'flex-end',marginTop:24},
  errorText:{color:'red',textAlign:'center',marginBottom:16},
});

export default AddTaskModal;