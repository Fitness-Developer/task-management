import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронное действие для получения задач
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (teamId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://127.0.0.1:8000/api/tasksTeam/?team=${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://127.0.0.1:8000/api/tasksTeam/', taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  const token = localStorage.getItem('token');
  await axios.delete(`http://127.0.0.1:8000/api/tasksTeam/${taskId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return taskId;
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, newStatus }) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `http://127.0.0.1:8000/api/tasksTeam/${taskId}/`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Обработка создания задачи
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload); // Добавляем новую задачу в состояние
      })
      // Обработка удаления задачи
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload); // Удаляем задачу из состояния
      })
      // Обработка обновления статуса задачи
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Обновляем задачу в состоянии
        }
      });
  },
});

export default tasksSlice.reducer;
