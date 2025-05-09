import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../components/redux/tasks/tasksSlice';

const CreateTaskPage = ({ teamId, userRole, fetchTasks, team }) => {
  const dispatch = useDispatch();
  const [assignedUserId, setAssignedUserId] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('in_progress');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      alert('У вас нет прав для создания задач.');
      return;
    }
    if (!newTaskName) return;

    const taskData = {
      title: newTaskName,
      description: newTaskDescription,
      priority: newTaskPriority,
      due_date: newTaskDueDate,
      assigned_to: assignedUserId ? parseInt(assignedUserId, 10) : null,
      team: parseInt(teamId, 10),
      status: newTaskStatus,
    };

    console.log('Sending task data:', JSON.stringify(taskData));

    try {
      dispatch(createTask(taskData));
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error.message);
      alert('Ошибка создания задачи. Пожалуйста, попробуйте еще раз.');
    }
  };

  // Функция для сброса формы
  const resetForm = () => {
    setNewTaskName('');
    setNewTaskDescription('');
    setNewTaskPriority('low');
    setNewTaskDueDate('');
    setAssignedUserId(null);
    setNewTaskStatus('in_progress');
  };

  return (
    <>
      {userRole === 'admin' && (
        <div className="CreateTaskPage">
          <h2>Создать задачу:</h2>
          <form onSubmit={handleCreateTask} className="Create">
            <input
              type="text"
              placeholder="Название задачи"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              required
            />
            <textarea
              placeholder="Описание задачи"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
            />
            <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)}>
              <option value="">Выберите пользователя</option>
              {Array.isArray(team.members) &&
                team.members.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>

            <button type="submit">Создать задачу</button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateTaskPage;
