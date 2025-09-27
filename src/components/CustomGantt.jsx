import React from 'react';
import { differenceInDays, addDays, startOfWeek } from 'date-fns';
import './CustomGantt.css';

// MOVIMOS ESTA LÍNEA AQUÍ ARRIBA: Las importaciones siempre van al principio del archivo.
import TaskDetailPanel from './TaskDetailPanel'; 

const categoryColors = {
  'Preliminares': '#FDB813', 'Obra Negra': '#42A5F5', 'Instalaciones': '#2962FF',
  'Acabados': '#EC407A', 'Equipamiento y Herrería': '#AB47BC', 'Limpieza y Entrega': '#EF5350',
};

const parseDate = (dateString) => new Date(dateString + 'T00:00:00');

const CustomGantt = ({ tasks, project, payments, onTaskDelete, onTaskUpdate}) => {
  // --- PASO 1: MOVER EL ESTADO Y LA FUNCIÓN AQUÍ ADENTRO ---
  // Tanto useState como las funciones que lo usan deben estar dentro del componente.
  const [selectedTask, setSelectedTask] = React.useState(null);
  // --- AÑADE ESTE BLOQUE ---
React.useEffect(() => {
  // Este efecto vigila si la lista de tareas (tasks) cambia.
  if (selectedTask) {
    // Si hay una tarea seleccionada, buscamos su versión más reciente en la lista de tareas actualizada.
    const updatedTaskInList = tasks.find(task => task.id === selectedTask.id);

    // Si la encontramos y su contenido ha cambiado, actualizamos nuestro estado local (la "fotocopia").
    if (updatedTaskInList && JSON.stringify(updatedTaskInList) !== JSON.stringify(selectedTask)) {
      setSelectedTask(updatedTaskInList);
    }
  }
}, [tasks]); // La dependencia [tasks] hace que este código se ejecute cada vez que la lista de tareas cambie.
// -------------------------

  const handleTaskClick = (taskData) => {
    console.log("Se hizo clic en la tarea:", taskData);
    setSelectedTask(taskData);
  };
  const handleDeleteTask = async (taskId) => {
  // Pedimos confirmación al usuario
  const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar esta tarea?");

  if (isConfirmed) {
    // 1. Llama a Supabase para borrar la tarea
    const { error } = await supabase
      .from('tasks') // El nombre de tu tabla de tareas
      .delete()
      .match({ id: taskId });

    if (error) {
      console.error('Error al eliminar la tarea:', error);
      alert("No se pudo eliminar la tarea.");
    } else {
      // 2. Actualiza la lista de tareas en la pantalla SIN recargar
      // Esto filtra la lista de tareas, quedándose con todas menos la que acabamos de borrar.
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      
      // 3. Cierra el panel de detalles
      setSelectedTask(null); 
    }
  }
};
  // ---------------------------------------------------------

  if (!project || !project.start_date || !project.end_date) {
    return <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>El proyecto necesita una fecha de inicio y fin para construir la línea de tiempo.</div>;
  }

  const validTasks = (tasks || []).filter(t => t.start_date && t.due_date);

  const projectStartDate = parseDate(project.start_date);
  const projectEndDate = parseDate(project.end_date);
  const totalProjectDays = differenceInDays(projectEndDate, projectStartDate) + 1;
  // Dentro del componente CustomGantt
const handleDeleteAndClosePanel = async (taskId) => {
  // Llama a la función que viene de ProjectPage
  const wasDeleted = await onTaskDelete(taskId);

  // Si la función devolvió 'true', cerramos el panel
  if (wasDeleted) {
    setSelectedTask(null);
  }
};
  
  const weekHeaders = [];
  let currentDay = startOfWeek(projectStartDate);
  let weekCounter = 1;
  while (currentDay <= projectEndDate) {
    weekHeaders.push(`W${weekCounter++}`);
    currentDay = addDays(currentDay, 7);
  }
  
  const groupedTasks = validTasks.reduce((acc, task) => {
    const category = task.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {});

  const totalRows = Object.keys(groupedTasks).length + validTasks.length + 1;

  // --- LÓGICA FINANCIERA ---
  const totalPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const budget = Number(project.total_budget) || 0;
  const paidPercentage = budget > 0 ? (totalPaid / budget) * 100 : 0;
  // --------------------------

  return (
    <div className="gantt-container">
      <div className="gantt-sidebar">
        <div className="gantt-header">Categoría / Tarea</div>
        {Object.entries(groupedTasks).map(([category, tasksInCategory]) => (
          <div key={category}>
            <div className="gantt-category-item" style={{ backgroundColor: `${categoryColors[category]}20` }}>{category}</div>
            {tasksInCategory.map(task => <div key={task.id} className="gantt-task-item">{task.name}</div>)}
          </div>
        ))}
        {/* --- PASO 2: ELIMINAMOS EL DIV CON ONCLICK DE AQUÍ --- */}
        {/* Este div estaba mal ubicado y causaba un error. Lo quitamos. */}
        
        {/* Fila de Finanzas en la Barra Lateral */}
        <div className="gantt-financial-item">
            Finanzas
            <div className="financial-summary">
                Pagado: ${totalPaid.toLocaleString('en-US')}<br/>
                Presupuesto: ${budget.toLocaleString('en-US')}
            </div>
        </div>
      </div>

      <div className="gantt-timeline-container">
        <div className="gantt-timeline" style={{ width: `${weekHeaders.length * 80}px`, height: `${totalRows * 41}px` }}>
          <div className="gantt-timeline-header">
            {weekHeaders.map(label => <div key={label} className="gantt-week-header">{label}</div>)}
          </div>
          <div className="gantt-timeline-body">
            {/* Dibuja las barras de tareas */}
            {Object.values(groupedTasks).flat().map((task) => {
              let top = 0;
              let taskCount = 0;
              for (const category of Object.keys(groupedTasks)) {
                const tasksInCategory = groupedTasks[category];
                if (tasksInCategory.includes(task)) {
                  top = (taskCount + tasksInCategory.indexOf(task) + 1) * 41;
                  break;
                }
                taskCount += tasksInCategory.length + 1;
              }
              const offsetDays = differenceInDays(parseDate(task.start_date), projectStartDate);
              const durationDays = differenceInDays(parseDate(task.due_date), parseDate(task.start_date)) + 1;
              const left = (offsetDays / totalProjectDays) * 100;
              const width = (durationDays / totalProjectDays) * 100;
              return (
                // --- PASO 3: AÑADIMOS EL ONCLICK AQUÍ, EN LA BARRA REAL ---
                <div 
                  key={task.id} 
                  className="task-bar" 
                  style={{ top: `${top}px`, left: `${left}%`, width: `${width}%`, backgroundColor: categoryColors[task.category] || '#9E9E9E' }}
                  onClick={() => handleTaskClick(task)} // <- ¡La magia sucede aquí!
                >
                  <div className="gantt-tooltip">
                    <strong>{task.name}</strong><br />
                    <small>{task.description || 'Sin descripción'}</small><br />
                    <small>{`${task.start_date} -> ${task.due_date}`}</small>
                  </div>
                </div>
              );
            })}
            
            {/* SECCIÓN FINANCIERA EN LA LÍNEA DE TIEMPO */}
            <div className="financial-timeline-row" style={{top: `${(totalRows - 1) * 41}px`}}>
              <div className="financial-progress-bar" style={{ width: `${paidPercentage}%` }}></div>
              {(payments || []).map(payment => {
                  const offsetDays = differenceInDays(parseDate(payment.payment_date), projectStartDate);
                  const left = (offsetDays / totalProjectDays) * 100;
                  return (
                      <div key={payment.id} className="payment-bar" style={{ left: `calc(${left}% - 10px)` }}>
                          <div className="gantt-tooltip">
                              <strong>{payment.title}</strong><br />
                              <small>Monto: ${payment.amount.toLocaleString('en-US')}</small><br />
                              <small>Fecha: {payment.payment_date}</small>
                          </div>
                      </div>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* --- PASO 4: EL PANEL CONDICIONAL SE QUEDA AQUÍ --- */}
      {/* Esta parte estaba bien ubicada. Muestra el panel si hay una tarea seleccionada. */}
      {selectedTask && (
        <TaskDetailPanel 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onDelete={handleDeleteAndClosePanel}
          onUpdate={onTaskUpdate}
        />
      )}
    </div>
  );
};

export default CustomGantt;