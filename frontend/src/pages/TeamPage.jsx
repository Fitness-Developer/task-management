import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import GetMembers from './TeamPages/GetMembers';
import CreateTaskPage from './TeamPages/CreateTaskPage';
import PageTasks from './TeamPages/PageTasks';
import { fetchTasks } from '../components/redux/tasks/tasksSlice';

const TeamPage = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();

  const { tasks, loading } = useSelector((state) => state.tasks);

  const [team, setTeam] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/current_user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching current user:',
        error.response ? error.response.data : error.message,
      );
      return null;
    }
  };

  const fetchTeam = async (currentUser) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/teams/${teamId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeam(response.data);
      if (currentUser && response.data.members) {
        const currentMember = response.data.members.find(
          (member) => member.username === currentUser.username,
        );
        if (currentMember) {
          setUserRole(currentMember.role);
          setCurrentUserId(currentMember.id);
        }
      }
    } catch (error) {
      console.error('Error fetching team:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        await fetchTeam(currentUser);
        dispatch(fetchTasks(teamId)); // Диспетчеризация действия для загрузки задач
      }
    };
    loadData();
  }, [teamId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!team) {
    return <div>Команда не найдена.</div>;
  }

  return (
    <div className="TeamPage">
      <h1>{team.name}</h1>

      <div className="high-block">
        <CreateTaskPage teamId={teamId} userRole={userRole} fetchTasks={fetchTasks} team={team} />
        <GetMembers
          setTeam={setTeam}
          fetchTeam={fetchTeam}
          teamId={teamId}
          team={team}
          userRole={userRole}
        />
      </div>
      <PageTasks
        currentUserId={currentUserId}
        teamId={teamId}
        team={team}
        loading={loading}
        userRole={userRole}
        fetchTasks={fetchTasks}
        tasks={tasks}
      />
    </div>
  );
};

export default TeamPage;
