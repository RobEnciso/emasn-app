import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Input from './Input.jsx';
import Button from './Button.jsx';
import { createPayment } from '../services/projectService.js';

const AddPaymentModal = ({ isVisible, onClose, onPaymentAdded, projectId }) => {
  const [formData, setFormData] = useState({ title: '', amount: '', payment_date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.amount || !formData.payment_date) {
      setError('All fields are required.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const paymentData = { ...formData, project_id: projectId };
      const newPayment = await createPayment(paymentData);
      onPaymentAdded(newPayment);
      onClose();
    } catch (err) {
      setError('Failed to create payment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add Payment Milestone</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Input label="Title" value={formData.title} onChangeText={value => handleChange('title', value)} placeholder="e.g., Anticipo" />
          <Input label="Amount ($)" value={formData.amount} onChangeText={value => handleChange('amount', value)} placeholder="e.g., 50000" keyboardType="numeric" />
          <View>
            <Text style={styles.label}>Payment Date</Text>
            <input type="date" value={formData.payment_date} onChange={e => handleChange('payment_date', e.target.value)} style={styles.inputStyle} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} variant="secondary" />
            <Button title="Save Payment" onPress={handleSubmit} loading={loading} style={{ marginLeft: 16 }} />
          </View>
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
    buttonContainer:{flexDirection:'row',justifyContent:'flex-end',marginTop:24},
    errorText:{color:'red',textAlign:'center',marginBottom:16},
});

export default AddPaymentModal;