import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Favorites from './pages/Favorites';
import MyPublisher from './pages/MyPublisher';
import BorrowedBooks from './pages/BorrowedBooks';
import './App.css';
import { Box } from '@mui/material';

// Login context
export const LoginContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem('user') ||
      localStorage.getItem('admin') ||
      localStorage.getItem('publisher') ||
      localStorage.getItem('member')
    );
  });

  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(
        Boolean(
          localStorage.getItem('user') ||
          localStorage.getItem('admin') ||
          localStorage.getItem('publisher') ||
          localStorage.getItem('member')
        )
      );
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Box
        sx={{
          minHeight: '100vh',
          background: "linear-gradient(rgba(30,40,60,0.72), rgba(30,40,60,0.62)), url('/library-bg.jpg') center center/cover no-repeat fixed",
          color: '#f7f4ed',
        }}
      >
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/login/member" element={<Login userType="member" />} />
            <Route path="/login/publisher" element={<Login userType="publisher" />} />
            <Route path="/login/admin" element={<Login userType="admin" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/borrowed" element={<BorrowedBooks />} />
            <Route path="/mypublisher" element={<MyPublisher />} />
            <Route path="/panel/member" element={<div>Üye Paneli (Sadece giriş yapan üyeler görebilir)</div>} />
            <Route path="/panel/publisher" element={<div>Yayınevi Paneli (Sadece giriş yapan yayınevleri görebilir)</div>} />
            <Route path="/panel/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
        </Router>
      </Box>
    </LoginContext.Provider>
  );
}

export default App;
