import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, updateTaskStatus } from '../../components/redux/tasks/tasksSlice';

const PageTasks = ({ currentUserId, teamId, userRole }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId)); // Используем действие для удаления задачи
  };
  const handleUpdateStatus = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ taskId, newStatus })); // Используем действие для обновления статуса задачи
  };
  const today = new Date().toISOString().split('T')[0];
  console.log('Data:', today);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <h1>Текущие задачи</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {tasks.length > 0 ? (
            <ul>
              {tasks
                .filter(
                  (task) =>
                    task.status !== 'completed' &&
                    task.team === Number(teamId) &&
                    task.due_date >= today,
                )
                .map((task) => (
                  <li key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Priority: {task.priority}</p>
                    <p>Due Date: {task.due_date}</p>
                    <p>
                      Assigned To: {task.assigned_to ? task.assigned_to.username : 'Unassigned'}
                    </p>
                    <p>Status: {task.status}</p>

                    {task.assigned_to && task.assigned_to.id === currentUserId ? (
                      <>
                        <div>
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                          >
                            <option value="in_progress">В процессе</option>
                            <option value="deferred">Отложено</option>
                          </select>

                          <button onClick={() => handleUpdateStatus(task.id, 'completed')}>
                            Завершить
                          </button>
                        </div>

                        <img
                          src="/img/delete.png" // Укажите путь к изображению
                          alt="Удалить задачу"
                          style={{ cursor: 'pointer', marginLeft: '10px', width: '30px' }} // Добавьте стили для курсора и отступа
                          onClick={() => handleDeleteTask(task.id)} // Обработчик клика для удаления задачи
                        />
                      </>
                    ) : userRole === 'admin' ? (
                      <>
                        <div>
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                          >
                            <option value="in_progress">В процессе</option>
                            <option value="deferred">Отложено</option>
                          </select>

                          <button onClick={() => handleUpdateStatus(task.id, 'completed')}>
                            Завершить
                          </button>
                        </div>

                        <img
                          src="/img/delete.png" // Укажите путь к изображению
                          alt="Удалить задачу"
                          style={{ cursor: 'pointer', marginLeft: '10px' }} // Добавьте стили для курсора и отступа
                          onClick={() => handleDeleteTask(task.id)} // Обработчик клика для удаления задачи
                        />
                      </>
                    ) : null}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}
        </>
      )}

      <h1>Просроченные задачи или выполненные</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {tasks.filter(
            (task) =>
              task.status === 'completed' ||
              (task.due_date <= today && task.team === Number(teamId)),
          ).length > 0 ? (
            <ul>
              {tasks
                .filter(
                  (task) =>
                    task.status === 'completed' ||
                    (task.due_date <= today && task.team === Number(teamId)),
                )
                .map((task) => (
                  <li key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Priority: {task.priority}</p>
                    <p>Due Date: {task.due_date}</p>
                    <p>
                      Assigned To: {task.assigned_to ? task.assigned_to.username : 'Unassigned'}
                    </p>
                    <p>Status: {task.status}</p>
                    {userRole === 'admin' ? (
                      <img
                        src="/img/delete.png"
                        alt="Удалить задачу"
                        style={{ cursor: 'pointer', marginLeft: '10px', width: '30px' }}
                        onClick={() => handleDeleteTask(task.id)}
                      />
                    ) : null}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No completed or overdue tasks available.</p>
          )}
        </>
      )}
    </>
  );
};

export default PageTasks;
