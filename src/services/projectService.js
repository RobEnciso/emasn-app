import { supabase } from './supabaseClient.js';

export const getProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getProjectById = async (id) => {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const getTasksForProject = async (projectId) => {
  const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId).order('created_at');
  if (error) throw error;
  return data;
};

export const getDocumentsForProject = async (projectId) => {
  const { data, error } = await supabase.from('documents').select('*').eq('project_id', projectId).order('uploaded_at');
  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  const { data, error } = await supabase.from('projects').insert(projectData).select();
  if (error) throw error;
  return data;
};

export const createTask = async (taskData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single(); // <-- Añadimos .single() para obtener solo un objeto

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
};

export const uploadDocument = async (file, projectId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}/${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage.from('project-documents').upload(fileName, file);
  if (error) throw error;
  return fileName;
};

export const addDocumentRecord = async (documentData) => {
  const { data, error } = await supabase.from('documents').insert(documentData).select();
  if (error) throw error;
  return data;
};

export const getDocumentUrl = async (filePath) => {
  const { data, error } = await supabase.storage.from('project-documents').createSignedUrl(filePath, 60);
  if (error) throw error;
  return data.signedUrl;
};
/**
 * Deletes a project by its ID.
 */
export const deleteProject = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
/**
 * Creates a new payment milestone for a project.
 */
export const createPayment = async (paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
  return data;
};
/**
 * Fetches all payments for a given project.
 */
// Dentro de src/services/projectService.js

export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks') // El nombre de tu tabla de tareas
    .delete()
    .eq('id', taskId); // Borra la tarea cuyo 'id' coincida

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
export const getPaymentsForProject = async (projectId) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('project_id', projectId)
    .order('payment_date');

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
  return data;
  
};
// Dentro de src/services/projectService.js

export const updateTask = async (taskId, updatedFields) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updatedFields) // Actualiza los campos que le pasemos
    .eq('id', taskId)
    .select() // Devuelve la tarea actualizada
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  return data;
};