import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, setIsLoggedIn, username, setUsername }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    if (loggedIn) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, [setIsLoggedIn, setUsername]);
  return (
    <header className="header">
      <Link to="/">
        <div className="ic">
          <img className="icon" src="/img/icon.png" alt="" />
          Todoist
        </div>
      </Link>
      <div className="section">
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/tasks">Задачи</Link>
          </li>
          {isLoggedIn && ( // Добавлена проверка isLoggedIn
            <li>
              <Link to="/teams">Команды</Link>
            </li>
          )}
          <li>
            <Link to="/feedback">Отзывы</Link>
          </li>
        </ul>
      </div>
      <div className="acc">
        <ul>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/profile">{username}</Link>
              </li>
              <li onClick={handleLogout}>Выход</li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Вход</Link>
              </li>
              <li>
                <Link to="/register">Регистрация</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
