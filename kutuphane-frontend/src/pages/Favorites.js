import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Stack, 
  Skeleton,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Grid
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { getUserFavorites, removeFromFavorites, createBorrowRequest } from '../api';
import { LoginContext } from '../App';

// Open Library'den kitap adına göre kapak url'si bul
async function fetchCoverByTitleCached(title) {
  const cacheKey = 'cover_' + title;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.docs && data.docs.length > 0) {
      const doc = data.docs[0];
      let coverUrl = null;
      if (doc.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      } else if (doc.isbn && doc.isbn.length > 0) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
      }
      if (coverUrl) {
        localStorage.setItem(cacheKey, coverUrl);
        return coverUrl;
      }
    }
  } catch (e) {}
  localStorage.setItem(cacheKey, '');
  return null;
}

const categoryColors = {
  Roman: '#3a5ba0',
  Klasik: '#e07a5f',
  Psikoloji: '#43aa8b',
  Aşk: '#f76d6d',
  Distopya: '#6c63ff',
  'Bilim Kurgu' : '#ffd166',
  Çocuk: '#f9c74f',
  Tarih: '#b5838d',
  Polisiye: '#22223b',
  Felsefe: '#3d405b',
  Macera: '#f3722c',
  Biyografi: '#277da1',
  Şiir: '#9d4edd',
  Mitoloji: '#ffb4a2',
  Korku: '#720026',
  Mizah: '#f9844a',
  Sanat: '#577590',
  Din: '#b5ead7',
  Bilim: '#00b4d8',
  Eğitim: '#f7b801',
  Sağlık: '#43bccd',
  Spor: '#f94144',
  Gezi: '#90be6d',
  Yemek: '#f8961e',
  Diğer: '#adb5bd',
};

const Favorites = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booksWithCovers, setBooksWithCovers] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setError('Favorilerinizi görmek için giriş yapmalısınız.');
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
          setError('Kullanıcı bilgileri bulunamadı.');
          setLoading(false);
          return;
        }

        const response = await getUserFavorites(user.id);
        setFavoriteBooks(response.data);
      } catch (error) {
        console.error('Favoriler yüklenirken hata:', error);
        setError('Favorileriniz yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn]);

  
  useEffect(() => {
    const loadBookCovers = async () => {
      if (favoriteBooks.length === 0) return;
      
      const booksWithCoversData = await Promise.all(
        favoriteBooks.map(async (book) => {
          let coverUrl = book.cover;
          if (!coverUrl) {
            coverUrl = await fetchCoverByTitleCached(book.title);
          }
          return { ...book, cover: coverUrl };
        })
      );
      
      setBooksWithCovers(booksWithCoversData);
    };

    loadBookCovers();
  }, [favoriteBooks]);

  const handleRemoveFavorite = async (bookId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await removeFromFavorites({ UserID: user.id, BookID: bookId });
      
      
      setFavoriteBooks(prev => prev.filter(book => book.id !== bookId));
      setBooksWithCovers(prev => prev.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Favori kaldırılırken hata:', error);
      setSnackbarMessage('Favori kaldırılırken bir hata oluştu.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState(null);
  const [borrowStartDate, setBorrowStartDate] = useState('');
  const [borrowEndDate, setBorrowEndDate] = useState('');
  const [borrowNote, setBorrowNote] = useState('');
  const [borrowLoading, setBorrowLoading] = useState(false);
  

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleBorrowRequest = (book) => {
    setSelectedBookForBorrow(book);
    setBorrowDialogOpen(true);
  };

  const handleSubmitBorrowRequest = async () => {
    if (!borrowStartDate || !borrowEndDate) {
      setSnackbarMessage('Lütfen başlangıç ve bitiş tarihlerini seçin.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if (new Date(borrowStartDate) >= new Date(borrowEndDate)) {
      setSnackbarMessage('Bitiş tarihi başlangıç tarihinden sonra olmalıdır.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setBorrowLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestData = {
        UserId: user.id,
        BookId: selectedBookForBorrow.id,
        PublisherId: selectedBookForBorrow.publisherId || 0,
        BorrowStartDate: borrowStartDate,
        BorrowEndDate: borrowEndDate,
        Note: borrowNote || '',
        Status: 'Pending'
      };

      await createBorrowRequest(requestData);
      
      
      setBorrowDialogOpen(false);
      setSelectedBookForBorrow(null);
      setBorrowStartDate('');
      setBorrowEndDate('');
      setBorrowNote('');
      
      setSnackbarMessage('Ödünç alma talebiniz başarıyla gönderildi!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Ödünç alma talebi sırasında hata:', error);
      if (error.response?.data) {
        
        if (error.response.data.includes('yayınevi sistemde kayıtlı değil')) {
          setSnackbarMessage('Bu kitabın yayınevi henüz sisteme kayıtlı değil. Lütfen admin ile iletişime geçin.');
        } else {
          setSnackbarMessage(error.response.data);
        }
      } else {
        setSnackbarMessage('Ödünç alma talebi sırasında bir hata oluştu.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setBorrowLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: "linear-gradient(135deg, rgba(30,40,60,0.85) 0%, rgba(78,205,196,0.15) 100%), url('/books-bg.jpg') center center/cover no-repeat fixed",
          color: '#f7f4ed',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="warning" sx={{ mt: 4 }}>
            Favorilerinizi görmek için giriş yapmalısınız.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: "linear-gradient(135deg, rgba(30,40,60,0.85) 0%, rgba(78,205,196,0.15) 100%), url('/books-bg.jpg') center center/cover no-repeat fixed",
        color: '#f7f4ed',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #3a5ba0 0%, #4ecdc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900,
            letterSpacing: '0.04em',
            mb: 6,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          Favori Kitaplarım
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

                 {loading ? (
           <Box>
             {[1, 2, 3].map((item) => (
               <Box key={item} sx={{ width: '100%', mb: 3 }}>
                 <Card sx={{ 
                   width: '100%',
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'space-between',
                   p: 2,
                   position: 'relative',
                   background: 'linear-gradient(135deg, #f7f4ed 0%, #e0e7ef 100%)',
                   boxShadow: '0 8px 32px 0 #3a5ba022',
                   border: '1.5px solid #e0d7c6',
                   borderRadius: 5,
                   overflow: 'hidden',
                 }}>
                   <CardContent>
                     <Skeleton variant="text" width="80%" height={32} />
                     <Skeleton variant="text" width="60%" height={24} />
                     <Skeleton variant="text" width="100%" height={60} />
                     <Skeleton variant="text" width="90%" height={20} />
                   </CardContent>
                 </Card>
               </Box>
             ))}
           </Box>
                          ) : booksWithCovers.length === 0 ? (
           <Box sx={{ textAlign: 'center', py: 8 }}>
             <MenuBookIcon sx={{ fontSize: 80, color: '#f7f4ed', mb: 2 }} />
             <Typography variant="h5" sx={{ color: '#f7f4ed', fontWeight: 600, mb: 2 }}>
               Henüz favori kitabınız yok
             </Typography>
             <Typography variant="body1" sx={{ color: '#e0e7ef', fontSize: '1.1rem' }}>
               Kitaplar sayfasından beğendiğiniz kitapları favorilere ekleyebilirsiniz.
             </Typography>
           </Box>
                 ) : (
           <Box>
             {booksWithCovers.map(book => (
               <Box key={book.id} sx={{ width: '100%', mb: 3 }}>
                 <Card
                   sx={{
                     width: '100%',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                     p: 2,
                     position: 'relative',
                     background: 'linear-gradient(135deg, #f7f4ed 0%, #e0e7ef 100%)',
                     boxShadow: '0 8px 32px 0 #3a5ba022',
                     border: '1.5px solid #e0d7c6',
                     borderRadius: 5,
                     transition: 'box-shadow 0.22s, transform 0.22s, border 0.22s, background 0.22s',
                     overflow: 'hidden',
                     '&:hover': {
                       boxShadow: '0 16px 48px 0 #3a5ba044',
                       border: '2.5px solid #3a5ba0',
                       transform: 'scale(1.045)',
                       background: 'linear-gradient(135deg, #e0e7ef 0%, #f7f4ed 100%)',
                     },
                   }}
                 >
                   {/* Arka plan görseli kaldırıldı, sade pastel arka plan */}
                   <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, position: 'relative', zIndex: 1 }}>
                     <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>{book.title}</Typography>
                     <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                       {book.categories && book.categories.map(catName => (
                         <Chip key={catName} label={catName} size="small" sx={{ 
                           fontWeight: 600, 
                           fontSize: 13, 
                           background: categoryColors[catName] || '#4ecdc4', 
                           color: '#fff', 
                           letterSpacing: '0.03em' 
                         }} />
                       ))}
                     </Stack>
                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>{book.author}</Typography>
                     <Typography variant="body2" color="text.secondary">{book.summary}</Typography>
                   </CardContent>
                   <CardActions sx={{
                     position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 96
                   }}>
                     <Box sx={{ display: 'flex', gap: 1 }}>
                       <Button size="small" color="primary" onClick={() => setSelectedBook(book)} sx={{ fontWeight: 700, borderRadius: 2 }}>
                         Detay
                       </Button>
                       {(() => {
                         const user = JSON.parse(localStorage.getItem('user') || '{}');
                         
                         if (isLoggedIn && user.role === 'member') {
                           return (
                             <Button
                               onClick={() => handleBorrowRequest(book)}
                               startIcon={<LocalLibraryIcon />}
                               sx={{
                                 color: '#4caf50',
                                 borderColor: '#4caf50',
                                 borderRadius: 2,
                                 px: 2,
                                 py: 0.5,
                                 fontSize: '0.875rem',
                                 fontWeight: 600,
                                 textTransform: 'none',
                                 '&:hover': {
                                   color: '#fff',
                                   backgroundColor: '#4caf50',
                                   borderColor: '#4caf50',
                                   transform: 'translateY(-1px)',
                                   boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                                 },
                                 transition: 'all 0.3s ease'
                               }}
                             >
                               Ödünç Al
                             </Button>
                           );
                         }
                         return null;
                       })()}
                       <Tooltip title="Favorilerden çıkar">
                         <IconButton
                           onClick={() => handleRemoveFavorite(book.id)}
                           sx={{
                             color: '#e91e63',
                             '&:hover': {
                               color: '#c2185b',
                             }
                           }}
                         >
                           <FavoriteIcon />
                         </IconButton>
                       </Tooltip>
                     </Box>
                     <Box
                       sx={{
                         height: 120,
                         width: 120,
                         background: '#fff',
                         borderRadius: 12,
                         overflow: 'hidden',
                         boxShadow: '0 4px 18px #3a5ba022',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         p: 1,
                         mt: -20,
                         mr: 2,
                       }}
                     >
                       {book.cover === undefined ? (
                         <Skeleton variant="rectangular" width={96} height={96} sx={{ borderRadius: 2 }} />
                       ) : book.cover ? (
                         <img
                           src={book.cover}
                           alt={book.title + ' kapak'}
                           style={{
                             width: '100%',
                             height: '100%',
                             objectFit: 'contain',
                             display: 'block',
                             borderRadius: 8,
                             background: '#fff',
                           }}
                           loading="lazy"
                           decoding="async"
                         />
                       ) : (
                         <MenuBookIcon sx={{ fontSize: 100, color: '#b08968', opacity: 0.28 }} />
                       )}
                     </Box>
                   </CardActions>
                 </Card>
               </Box>
             ))}
           </Box>
         )}

        {/* Kitap Detay Dialog'u */}
        <Dialog open={!!selectedBook} onClose={() => setSelectedBook(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#333'
          }}>
            {selectedBook?.title} - {selectedBook?.author}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              {/* Kapak Resmi */}
              <Box sx={{ 
                minWidth: 120,
                height: 160,
                background: '#fff',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {selectedBook?.cover ? (
                  <img
                    src={selectedBook.cover}
                    alt={selectedBook.title + ' kapak'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                ) : (
                  <MenuBookIcon sx={{ fontSize: 60, color: '#b08968', opacity: 0.5 }} />
                )}
              </Box>
              
              {/* Kitap Bilgileri */}
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  {selectedBook?.categories?.map(cat => (
                    <Chip key={cat} label={cat} size="small" sx={{ 
                      fontWeight: 600, 
                      fontSize: 13, 
                      background: categoryColors[cat] || '#4ecdc4', 
                      color: '#fff', 
                      letterSpacing: '0.03em' 
                    }} />
                  ))}
                </Stack>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1, fontSize: '0.9rem' }}>
                  <strong>İlk Basım Yılı:</strong> 
                  <span>{selectedBook?.publishDate && selectedBook.publishDate !== '0001-01-01T00:00:00' ? new Date(selectedBook.publishDate).getFullYear() : 'Belirtilmemiş'}</span>
                  
                  <strong>Sayfa Sayısı:</strong> 
                  <span>{selectedBook?.pageCount && selectedBook.pageCount > 0 ? selectedBook.pageCount : 'Belirtilmemiş'}</span>
                  
                  <strong>ISBN:</strong> 
                  <span>{selectedBook?.isbn && selectedBook.isbn !== '' ? selectedBook.isbn : 'Belirtilmemiş'}</span>
                  
                  <strong>Yayınevi:</strong> 
                  <span>{selectedBook?.publisher && selectedBook.publisher.trim() !== '' ? selectedBook.publisher : 'Belirtilmemiş'}</span>
                  
                  <strong>Dil:</strong> 
                  <span>{selectedBook?.language && selectedBook.language.trim() !== '' ? selectedBook.language : 'Belirtilmemiş'}</span>
                </Box>
              </Box>
            </Box>
            
            {/* Özet */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#3a5ba0' }}>
                Kitap Özeti
              </Typography>
              <Typography variant="body2" sx={{ 
                lineHeight: 1.6, 
                color: 'text.secondary',
                backgroundColor: '#f8f9fa',
                padding: 2,
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}>
                {selectedBook?.summary || 'Bu kitap için henüz özet bulunmuyor.'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setSelectedBook(null)}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #3a5ba0 0%, #4ecdc4 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                px: 3
              }}
            >
              Kapat
            </Button>
          </DialogActions>
        </Dialog>

        {/* Ödünç Alma Dialog'u */}
        <Dialog 
          open={borrowDialogOpen} 
          onClose={() => setBorrowDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {/* Kitap Bilgisi Kartı */}
            <Box sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
              }
            }}>
              <Box sx={{ 
                width: 70, 
                height: 90, 
                borderRadius: 3, 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 28,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                }
              }}>
                📚
              </Box>
              <Box sx={{ flex: 1, ml: 3 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: 'white', 
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  letterSpacing: '0.5px'
                }}>
                  Ödünç Alma Talebi
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.95)', 
                  fontWeight: 600,
                  mb: 0.5,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {selectedBookForBorrow?.title}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  fontStyle: 'italic'
                }}>
                  {selectedBookForBorrow?.author}
                </Typography>
              </Box>
            </Box>
            
            {/* Form İçeriği */}
            <Box sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, #fafbfc 0%, #f1f3f4 100%)',
              minHeight: '400px'
            }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#2c3e50', 
                fontWeight: 600,
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: 2
                }
              }}>
                📅 Tarih Seçimi
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="📅 Ödünç Alma Tarihi"
                    type="date"
                    value={borrowStartDate}
                    onChange={(e) => setBorrowStartDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: '#667eea',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,1)',
                          borderColor: '#667eea',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                          transform: 'translateY(-2px)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#667eea',
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="📅 İade Tarihi"
                    type="date"
                    value={borrowEndDate}
                    onChange={(e) => setBorrowEndDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ 
                      min: borrowStartDate || new Date().toISOString().split('T')[0] 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: '#667eea',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,1)',
                          borderColor: '#667eea',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                          transform: 'translateY(-2px)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#667eea',
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="📝 Notlar (İsteğe bağlı)"
                    multiline
                    rows={3}
                    value={borrowNote}
                    onChange={(e) => setBorrowNote(e.target.value)}
                    fullWidth
                    placeholder="Ödünç alma talebinizle ilgili ek bilgiler..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: '#667eea',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,1)',
                          borderColor: '#667eea',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                          transform: 'translateY(-2px)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#667eea',
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                borderRadius: 3, 
                border: '1px solid rgba(102, 126, 234, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'linear-gradient(180deg, #667eea, #764ba2)',
                  borderRadius: '0 2px 2px 0'
                }
              }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500, 
                  color: '#2c3e50',
                  pl: 2,
                  lineHeight: 1.6
                }}>
                  💡 <strong>Bilgi:</strong> Ödünç alma talebiniz yayınevi tarafından incelendikten sonra onaylanacak veya reddedilecektir.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 4, 
            pt: 2,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderTop: '1px solid #dee2e6'
          }}>
            <Button 
              onClick={() => setBorrowDialogOpen(false)}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                color: '#6c757d',
                border: '2px solid #dee2e6',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#adb5bd',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              ❌ İptal
            </Button>
            <Button
              onClick={handleSubmitBorrowRequest}
              variant="contained"
              disabled={borrowLoading}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                  transform: 'none',
                  boxShadow: 'none'
                },
                borderRadius: 3,
                px: 5,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {borrowLoading ? '📤 Gönderiliyor...' : '📤 Talep Gönder'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar - Bildirimler */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              borderRadius: 2,
              fontWeight: 600,
              '& .MuiAlert-icon': {
                fontSize: '1.2rem'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Favorites; 