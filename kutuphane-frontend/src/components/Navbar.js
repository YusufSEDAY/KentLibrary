import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Link, useLocation } from 'react-router-dom';
import { LoginContext } from '../App';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('publisher');
    localStorage.removeItem('member');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  return (
    <AppBar position="static" elevation={0} sx={{
      background: 'rgba(30,40,60,0.55)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 24px 0 rgba(30,40,60,0.12)',
      borderBottom: '1.5px solid rgba(255,255,255,0.13)',
      minWidth: '100vw',
      left: 0,
      top: 0,
      right: 0,
      borderRadius: 0,
      m: 0,
      p: 0,
    }}>
      <Toolbar sx={{ minHeight: 88, px: { xs: 1, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* Logo */}
          <Box 
            component="img"
            src="/logo.png" 
            alt="Kent Kütüphanesi Logo"
            sx={{ 
              height: 52, 
              width: 'auto', 
              mr: 2.5, 
              filter: 'drop-shadow(0 3px 10px rgba(30,40,60,0.4)) drop-shadow(0 1px 3px rgba(255,255,255,0.1)) brightness(1.05) contrast(1.15)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: 0.95,
              '&:hover': {
                transform: 'scale(1.08) translateY(-1px)',
                filter: 'drop-shadow(0 4px 15px rgba(30,40,60,0.5)) drop-shadow(0 2px 5px rgba(255,255,255,0.15)) brightness(1.08) contrast(1.2)',
                opacity: 1,
              }
            }}
            onError={(e) => {
              
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <LibraryBooksIcon 
            sx={{ 
              mr: 2, 
              fontSize: 44, 
              color: '#fff', 
              filter: 'drop-shadow(0 2px 8px #1e283c66)',
              display: 'none' 
            }} 
          />
          <Typography 
            variant="h4" 
            component={Link} 
            to="/" 
            sx={{ 
              color: '#fff', 
              textDecoration: 'none', 
              fontWeight: 900, 
              letterSpacing: '0.04em', 
              fontSize: { xs: 24, sm: 28, md: 32 },
              textShadow: '0 2px 12px #1e283c88',
              background: 'linear-gradient(135deg, #fff 0%, #e0e7ef 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Playfair Display, serif',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                borderRadius: 1,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::after': {
                opacity: 1,
              }
            }}
          >
            Kent Kütüphanesi
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Ana Sayfa ve Kitaplar her zaman görünür */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              fontSize: 18,
              px: 3,
              borderRadius: 2.5,
              position: 'relative',
              color: location.pathname === '/' ? '#4ecdc4' : '#fff',
              textShadow: '0 2px 8px #1e283c88',
              transition: 'color 0.2s',
              '&:after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                left: 10,
                right: 10,
                bottom: 4,
                height: 4,
                borderRadius: 2,
                background: location.pathname === '/' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                boxShadow: location.pathname === '/' ? '0 2px 8px 0 #4ecdc488' : 'none',
                filter: location.pathname === '/' ? 'blur(0.5px)' : 'none',
                transition: 'background 0.2s, box-shadow 0.2s',
              },
              '&:hover:after': {
                background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                boxShadow: '0 2px 8px 0 #4ecdc488',
                filter: 'blur(0.5px)',
              },
              '&:hover': {
                color: '#4ecdc4',
              },
            }}
          >
            Ana Sayfa
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/books"
            sx={{
              fontWeight: 700,
              fontSize: 18,
              px: 3,
              borderRadius: 2.5,
              position: 'relative',
              color: location.pathname === '/books' ? '#4ecdc4' : '#fff',
              textShadow: '0 2px 8px #1e283c88',
              transition: 'color 0.2s',
              '&:after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                left: 10,
                right: 10,
                bottom: 4,
                height: 4,
                borderRadius: 2,
                background: location.pathname === '/books' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                boxShadow: location.pathname === '/books' ? '0 2px 8px 0 #4ecdc488' : 'none',
                filter: location.pathname === '/books' ? 'blur(0.5px)' : 'none',
                transition: 'background 0.2s, box-shadow 0.2s',
              },
              '&:hover:after': {
                background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                boxShadow: '0 2px 8px 0 #4ecdc488',
                filter: 'blur(0.5px)',
              },
              '&:hover': {
                color: '#4ecdc4',
              },
            }}
          >
            Kitaplar
          </Button>
          
          {/* Admin Panel Butonu - Sadece admin kullanıcıları için görünür */}
          {isLoggedIn && user && user.role === 'admin' && (
            <Button
              color="inherit"
              component={Link}
              to="/panel/admin"
              sx={{
                fontWeight: 700,
                fontSize: 18,
                px: 3,
                borderRadius: 2.5,
                position: 'relative',
                color: location.pathname === '/panel/admin' ? '#4ecdc4' : '#fff',
                textShadow: '0 2px 8px #1e283c88',
                transition: 'color 0.2s',
                '&:after': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  bottom: 4,
                  height: 4,
                  borderRadius: 2,
                  background: location.pathname === '/panel/admin' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                  boxShadow: location.pathname === '/panel/admin' ? '0 2px 8px 0 #4ecdc488' : 'none',
                  filter: location.pathname === '/panel/admin' ? 'blur(0.5px)' : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                },
                '&:hover:after': {
                  background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                  boxShadow: '0 2px 8px 0 #4ecdc488',
                  filter: 'blur(0.5px)',
                },
                '&:hover': {
                  color: '#4ecdc4',
                },
              }}
            >
              Panel
            </Button>
          )}
          
          {isLoggedIn && user && user.role === 'member' && (
            <Button
              color="inherit"
              component={Link}
              to="/favorites"
              sx={{
                fontWeight: 700,
                fontSize: 18,
                px: 3,
                borderRadius: 2.5,
                position: 'relative',
                color: location.pathname === '/favorites' ? '#4ecdc4' : '#fff',
                textShadow: '0 2px 8px #1e283c88',
                transition: 'color 0.2s',
                '&:after': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  bottom: 4,
                  height: 4,
                  borderRadius: 2,
                  background: location.pathname === '/favorites' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                  boxShadow: location.pathname === '/favorites' ? '0 2px 8px 0 #4ecdc488' : 'none',
                  filter: location.pathname === '/favorites' ? 'blur(0.5px)' : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                },
                '&:hover:after': {
                  background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                  boxShadow: '0 2px 8px 0 #4ecdc488',
                  filter: 'blur(0.5px)',
                },
                '&:hover': {
                  color: '#4ecdc4',
                },
              }}
            >
              Favorilerim
            </Button>
          )}
          {/* Üyeler için Ödünç Aldıklarım butonu */}
          {isLoggedIn && user && user.role === 'member' && (
            <Button
              color="inherit"
              component={Link}
              to="/borrowed"
              sx={{
                fontWeight: 700,
                fontSize: 18,
                px: 3,
                borderRadius: 2.5,
                position: 'relative',
                color: location.pathname === '/borrowed' ? '#4ecdc4' : '#fff',
                textShadow: '0 2px 8px #1e283c88',
                transition: 'color 0.2s',
                '&:after': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  bottom: 4,
                  height: 4,
                  borderRadius: 2,
                  background: location.pathname === '/borrowed' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                  boxShadow: location.pathname === '/borrowed' ? '0 2px 8px 0 #4ecdc488' : 'none',
                  filter: location.pathname === '/borrowed' ? 'blur(0.5px)' : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                },
                '&:hover:after': {
                  background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                  boxShadow: '0 2px 8px 0 #4ecdc488',
                  filter: 'blur(0.5px)',
                },
                '&:hover': {
                  color: '#4ecdc4',
                },
              }}
            >
              Ödünç Aldıklarım
            </Button>
          )}
          {/* Yayın evi için Yayınevim linki */}
          {user && user.role === 'publisher' && (
            <Button
              color="inherit"
              component={Link}
              to="/mypublisher"
              sx={{
                fontWeight: 700,
                fontSize: 18,
                px: 3,
                borderRadius: 2.5,
                position: 'relative',
                color: location.pathname === '/mypublisher' ? '#4ecdc4' : '#fff',
                textShadow: '0 2px 8px #1e283c88',
                transition: 'color 0.2s',
                '&:after': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  bottom: 4,
                  height: 4,
                  borderRadius: 2,
                  background: location.pathname === '/mypublisher' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                  boxShadow: location.pathname === '/mypublisher' ? '0 2px 8px 0 #4ecdc488' : 'none',
                  filter: location.pathname === '/mypublisher' ? 'blur(0.5px)' : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                },
                '&:hover:after': {
                  background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                  boxShadow: '0 2px 8px 0 #4ecdc488',
                  filter: 'blur(0.5px)',
                },
                '&:hover': {
                  color: '#4ecdc4',
                },
              }}
            >
              Yayınevim
            </Button>
          )}
          {!isLoggedIn ? (
            <>
              {/* Giriş yapmamış kullanıcılar için */}
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  px: 3,
                  borderRadius: 2.5,
                  position: 'relative',
                  color: location.pathname === '/register' ? '#4ecdc4' : '#fff',
                  textShadow: '0 2px 8px #1e283c88',
                  transition: 'color 0.2s',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 4,
                    height: 4,
                    borderRadius: 2,
                    background: location.pathname === '/register' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                    boxShadow: location.pathname === '/register' ? '0 2px 8px 0 #4ecdc488' : 'none',
                    filter: location.pathname === '/register' ? 'blur(0.5px)' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  },
                  '&:hover:after': {
                    background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                    boxShadow: '0 2px 8px 0 #4ecdc488',
                    filter: 'blur(0.5px)',
                  },
                  '&:hover': {
                    color: '#4ecdc4',
                  },
                }}
              >
                Kayıt Ol
              </Button>
              
              <Button 
                color="inherit" 
                onClick={handleMenuOpen} 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: 18, 
                  px: 3, 
                  borderRadius: 2.5, 
                  color: '#fff', 
                  textShadow: '0 2px 8px #1e283c88', 
                  '&:hover': { color: '#4ecdc4' } 
                }}
              >
                Kullanıcı Girişi
              </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose} component={Link} to="/login/member">Üye Girişi</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/login/publisher">Yayınevi Girişi</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/login/admin">Admin Girişi</MenuItem>
          </Menu>
            </>
          ) : (
            <>
              {/* Giriş yapmış kullanıcılar için */}
              <Button
                color="inherit"
                component={Link}
                to="/profile"
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  px: 3,
                  borderRadius: 2.5,
                  position: 'relative',
                  color: location.pathname === '/profile' ? '#4ecdc4' : '#fff',
                  textShadow: '0 2px 8px #1e283c88',
                  transition: 'color 0.2s',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 4,
                    height: 4,
                    borderRadius: 2,
                    background: location.pathname === '/profile' ? 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)' : 'transparent',
                    boxShadow: location.pathname === '/profile' ? '0 2px 8px 0 #4ecdc488' : 'none',
                    filter: location.pathname === '/profile' ? 'blur(0.5px)' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  },
                  '&:hover:after': {
                    background: 'linear-gradient(90deg, #4ecdc4 0%, #3a5ba0 100%)',
                    boxShadow: '0 2px 8px 0 #4ecdc488',
                    filter: 'blur(0.5px)',
                  },
                  '&:hover': {
                    color: '#4ecdc4',
                  },
                }}
              >
                Profilim
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout} 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: 18, 
                  px: 3, 
                  borderRadius: 2.5, 
                  color: '#ff6b6b',
                  textShadow: '0 2px 8px #1e283c88',
                  transition: 'color 0.2s',
                  '&:hover': { 
                    color: '#ff5252',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)'
                  } 
                }}
              >
              Çıkış Yap
            </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 