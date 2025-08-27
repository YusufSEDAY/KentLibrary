import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { LoginContext } from '../App';
import { getUserBorrowRequests } from '../api';

async function fetchCoverByTitleCached(title) {
  if (!title) return null;
  
  const cacheKey = `book_cover_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`);
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      const coverUrl = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
      localStorage.setItem(cacheKey, coverUrl);
      return coverUrl;
    }
  } catch (error) {
    console.error('Kitap kapağı çekilirken hata:', error);
  }
  
  return null;
}

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(LoginContext);
  const location = useLocation();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!isLoggedIn) {
        setError('Bu sayfayı görüntülemek için giriş yapmalısınız.');
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
          setError('Kullanıcı bilgileri bulunamadı.');
          setLoading(false);
          return;
        }

        const response = await getUserBorrowRequests(user.id);
        
        const booksWithCovers = await Promise.all(
          response.data.map(async (request) => {
            const coverUrl = await fetchCoverByTitleCached(request.bookTitle);
            return { ...request, bookCover: coverUrl };
          })
        );
        
        setBorrowedBooks(booksWithCovers);
        setLoading(false);
      } catch (err) {
        console.error('Ödünç alınan kitaplar yüklenirken hata:', err);
        setError('Ödünç alınan kitaplar yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [isLoggedIn]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Returned':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Beklemede';
      case 'Approved':
        return 'Onaylandı';
      case 'Rejected':
        return 'Reddedildi';
      case 'Returned':
        return 'İade Edildi';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        Ödünç Aldığım Kitaplar
      </Typography>

      {borrowedBooks.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Henüz ödünç aldığınız kitap bulunmuyor.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kitaplar sayfasından kitap ödünç alma talebi gönderebilirsiniz.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {borrowedBooks.map((request) => (
            <Grid item xs={12} md={6} lg={4} key={request.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                                 <CardMedia
                   component="img"
                   height="200"
                   image={request.bookCover || 'https://via.placeholder.com/300x400/3a5ba0/ffffff?text=Kitap+Kapağı'}
                   alt={request.bookTitle}
                   sx={{ 
                     objectFit: 'cover',
                     background: 'linear-gradient(135deg, #3a5ba0 0%, #667eea 100%)'
                   }}
                 />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: '#2c3e50',
                      lineHeight: 1.3
                    }}
                  >
                    {request.bookTitle}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Yayınevi: {request.publisherName}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getStatusText(request.status)}
                      color={getStatusColor(request.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Talep Tarihi:</strong> {formatDate(request.requestDate)}
                    </Typography>
                    
                    {request.borrowStartDate && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>📅 Ödünç Alma:</strong> {formatDate(request.borrowStartDate)}
                      </Typography>
                    )}
                    
                    {request.borrowEndDate && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>📅 İade Tarihi:</strong> {formatDate(request.borrowEndDate)}
                      </Typography>
                    )}
                    
                    {request.approvedDate && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Onay Tarihi:</strong> {formatDate(request.approvedDate)}
                      </Typography>
                    )}
                    
                    {request.rejectedDate && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Red Tarihi:</strong> {formatDate(request.rejectedDate)}
                      </Typography>
                    )}
                    
                    {request.returnDate && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>İade Tarihi:</strong> {formatDate(request.returnDate)}
                      </Typography>
                    )}
                  </Box>

                  {request.notes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notlar:</strong> {request.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BorrowedBooks; 