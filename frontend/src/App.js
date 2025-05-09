import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import FirstPage from './components/FirstPage';
import Footer from './components/Footer';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Teams from './pages/Teams';
import TeamPage from './pages/TeamPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <div className="app-container">
      <Router>
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          username={username}
          setUsername={setUsername}
        />
        <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}
          />
          <Route
            path="/register"
            element={<Register setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}
          />
          <Route path="/" element={<FirstPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
