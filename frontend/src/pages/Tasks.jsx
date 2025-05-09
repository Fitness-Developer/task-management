import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  Typography,
  CardContent,
  Card,
  Container,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { jwtDecode } from 'jwt-decode';
import EditIcon from '@mui/icons-material/Edit';

const Tasks = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: '',
  });
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date.split('T')[0],
      tags: task.tags,
    });
    setEditingTaskId(task.id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;

    try {
      if (editingTaskId) {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/tasks/${editingTaskId}/`,
          {
            ...newTask,
            user: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Task updated:', response.data);
      } else {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/tasks/',
          {
            ...newTask,
            user: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Task created:', response.data);
      }
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        tags: '',
      });
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Task deleted:', response.data);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.response ? error.response.data : error.message);
    }
  };

  const changeTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log('New Status:', newStatus);
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/tasks/${taskId}/`,
        { status: newStatus }, // <--- Берем первый элемент массива
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Task status updated:', response.data);
      fetchTasks();
    } catch (error) {
      console.error(
        'Error updating task status:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="tasks">
      <Container>
        <h1>Создание задач</h1>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={3}>
              <TextField
                sx={{
                  '& .MuiInputLabel-root': { color: 'white' }, // Цвет лейбла
                  '& .MuiInputBase-root': { color: 'white' }, // Цвет текста внутри поля
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' }, // Цвет границы
                    '&:hover fieldset': { borderColor: 'white' }, // Цвет границы при наведении
                    '&.Mui-focused fieldset': { borderColor: 'white' }, // Цвет границы при фокусе
                  },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiSelect-select': { color: 'white' }, // Цвет текста в Select
                  '& .MuiSelect-icon': { color: 'white' }, // Цвет стрелки в Select
                }}
                fullWidth
                label="Название задачи"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={3}>
              <TextField
                sx={{
                  '& .MuiInputLabel-root': { color: 'white' }, // Цвет лейбла
                  '& .MuiInputBase-root': { color: 'white' }, // Цвет текста внутри поля
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' }, // Цвет границы
                    '&:hover fieldset': { borderColor: 'white' }, // Цвет границы при наведении
                    '&.Mui-focused fieldset': { borderColor: 'white' }, // Цвет границы при фокусе
                  },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiSelect-select': { color: 'white' }, // Цвет текста в Select
                  '& .MuiSelect-icon': { color: 'white' }, // Цвет стрелки в Select
                }}
                fullWidth
                label="Описание задачи"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />
            </Grid2>
            <Grid2 item xs={2}>
              <FormControl fullWidth>
                <InputLabel
                  shrink
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    '& .MuiInputLabel-root': { color: 'white' }, // Цвет лейбла
                    '& .MuiInputBase-root': { color: 'white' }, // Цвет текста внутри поля
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' }, // Цвет границы
                      '&:hover fieldset': { borderColor: 'white' }, // Цвет границы при наведении
                      '&.Mui-focused fieldset': { borderColor: 'white' }, // Цвет границы при фокусе
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiSelect-select': { color: 'white' }, // Цвет текста в Select
                    '& .MuiSelect-icon': { color: 'white' }, // Цвет стрелки в Select
                  }}
                >
                  Приоритет
                </InputLabel>
                <Select
                  sx={{
                    '& .MuiInputLabel-root': { color: 'white' }, // Цвет лейбла
                    '& .MuiInputBase-root': { color: 'white' }, // Цвет текста внутри поля
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' }, // Цвет границы
                      '&:hover fieldset': { borderColor: 'white' }, // Цвет границы при наведении
                      '&.Mui-focused fieldset': { borderColor: 'white' }, // Цвет границы при фокусе
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiSelect-select': { color: 'white' }, // Цвет текста в Select
                    '& .MuiSelect-icon': { color: 'white' }, // Цвет стрелки в Select
                  }}
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  required
                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                >
                  <MenuItem value="high">Высокий</MenuItem>
                  <MenuItem value="medium">Средний</MenuItem>
                  <MenuItem value="low">Низкий</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item xs={2}>
              <TextField
                fullWidth
                label="Срок выполнения"
                type="date"
                name="due_date"
                value={newTask.due_date}
                onChange={handleChange}
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Grid2>
            <Grid2 item xs={1}>
              <TextField
                fullWidth
                label="Теги"
                name="tags"
                value={newTask.tags}
                onChange={handleChange}
              />
            </Grid2>
          </Grid2>
          <Grid2 item xs={12} style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" type="submit">
              {editingTaskId ? 'Обновить задачу' : 'Добавить задачу'}
            </Button>
          </Grid2>
        </form>
        <h1>Список задач</h1>
        <Grid2 container spacing={2} style={{ marginTop: '20px' }}>
          {tasks.map((task) => (
            <Grid2 item xs={12} sm={6} md={4} key={task.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" style={{ marginBottom: '20px' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2">{task.description}</Typography>
                  <Typography variant="subtitle1">Приоритет: {task.priority}</Typography>
                  <Typography variant="subtitle1">Срок выполнения: {task.due_date}</Typography>
                  <Typography variant="subtitle1">Статус: {task.status}</Typography>
                  <FormControl fullWidth style={{ marginTop: '10px' }}>
                    <InputLabel sx={{ position: 'absolute', top: '-6px' }}>
                      Изменить статус
                    </InputLabel>
                    <Select
                      value={task.status}
                      onChange={(e) => changeTaskStatus(task.id, e.target.value)}
                      multiple={false}
                    >
                      <MenuItem value="in_progress">В процессе</MenuItem>
                      <MenuItem value="completed">Завершено</MenuItem>
                      <MenuItem value="deferred">Отложено</MenuItem>
                    </Select>
                  </FormControl>

                  <IconButton aria-label="edit" size="small" onClick={() => handleEdit(task)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDelete(task.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </div>
  );
};
export default Tasks;
