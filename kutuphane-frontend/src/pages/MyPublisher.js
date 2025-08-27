import React, { useState, useEffect, useContext } from 'react';
import {
  Box,Typography,Paper,TextField,Button,Grid,Card,CardContent,CardActions,Dialog,DialogTitle,DialogContent,DialogActions,Alert,CircularProgress,Chip,IconButton,Snackbar,MenuItem,Avatar,Divider,
  Stack,Tabs,Tab,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,CardMedia} from '@mui/material';
import { 
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,Business as BusinessIcon,Person as PersonIcon,Email as EmailIcon,LocationOn as LocationIcon,Language as LanguageIcon,Book as BookIcon,
  CheckCircle as CheckIcon,Cancel as CancelIcon,History as HistoryIcon} from '@mui/icons-material';
import { LoginContext } from '../App';
import { fetchCategories, fetchBooks, getPublisherBorrowRequests, updateBorrowRequestStatus } from '../api';

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

const MyPublisher = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [borrowRequestsLoading, setBorrowRequestsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    summary: '',
    publishDate: '',
    pageCount: '',
    isbn: '',
    publisher: '',
    language: 'Türkçe',
    categoryIDs: []
  });

  useEffect(() => {
    if (isLoggedIn) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      fetchCategoriesData();
      fetchBooksData();
      fetchBorrowRequestsData();
    }
  }, [isLoggedIn]);

  const fetchCategoriesData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const fetchBooksData = async () => {
    try {
      const response = await fetchBooks();
      const userData = JSON.parse(localStorage.getItem('user'));
      const publisherBooks = response.data.filter(book => 
        book.publisher === userData.publisherName
      );
      
      const booksWithCovers = await Promise.all(
        publisherBooks.map(async (book) => {
          let coverUrl = book.cover;
          if (!coverUrl) {
            coverUrl = await fetchCoverByTitleCached(book.title);
          }
          return { ...book, cover: coverUrl };
        })
      );
      
      setBooks(booksWithCovers);
    } catch (error) {
      console.error('Kitaplar yüklenirken hata:', error);
    }
  };

  const fetchBorrowRequestsData = async () => {
    try {
      setBorrowRequestsLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await getPublisherBorrowRequests(userData.id);
      
      
      const requestsWithCovers = await Promise.all(
        response.data.map(async (request) => {
          const coverUrl = await fetchCoverByTitleCached(request.bookTitle);
          return { ...request, bookCover: coverUrl };
        })
      );
      
      setBorrowRequests(requestsWithCovers);
    } catch (error) {
      console.error('Ödünç talepleri yüklenirken hata:', error);
      setError('Ödünç talepleri yüklenirken bir hata oluştu.');
    } finally {
      setBorrowRequestsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setForm({ ...form, categoryIDs: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const bookData = {
        ...form,
        publisher: userData.publisherName,
        pageCount: parseInt(form.pageCount) || 0,
        categoryIDs: form.categoryIDs.map(id => parseInt(id))
      };

      if (editingBook) {
        
        await fetch(`https://localhost:7238/api/book/${editingBook.ID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
        setSuccess('Kitap başarıyla güncellendi!');
      } else {
      
        await fetch('https://localhost:7238/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
        setSuccess('Kitap başarıyla eklendi!');
      }

      setOpenDialog(false);
      resetForm();
      fetchBooksData();
    } catch (error) {
      console.error('Kitap kaydedilirken hata:', error);
      setError('Kitap kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      summary: book.summary || '',
      publishDate: book.publishDate ? book.publishDate.split('T')[0] : '',
      pageCount: book.pageCount?.toString() || '',
      isbn: book.ISBN || '',
      publisher: book.publisher,
      language: book.language || 'Türkçe',
      categoryIDs: book.categories ? book.categories.map(cat => 
        categories.find(c => c.name === cat)?.id
      ).filter(Boolean) : []
    });
    setOpenDialog(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
      try {
        await fetch(`https://localhost:7238/api/book/${bookId}`, {
          method: 'DELETE'
        });
        setSuccess('Kitap başarıyla silindi!');
        fetchBooksData();
      } catch (error) {
        console.error('Kitap silinirken hata:', error);
        setError('Kitap silinirken bir hata oluştu.');
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      author: '',
      summary: '',
      publishDate: '',
      pageCount: '',
      isbn: '',
      publisher: '',
      language: 'Türkçe',
      categoryIDs: []
    });
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await updateBorrowRequestStatus(requestId, {
        status: 'Approved',
        notes: 'Yayınevi tarafından onaylandı.'
      });
      setSuccess('Talep başarıyla onaylandı.');
      fetchBorrowRequestsData(); 
    } catch (error) {
      console.error('Talep onaylanırken hata:', error);
      setError('Talep onaylanırken bir hata oluştu.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await updateBorrowRequestStatus(requestId, {
        status: 'Rejected',
        notes: 'Yayınevi tarafından reddedildi.'
      });
      setSuccess('Talep başarıyla reddedildi.');
      fetchBorrowRequestsData(); 
    } catch (error) {
      console.error('Talep reddedilirken hata:', error);
      setError('Talep reddedilirken bir hata oluştu.');
    }
  };

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

  if (!isLoggedIn || !user || user.role !== 'publisher') {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
            Bu sayfaya erişim yetkiniz yok.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
      px: 2
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'white',
            fontWeight: 800,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 1
          }}
        >
          🏢 {user.publisherName}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 300
          }}
        >
          Yayınevi Yönetim Paneli
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mx: 'auto', maxWidth: 600 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, mx: 'auto', maxWidth: 600 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Publisher Info Card */}
        <Grid item xs={12} sm={5} md={4}>
          <Paper sx={{ 
            p: 3,
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            height: 'fit-content'
          }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                bgcolor: '#667eea',
                fontSize: '2rem'
              }}>
                <BusinessIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Yayınevi Bilgileri
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon sx={{ color: '#667eea' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Yayınevi Adı</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user.publisherName || 'Belirtilmemiş'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon sx={{ color: '#667eea' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Yetkili Kişi</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Belirtilmemiş'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#667eea' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">E-posta</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user.email || 'Belirtilmemiş'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon sx={{ color: '#667eea' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Adres</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user.address || 'Belirtilmemiş'}
                  </Typography>
                </Box>
              </Box>
              
              {user.website && (
                <>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LanguageIcon sx={{ color: '#667eea' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Web Sitesi</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {user.website}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Main Content with Tabs */}
        <Grid item xs={12} sm={7} md={8}>
          <Paper sx={{ 
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}>
            {/* Tabs Header */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 64,
                    color: '#666',
                    '&.Mui-selected': {
                      color: '#667eea',
                      fontWeight: 700
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#667eea',
                    height: 3
                  }
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookIcon />
                      <span>Kitaplarım ({books.length})</span>
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon />
                      <span>Ödünç Talepleri ({borrowRequests.length})</span>
                    </Box>
                  } 
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {/* Books Tab */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BookIcon sx={{ color: '#667eea', fontSize: 32 }} />
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                          Kitaplarım
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {books.length} kitap bulundu
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditingBook(null);
                        resetForm();
                        setOpenDialog(true);
                      }}
                      sx={{
                        bgcolor: '#667eea',
                        '&:hover': { bgcolor: '#5a6fd8' },
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      Yeni Kitap Ekle
                    </Button>
                  </Box>

                  {books.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 2
                    }}>
                      <BookIcon sx={{ fontSize: 64, color: '#667eea', mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        Henüz kitap eklenmemiş
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        İlk kitabınızı eklemek için "Yeni Kitap Ekle" butonuna tıklayın.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': {
                        height: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: 4,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#667eea',
                        borderRadius: 4,
                        '&:hover': {
                          background: '#5a6fd8',
                        },
                      },
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 3, 
                        minWidth: 'max-content',
                        pb: 2,
                        width: '100%'
                      }}>
                        {books.map((book) => (
                          <Box key={book.ID} sx={{ 
                            minWidth: 'calc(33.333% - 16px)', 
                            maxWidth: 'calc(33.333% - 16px)',
                            flexShrink: 0
                          }}>
                                                      <Card sx={{ 
                              height: 'fit-content',
                              maxHeight: 320,
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                              }
                            }}>
                              {/* Kitap Kapağı */}
                              <Box sx={{ 
                                height: 100, 
                                overflow: 'hidden',
                                borderRadius: '8px 8px 0 0',
                                position: 'relative',
                                bgcolor: '#f5f5f5'
                              }}>
                              {book.cover ? (
                                <img 
                                  src={book.cover} 
                                  alt={book.title}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <Box sx={{ 
                                display: book.cover ? 'none' : 'flex',
                                width: '100%', 
                                height: '100%', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                bgcolor: '#667eea',
                                color: 'white'
                              }}>
                                <BookIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                              </Box>
                            </Box>
                            
                            <CardContent sx={{ flexGrow: 1, p: 1, pb: 0.5 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ 
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                lineHeight: 1.1,
                                fontSize: '0.8rem',
                                mb: 0.5
                              }}>
                                {book.title}
                              </Typography>
                              
                              <Stack spacing={0.3} sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  <strong>Yazar:</strong> {book.author}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  <strong>Yayınevi:</strong> {book.publisher}
                                </Typography>
                              </Stack>
                              
                              {book.categories && book.categories.length > 0 && (
                                <Box sx={{ mt: 0.5 }}>
                                  {book.categories.map((category, index) => (
                                    <Chip
                                      key={index}
                                      label={category}
                                      size="small"
                                      sx={{ 
                                        mr: 0.3, 
                                        mb: 0.3, 
                                        background: categoryColors[category] || '#4ecdc4', 
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '0.6rem',
                                        height: 16,
                                        '& .MuiChip-label': {
                                          px: 0.5
                                        }
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </CardContent>
                            
                            <CardActions sx={{ 
                              p: 0.5, 
                              pt: 0,
                              justifyContent: 'space-between'
                            }}>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(book)}
                                  sx={{ 
                                    color: '#f39c12',
                                    '&:hover': { bgcolor: 'rgba(243, 156, 18, 0.1)' }
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(book.ID)}
                                  sx={{ 
                                    color: '#e74c3c',
                                    '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.1)' }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </CardActions>
                          </Card>
                        </Box>
                      ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Borrow Requests Tab */}
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <HistoryIcon sx={{ color: '#667eea', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Ödünç Talepleri
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {borrowRequests.length} talep bulundu
                      </Typography>
                    </Box>
                  </Box>

                  {borrowRequestsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : borrowRequests.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 2
                    }}>
                      <HistoryIcon sx={{ fontSize: 64, color: '#667eea', mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        Henüz ödünç talebi bulunmuyor
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kullanıcılar kitap ödünç alma talebi gönderdiğinde burada görünecek.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Kitap</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Kullanıcı</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Talep Tarihi</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ödünç Tarihleri</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {borrowRequests.map((request) => (
                            <TableRow key={request.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{ 
                                    width: 50, 
                                    height: 70, 
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    bgcolor: '#f5f5f5'
                                  }}>
                                    {request.bookCover ? (
                                      <img 
                                        src={request.bookCover} 
                                        alt={request.bookTitle}
                                        style={{ 
                                          width: '100%', 
                                          height: '100%', 
                                          objectFit: 'cover' 
                                        }}
                                      />
                                    ) : (
                                      <Box sx={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#667eea',
                                        color: 'white'
                                      }}>
                                        <BookIcon sx={{ fontSize: 20 }} />
                                      </Box>
                                    )}
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      {request.bookTitle}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {request.publisherName}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {request.userName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {formatDate(request.requestDate)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {request.borrowStartDate && (
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>Alış:</strong> {formatDate(request.borrowStartDate)}
                                    </Typography>
                                  )}
                                  {request.borrowEndDate && (
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>İade:</strong> {formatDate(request.borrowEndDate)}
                                    </Typography>
                                  )}
                                  {!request.borrowStartDate && !request.borrowEndDate && (
                                    <Typography variant="body2" color="text.secondary">
                                      Tarih belirtilmemiş
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusText(request.status)}
                                  color={getStatusColor(request.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {request.status === 'Pending' && (
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleApproveRequest(request.id)}
                                      sx={{ 
                                        color: '#27ae60',
                                        '&:hover': { bgcolor: 'rgba(39, 174, 96, 0.1)' }
                                      }}
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRejectRequest(request.id)}
                                      sx={{ 
                                        color: '#e74c3c',
                                        '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.1)' }
                                      }}
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </Box>
                                )}
                                {request.status !== 'Pending' && (
                                  <Typography variant="body2" color="text.secondary">
                                    {request.status === 'Approved' && formatDate(request.approvedDate)}
                                    {request.status === 'Rejected' && formatDate(request.rejectedDate)}
                                    {request.status === 'Returned' && formatDate(request.returnDate)}
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Kitap Ekleme/Düzenleme Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          py: 4,
          px: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            position: 'relative',
            zIndex: 2
          }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <BookIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                mb: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {editingBook ? '📝 Kitap Düzenle' : '📚 Yeni Kitap Ekle'}
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.9,
                fontWeight: 300
              }}>
                {editingBook ? 'Kitap bilgilerini güncelleyin' : 'Yeni kitap bilgilerini girin'}
              </Typography>
            </Box>
          </Box>
          {/* Dekoratif arka plan elementleri */}
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 1
          }} />
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ 
            pt: 4, 
            pb: 3,
            px: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="title"
                  label="📖 Kitap Adı"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="author"
                  label="✍️ Yazar"
                  value={form.author}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="summary"
                  label="📝 Özet"
                  value={form.summary}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="publishDate"
                  label="📅 Yayın Tarihi"
                  type="date"
                  value={form.publishDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="pageCount"
                  label="📄 Sayfa Sayısı"
                  type="number"
                  value={form.pageCount}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="isbn"
                  label="🔢 ISBN"
                  value={form.isbn}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="language"
                  label="🌍 Dil"
                  value={form.language}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="categoryIDs"
                  label="🏷️ Kategoriler"
                  select
                  multiple
                  value={form.categoryIDs}
                  onChange={handleCategoryChange}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: '#667eea'
                        }} />
                        <Typography sx={{ 
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#2c3e50',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%'
                        }}>
                          {category.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 4, 
            pt: 2,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            borderTop: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                color: '#666',
                border: '2px solid #ddd',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              ❌ İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                  transform: 'none',
                  boxShadow: 'none'
                },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                editingBook ? '✅ Güncelle' : '📚 Ekle'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={() => { setSuccess(''); setError(''); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={success ? 'success' : 'error'} 
          onClose={() => { setSuccess(''); setError(''); }}
          sx={{ borderRadius: 2 }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyPublisher; 