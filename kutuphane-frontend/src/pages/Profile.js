import React, { useState, useEffect, useContext } from 'react';
import {Box,Typography,TextField,Button,Paper,Alert,CircularProgress,Grid,Avatar,Divider,Chip,Stack,Container} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUser, getUserStatistics } from '../api';
import { LoginContext } from '../App';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LanguageIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    address: '',
    username: '',
    password: '',
    role: '',
    publisherName: '',
    website: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setForm({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '',
      email: userData.email || '',
      address: userData.address || '',
      username: userData.username || '',
      password: '',
      role: userData.role || '',
      publisherName: userData.publisherName || '',
      website: userData.website || ''
    });

    if (userData.id) {
      loadUserStatistics(userData.id);
    }
  }, [isLoggedIn, navigate]);

  const loadUserStatistics = async (userId) => {
    try {
      setStatisticsLoading(true);
      const response = await getUserStatistics(userId);
      setStatistics(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      setStatistics(null);
    } finally {
      setStatisticsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      const response = await updateUser(user.id, updateData);
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profil bilgileriniz başarıyla güncellendi!');
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data || 'Güncelleme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  const roleLabel = {
    'member': 'Üye',
    'publisher': 'Yayınevi',
    'admin': 'Admin'
  };
  const roleIcon = {
    'member': <PersonIcon fontSize="large" />,
    'publisher': <BusinessIcon fontSize="large" />,
    'admin': <VerifiedUserIcon fontSize="large" />
  };
  const roleColor = {
    'member': '#667eea',
    'publisher': '#43aa8b',
    'admin': '#e07a5f'
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPublisher = user?.role === 'publisher';

  const renderStatistics = () => {
    if (statisticsLoading) {
      return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (!statistics) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          İstatistikler yüklenemedi
        </Typography>
      );
    }

    if (user?.role === 'member') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: roleColor[user?.role] || '#667eea' }}>
                {statistics.borrowedBooksCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ödünç
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: roleColor[user?.role] || '#667eea' }}>
                {statistics.favoriteBooksCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Favori
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    } else if (user?.role === 'publisher') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: roleColor[user?.role] || '#667eea' }}>
                {statistics.booksCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kitap
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: roleColor[user?.role] || '#667eea' }}>
                {statistics.borrowRequestsCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Talep
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    } else if (user?.role === 'admin') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: roleColor[user?.role] || '#667eea' }}>
                {statistics.totalUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kullanıcı
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: roleColor[user?.role] || '#667eea' }}>
                {statistics.totalBooks || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kitap
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#000000',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            👤 Profil Merkezi
          </Typography>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Hesap bilgilerinizi yönetin ve güncelleyin
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Profil Kartı */}
          <Box sx={{ width: 320, flexShrink: 0 }}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                p: 4,
                textAlign: 'center',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                height: 'fit-content',
                position: 'sticky',
                top: 20
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: roleColor[user?.role] || '#667eea',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '4px solid #fff'
                }}
              >
                {roleIcon[user?.role]}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
                {isPublisher ? user?.publisherName : `${user?.firstName} ${user?.lastName}`}
              </Typography>
              
              {isPublisher && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Yetkili: {user?.firstName} {user?.lastName}
                </Typography>
              )}
              
              {!isPublisher && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  @{user?.username}
                </Typography>
              )}
              
              <Chip
                label={roleLabel[user?.role]}
                sx={{
                  bgcolor: roleColor[user?.role] || '#667eea',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2,
                  mb: 3
                }}
              />

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <EmailIcon sx={{ color: roleColor[user?.role] || '#667eea' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <LocationOnIcon sx={{ color: roleColor[user?.role] || '#667eea' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user?.address || 'Belirtilmemiş'}
                  </Typography>
                </Box>
                
                {isPublisher && user?.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <LanguageIcon sx={{ color: roleColor[user?.role] || '#667eea' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.website}
                    </Typography>
                  </Box>
                )}
                
                {!isPublisher && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <CalendarTodayIcon sx={{ color: roleColor[user?.role] || '#667eea' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(user?.birthDate)}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                  Hesap İstatistikleri
                </Typography>
                {renderStatistics()}
              </Box>
            </Paper>
          </Box>

          {/* Profil Formu */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                p: 4,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                  Profil Bilgileri
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{
                    borderRadius: 2,
                    borderColor: roleColor[user?.role] || '#667eea',
                    color: roleColor[user?.role] || '#667eea',
                    '&:hover': {
                      borderColor: roleColor[user?.role] || '#667eea',
                      bgcolor: 'rgba(102,126,234,0.04)'
                    }
                  }}
                >
                  {isEditing ? 'İptal' : 'Düzenle'}
                </Button>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {isPublisher ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          label="Yayınevi Adı"
                          name="publisherName"
                          variant="outlined"
                          fullWidth
                          value={form.publisherName}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Yetkili Kişi Adı Soyadı"
                          name="firstName"
                          variant="outlined"
                          fullWidth
                          value={`${form.firstName} ${form.lastName}`.trim()}
                          onChange={e => {
                            const fullName = e.target.value;
                            const nameParts = fullName.split(' ');
                            const firstName = nameParts[0] || '';
                            const lastName = nameParts.slice(1).join(' ') || '';
                            setForm({ ...form, firstName, lastName });
                          }}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="E-posta"
                          name="email"
                          type="email"
                          variant="outlined"
                          fullWidth
                          value={form.email}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Web Sitesi (Opsiyonel)"
                          name="website"
                          variant="outlined"
                          fullWidth
                          value={form.website}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Adres"
                          name="address"
                          variant="outlined"
                          fullWidth
                          value={form.address}
                          onChange={handleChange}
                          multiline
                          rows={3}
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Kullanıcı Adı"
                          name="username"
                          variant="outlined"
                          fullWidth
                          value={form.username}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Yeni Şifre (Opsiyonel)"
                          name="password"
                          type="password"
                          variant="outlined"
                          fullWidth
                          value={form.password}
                          onChange={handleChange}
                          helperText="Şifrenizi değiştirmek istemiyorsanız boş bırakın"
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Ad"
                          name="firstName"
                          variant="outlined"
                          fullWidth
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Soyad"
                          name="lastName"
                          variant="outlined"
                          fullWidth
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Doğum Tarihi"
                          name="birthDate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={form.birthDate}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="E-posta"
                          name="email"
                          type="email"
                          variant="outlined"
                          fullWidth
                          value={form.email}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Adres"
                          name="address"
                          variant="outlined"
                          fullWidth
                          value={form.address}
                          onChange={handleChange}
                          multiline
                          rows={3}
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Kullanıcı Adı"
                          name="username"
                          variant="outlined"
                          fullWidth
                          value={form.username}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Yeni Şifre (Opsiyonel)"
                          name="password"
                          type="password"
                          variant="outlined"
                          fullWidth
                          value={form.password}
                          onChange={handleChange}
                          helperText="Şifrenizi değiştirmek istemiyorsanız boş bırakın"
                          disabled={!isEditing}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: isEditing ? 'rgba(245,247,250,0.7)' : 'rgba(245,247,250,0.3)',
                              '&:hover': isEditing ? { bgcolor: 'rgba(245,247,250,0.95)' } : {}
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  
                  {isEditing && (
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{
                          py: 2,
                          fontWeight: 700,
                          fontSize: 16,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${roleColor[user?.role] || '#667eea'} 0%, ${roleColor[user?.role] || '#667eea'}dd 100%)`,
                          color: '#fff',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${roleColor[user?.role] || '#667eea'}dd 0%, ${roleColor[user?.role] || '#667eea'} 100%)`,
                            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile; 