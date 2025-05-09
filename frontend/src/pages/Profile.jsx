import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Импортируем Axios
import '../App.scss';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        // Выполняем запрос с помощью Axios
        const response = await axios.get('http://127.0.0.1:8000/api/current_user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error(
          'Error fetching user info:',
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="profile">
      <div className="info1">
        {userInfo ? <p>Username: {userInfo.username}</p> : <p>Loading user info...</p>}
      </div>
      <div className="info2">
        {userInfo ? (
          <p>
            Your role:{' '}
            {userInfo.role === 'admin'
              ? 'Administrator'
              : userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)}
          </p>
        ) : (
          <p>Loading role...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
