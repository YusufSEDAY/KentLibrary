import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser, registerPublisher } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    address: '',
    username: '',
    password: '',
    role: 'member',
    publisherName: '',
    publisherName: '',
    authorizedPersonName: '',
    website: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (form.role === 'publisher') {
        const publisherData = {
          publisherName: form.publisherName,
          authorizedPersonName: form.authorizedPersonName,
          address: form.address,
          email: form.email,
          username: form.username,
          password: form.password,
          website: form.website || null
        };

        const response = await registerPublisher(publisherData);
        setSuccess('Yayın evi kaydı başarılı! Giriş yapabilirsiniz.');
      } else {
        const userData = {
          firstName: form.firstName,
          lastName: form.lastName,
          birthDate: new Date(form.birthDate).toISOString(),
          email: form.email,
          address: form.address,
          username: form.username,
          password: form.password,
          role: form.role
        };

        const response = await registerUser(userData);
        setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
      }
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setError(error.response?.data || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: "linear-gradient(rgba(30,40,60,0.72), rgba(30,40,60,0.62)), url('/register-bg.jpg') center center/cover no-repeat fixed",
        color: '#f7f4ed',
        py: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: 500,
          borderRadius: 4,
          boxShadow: 6,
          bgcolor: 'rgba(255,255,255,0.82)',
          border: '1.5px solid #e0d7c6',
          backdropFilter: 'blur(8px)',
          mx: 'auto',
        }}
      >
        <Typography variant="h5" gutterBottom align="center"
          sx={{
            background: 'linear-gradient(90deg, #3a5ba0 0%, #4ecdc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            letterSpacing: '0.04em',
          }}
        >Kayıt Ol</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TextField
            select
            label="Kullanıcı Türü"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
          >
            <MenuItem value="member">Üye</MenuItem>
            <MenuItem value="publisher">Yayınevi</MenuItem>
          </TextField>
          
          {form.role === 'member' ? (
            
            <>
              <TextField
                label="Ad"
                name="firstName"
                variant="outlined"
                fullWidth
                margin="dense"
                value={form.firstName}
                onChange={handleChange}
                required
                sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
              />
              <TextField
                label="Soyad"
                name="lastName"
                variant="outlined"
                fullWidth
                margin="dense"
                value={form.lastName}
                onChange={handleChange}
                required
                sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
              />
              <TextField
                label="Doğum Tarihi"
                name="birthDate"
                type="date"
                variant="outlined"
                fullWidth
                margin="dense"
                value={form.birthDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
              />
            </>
          ) : (
            
            <>
              <TextField
                label="Yayınevi Adı"
                name="publisherName"
                variant="outlined"
                fullWidth
                margin="dense"
                value={form.publisherName}
                onChange={handleChange}
                required
                sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
              />
              <TextField
                label="Yetkili Kişi Adı"
                name="authorizedPersonName"
                variant="outlined"
                fullWidth
                margin="dense"
                value={form.authorizedPersonName}
                onChange={handleChange}
                required
                sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
              />
            </>
          )}
          
          <TextField
            label="E-posta"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={handleChange}
            required
            sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
          />
          <TextField
            label="Adres"
            name="address"
            variant="outlined"
            fullWidth
            margin="dense"
            value={form.address}
            onChange={handleChange}
            required
            multiline
            rows={2}
            sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
          />
          {form.role === 'publisher' && (
            <TextField
              label="Web Sitesi (Opsiyonel)"
              name="website"
              variant="outlined"
              fullWidth
              margin="dense"
              value={form.website}
              onChange={handleChange}
              sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
            />
          )}
          <TextField
            label="Kullanıcı Adı"
            name="username"
            variant="outlined"
            fullWidth
            margin="dense"
            value={form.username}
            onChange={handleChange}
            required
            sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}
          />
          <TextField
            label="Şifre"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="dense"
            value={form.password}
            onChange={handleChange}
            required
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
              boxShadow: '0 2px 12px 0 #4ecdc422',
              background: 'linear-gradient(90deg, #3a5ba0 0%, #4ecdc4 100%)',
              backgroundSize: '200% 100%',
              backgroundPosition: 'left',
              transition: 'background-position 0.3s',
              '&:hover': {
                backgroundPosition: 'right',
                background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register; 