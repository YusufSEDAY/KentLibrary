import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3a5ba0',
      dark: '#22335b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffb86b',
      contrastText: '#222',
    },
    background: {
      default: '#f7f8fa',
      paper: '#fff',
    },
    info: {
      main: '#4ecdc4',
    },
    warning: {
      main: '#ffb86b',
    },
  },
  typography: {
    fontFamily: 'Playfair Display, serif',
    h3: {
      fontWeight: 800,
      fontSize: '2.7rem',
      letterSpacing: '0.01em',
      color: '#22335b',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#3a5ba0',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.3rem',
      color: '#22335b',
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.04em',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: '0 4px 16px 0 rgba(58,91,160,0.10)',
          transition: 'all 0.2s',
          background: 'linear-gradient(90deg, #3a5ba0 0%, #22335b 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #22335b 0%, #3a5ba0 100%)',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 24px 0 rgba(58,91,160,0.16)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px 0 rgba(58,91,160,0.08)',
          transition: 'box-shadow 0.2s',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px 0 rgba(58,91,160,0.10)',
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(58,91,160,0.16)',
            transform: 'translateY(-4px) scale(1.03)',
          },
        },
      },
    },
  },
});

export default theme; 