import React, { useState } from 'react';
import axios from 'axios';

const GetMembers = ({ setTeam, fetchTeam, userRole, team, teamId }) => {
  const [newUserName, setNewUserName] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const handleAddUser = async (e) => {
    e.preventDefault();
    console.log('Attempting to add user:', newUserName);
    if (!newUserName) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/teams/${teamId}/add_user/`,
        { username: newUserName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTeam((prevTeam) => ({
        ...prevTeam,
        users: Array.isArray(prevTeam.users) ? [...prevTeam.users, response.data] : [response.data],
      }));

      fetchTeam();
      setNewUserName('');
      setFilteredUsers([]);
    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : error.message);
    }
  };

  const handleSearchUsers = async (e) => {
    const searchTerm = e.target.value;
    setNewUserName(searchTerm);

    if (searchTerm.length > 2) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/users/?search=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFilteredUsers(response.data);
      } catch (error) {
        console.error(
          'Error searching users:',
          error.response ? error.response.data : error.message,
        );
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/teams/${teamId}/remove_user/`,
        {
          data: { user_id: userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('User removed successfully:', response.data);
      const updatedTeam = { ...team };
      updatedTeam.members = updatedTeam.members.filter((member) => member.id !== userId);
      setTeam(updatedTeam);
    } catch (error) {
      console.error('Error removing user:', error.response ? error.response.data : error.message);
    }
  };
  return (
    <div className="members">
      {userRole === 'admin' && (
        <div className="add">
          <h2>Добавить пользователя:</h2>
          <input
            type="text"
            value={newUserName}
            onChange={handleSearchUsers}
            placeholder="Имя пользователя"
          />
          <button onClick={handleAddUser}>Добавить пользователя</button>
          {filteredUsers.length > 0 && (
            <ul>
              {filteredUsers.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <h2>Члены команды:</h2>
        {Array.isArray(team.members) && team.members.length > 0 ? (
          <div className="membersList">
            <ul>
              {team.members.map((member) => (
                <li key={member.id}>
                  {member.username}
                  {userRole === 'admin' && member.role !== 'admin' && (
                    <button onClick={() => handleRemoveUser(member.id)}>Удалить</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Нет членов команды.</p>
        )}
      </div>
    </div>
  );
};

export default GetMembers;
