import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => (
  <Box component="footer" sx={{
    bgcolor: 'rgba(30,40,60,0.55)',
    background: 'rgba(30,40,60,0.55)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    py: { xs: 4, sm: 6 },
    mt: 8,
    textAlign: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    boxShadow: '0 -4px 32px 0 rgba(75,108,183,0.10)',
    
  }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: '0.04em',
        color: '#90caf9',
        textShadow: '0 2px 8px #1e283c99',
      }}>
        © 2025 Kent Kütüphanesi
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.92, mb: 2 }}>
        Tüm hakları saklıdır.
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
        İletişim: info@kentkutuphanesi.com
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
        <IconButton 
          color="inherit" 
          href="https://www.linkedin.com/in/yusuf-seday-88731a290/" 
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.08)', 
            transition: 'all 0.3s ease',
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.18)',
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(0,119,181,0.3)'
            } 
          }}
        >
          <LinkedInIcon />
        </IconButton>
      </Stack>
  </Box>
);

export default Footer; 