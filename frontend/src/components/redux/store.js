import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasks/tasksSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer, // Добавьте редюсер в хранилище
  },
});

export default store;
