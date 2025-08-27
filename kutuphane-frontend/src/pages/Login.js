import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { loginUser } from '../api';
import { LoginContext } from '../App';

const Login = ({ userType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(LoginContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser({ username, password });
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      setIsLoggedIn(true);
      
      navigate('/');
      
    } catch (error) {
      setError(error.response?.data || 'Giriş sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const userTypeLabel = userType === 'member' ? 'Üye' : userType === 'publisher' ? 'Yayınevi' : 'Admin';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: "linear-gradient(rgba(30,40,60,0.72), rgba(30,40,60,0.62)), url('/login-bg.jpg') center center/cover no-repeat fixed",
        color: '#f7f4ed',
        py: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={8} sx={{
        p: { xs: 2, sm: 4 },
        width: '100%',
        maxWidth: 400,
        borderRadius: 4,
        boxShadow: 6,
        bgcolor: 'rgba(30,40,60,0.55)',
        backdropFilter: 'blur(8px)',
        mx: 'auto',
      }}>
        <LockOpenIcon sx={{ fontSize: 48, color: 'info.main', mb: 1, mt: 1 }} />
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #3a5ba0 0%, #4ecdc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            letterSpacing: '0.04em',
            mb: 1,
          }}
        >
          {userTypeLabel} Girişi
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              label="Kullanıcı Adı"
              variant="outlined"
              fullWidth
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
              sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
            />
            <TextField
              label="Şifre"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={loading}
              sx={{ 
                py: 1.3, 
                fontWeight: 700, 
                fontSize: 17, 
                borderRadius: 3, 
                boxShadow: '0 2px 12px 0 #4ecdc422' 
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 