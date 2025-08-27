import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Autocomplete, Paper, Alert, Stack, Chip, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { fetchFeaturedBooks, fetchBooks } from '../api';

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



const BookShelfSVG = () => (
  <svg width="100%" height="180" viewBox="0 0 800 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 0, opacity: 0.22, filter: 'blur(1.5px)' }}>
    <rect x="0" y="120" width="800" height="20" rx="10" fill="#b08968" />
    <rect x="40" y="60" width="30" height="60" rx="6" fill="#3a5ba0" />
    <rect x="80" y="80" width="24" height="40" rx="5" fill="#ffd166" />
    <rect x="120" y="70" width="28" height="50" rx="5" fill="#ffb6b9" />
    <rect x="170" y="90" width="20" height="30" rx="4" fill="#4ecdc4" />
    <rect x="210" y="60" width="32" height="60" rx="6" fill="#6c63ff" />
    <rect x="260" y="80" width="24" height="40" rx="5" fill="#a3a380" />
    <rect x="300" y="70" width="28" height="50" rx="5" fill="#b5838d" />
    <rect x="350" y="90" width="20" height="30" rx="4" fill="#22223b" />
    <rect x="390" y="60" width="32" height="60" rx="6" fill="#ffb86b" />
    <rect x="440" y="80" width="24" height="40" rx="5" fill="#3a5ba0" />
    <rect x="480" y="70" width="28" height="50" rx="5" fill="#ffd166" />
    <rect x="530" y="90" width="20" height="30" rx="4" fill="#ffb6b9" />
    <rect x="570" y="60" width="32" height="60" rx="6" fill="#4ecdc4" />
    <rect x="620" y="80" width="24" height="40" rx="5" fill="#b08968" />
    <rect x="660" y="70" width="28" height="50" rx="5" fill="#6c63ff" />
    <rect x="710" y="90" width="20" height="30" rx="4" fill="#a3a380" />
  </svg>
);

const quoteFont = 'Dancing Script, Caveat, Pacifico, Great Vibes, cursive';

const Home = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allBooksResponse = await fetchBooks();
        
        const allBooksWithCovers = await Promise.all(
          allBooksResponse.data.map(async (book) => {
            if (!book.cover) {
              const coverUrl = await fetchCoverByTitleCached(book.title);
              return { ...book, cover: coverUrl || null };
            }
            return book;
          })
        );
        
        const featured = allBooksWithCovers.slice(-6);
        
        setFeaturedBooks(featured);
        setAllBooks(allBooksWithCovers);
        setError(null);
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  
  const handleSearch = () => {
    const searchTerm = searchValue || inputValue;
    if (!searchTerm.trim()) {
      return;
    }
    
    const found = allBooks.find(b => b.title.toLowerCase() === searchTerm.toLowerCase());
    if (found) {
      
      navigate('/books', { 
        state: { 
          searchTerm: searchTerm,
          scrollToBook: found.ID 
        } 
      });
    } else {
      
      navigate('/books', { 
        state: { 
          searchTerm: searchTerm 
        } 
      });
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent', 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: 3,
        mb: 8,
        py: { xs: 10, md: 14 },
        px: 2,
      }}>
        {/* SVG ve illüstrasyonları kaldırdık */}
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontFamily: 'Playfair Display, Montserrat, serif',
            fontWeight: 900,
            letterSpacing: '0.04em',
            mb: 2,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            zIndex: 2,
            fontSize: { xs: 32, sm: 48, md: 56 },
            textShadow: '0 4px 24px #1e283c99',
          }}
        >
          Kent Kütüphanesi
        </Typography>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: 'Montserrat, Playfair Display, serif', color: '#f7f4ed', opacity: 0.98, mb: 4, fontWeight: 500, zIndex: 2, textShadow: '0 2px 12px #1e283c88', fontStyle: 'italic', letterSpacing: '0.01em' }}>
          Gerçek bir kütüphane atmosferinde bilgiye ulaşın.
        </Typography>
        <Paper elevation={12} sx={{
          mt: 0.5,
          width: '100%',
          maxWidth: 420,
          minWidth: 0,
          overflow: 'hidden',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 18px 0 #1e283c33',
          backdropFilter: 'blur(8px)',
          background: 'rgba(30,40,60,0.82)',
          border: '1.5px solid #e0d7c6',
          zIndex: 3,
          transition: 'box-shadow 0.22s, border 0.22s, background 0.22s',
          '&:hover': {
            boxShadow: '0 8px 32px 0 #1e283c55',
            border: '2px solid #4ecdc4',
            background: 'rgba(30,40,60,0.92)',
          },
        }}>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, mb: 1, letterSpacing: '0.01em', opacity: 0.92, fontFamily: 'Montserrat, Playfair Display, serif' }}>
            Kütüphanede kitap ara
          </Typography>
          <Autocomplete
            freeSolo
            options={inputValue.trim() ? allBooks.filter(b => 
              b.title.toLowerCase().includes(inputValue.toLowerCase())
            ).map(b => b.title) : []}
            value={searchValue}
            onChange={(_, newValue) => setSearchValue(newValue || '')}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            sx={{ width: '100%', mb: 2, maxWidth: 360, minWidth: 0, overflow: 'hidden', '& .MuiAutocomplete-listbox': { borderRadius: 2, boxShadow: 3, bgcolor: '#fff' } }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Kitap ara..." variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.98)', borderRadius: 3, width: '100%', maxWidth: 360, minWidth: 0, overflow: 'hidden', border: '2px solid #e0d7c6', fontSize: 18, fontFamily: 'Montserrat, Playfair Display, serif', boxShadow: '0 2px 12px 0 #1e283c22', transition: 'border 0.18s, box-shadow 0.18s', '&:hover': { border: '2px solid #4ecdc4', boxShadow: '0 4px 16px 0 #4ecdc422' } }} />
            )}
            ListboxProps={{ style: { boxShadow: '0 4px 16px 0 #e0d7c622', borderRadius: 12 } }}
          />
          <Button variant="contained" color="primary" sx={{ fontWeight: 800, px: 5, width: '100%', py: 1.5, fontSize: 20, borderRadius: 3, boxShadow: '0 4px 16px 0 #3a5ba022', bgcolor: '#3a5ba0', letterSpacing: '0.04em', fontFamily: 'Montserrat, Playfair Display, serif', mt: 1, transition: 'all 0.18s', '&:hover': { bgcolor: '#4ecdc4', color: '#22335b', boxShadow: '0 8px 32px 0 #4ecdc422' } }} onClick={handleSearch}>
            Ara
          </Button>
          {notFound && (
            <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>Aradığınız kitap bulunamadı.</Alert>
          )}
        </Paper>
      </Box>
      {/* Featured Books */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 700, color: '#fff', letterSpacing: '0.03em', textShadow: '0 2px 8px #1e283c88' }}>Öne Çıkan Kitaplar</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#4ecdc4' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {featuredBooks.map(book => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={book.ID}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 5,
                  bgcolor: 'rgba(30,40,60,0.82)',
                  boxShadow: '0 8px 32px 0 #1e283c22',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                  position: 'relative',
                  minHeight: 160,
                  background: book.cover && book.cover !== ''
                    ? `url('${book.cover}') center center/cover no-repeat`
                    : 'rgba(30,40,60,0.82)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.18s, background 0.18s',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 16px 48px 0 #1e283c44',
                    bgcolor: 'rgba(30,40,60,0.95)',
                    background: book.cover && book.cover !== ''
                      ? `url('${book.cover}') center center/cover no-repeat`
                      : 'rgba(30,40,60,0.95)',
                    '& .overlay': {
                      background: 'rgba(30,40,60,0.85)',
                      backdropFilter: 'blur(3px)',
                    }
                  },
                }}
                onClick={() => setSelectedBook(book)}
              >
                {/* Arka plan görseli için overlay (blur ve opacity) */}
                {book.cover && book.cover !== '' && (
                  <Box 
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 0,
                      background: 'rgba(30,40,60,0.75)',
                      backdropFilter: 'blur(2px)',
                      transition: 'background 0.22s, backdrop-filter 0.22s',
                      pointerEvents: 'none',
                    }} 
                  />
                )}
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                    {book.categories && book.categories.map(cat => (
                      <Chip key={cat} label={cat} size="small" sx={{ 
                        fontWeight: 600, 
                        fontSize: 13, 
                        background: categoryColors[cat] || '#4ecdc4', 
                        color: '#fff', 
                        letterSpacing: '0.03em' 
                      }} />
                    ))}
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', textShadow: '0 2px 8px #1e283c88' }}>{book.title}</Typography>
                  <Typography variant="subtitle2" color="#e0d7c6" gutterBottom>{book.author}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
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
                
                <strong>Özet:</strong> 
                <span>{selectedBook?.summary && selectedBook.summary.trim() !== '' ? 'Mevcut' : 'Belirtilmemiş'}</span>
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
    </Box>
  );
};

export default Home; 