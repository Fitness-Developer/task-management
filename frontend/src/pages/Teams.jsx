import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Teams = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/current_user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
        console.log('User Info:', response.data);
      } catch (error) {
        console.error(
          'Error fetching user info:',
          error.response ? error.response.data : error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/teams/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
        console.log('Teams:', response.data);
      } catch (error) {
        console.error(
          'Error fetching teams:',
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchUserInfo();
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!newTeamName) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/teams/',
        { name: newTeamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTeams([...teams, response.data]);
      setNewTeamName('');
    } catch (error) {
      console.error('Error creating team:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <div className="teams">
        <h1>Ваши команды</h1>
        {userInfo.role === 'admin' ? (
          <>
            <div className="new-team">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Название команды"
              />
              <button onClick={handleCreateTeam}>Добавить команду</button>
            </div>
            <div className="team-list">
              {teams
                .filter((team) =>
                  team.members.some((member) => member.username === userInfo.username),
                ) // Фильтруем команды по создателю
                .map((team) => (
                  <div key={team.id} className="team">
                    <Link to={`/teams/${team.id}`}>
                      <h2>{team.name}</h2>
                    </Link>
                  </div>
                ))}
              {teams.filter((team) =>
                team.members.some((member) => member.username === userInfo.username),
              ).length === 0 && <p className="noadmin">Вы не создали ни одной команды.</p>}
            </div>
          </>
        ) : userInfo.role === 'user' ? (
          <div className="team-list">
            {/* Фильтруем команды, созданные текущим пользователем ИЛИ в которых он участник */}
            {teams
              .filter(
                (team) =>
                  team.created_by.username === userInfo.username ||
                  team.members.some((member) => member.username === userInfo.username),
              )
              .map((team) => (
                <div key={team.id} className="team">
                  <Link to={`/teams/${team.id}`}>
                    <h2>{team.name}</h2>
                  </Link>
                </div>
              ))}
            {teams.filter(
              (team) =>
                team.created_by.username === userInfo.username ||
                team.members.some((member) => member.username === userInfo.username),
            ).length === 0 && (
              <p className="noadmin">Вы не создали и не добавлены ни в одну команду.</p>
            )}
          </div>
        ) : (
          <p className="noadmin">
            Пользователь может создавать команды или группы, если он является администратором в
            профиле сайта.
          </p>
        )}
      </div>
    </div>
  );
};

export default Teams;
