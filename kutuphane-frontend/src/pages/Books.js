import React from 'react';
import { Box } from '@mui/material';
import BookList from '../components/BookList';

const Books = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: "linear-gradient(rgba(30,40,60,0.72), rgba(30,40,60,0.62)), url('/books-bg.jpg') center center/cover no-repeat fixed",
        color: '#f7f4ed',
        py: 6,
      }}
    >
      <BookList />
    </Box>
  );
};

export default Books; 