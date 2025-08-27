import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7238/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCategories = () => api.get('/category');
export const createCategory = (categoryData) => api.post('/category', categoryData);
export const updateCategory = (id, categoryData) => api.put(`/category/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/category/${id}`);
export const fetchBooks = () => api.get('/book');
export const fetchFeaturedBooks = () => api.get('/book/featured');

export const createBook = (bookData) => api.post('/book', bookData);
export const updateBook = (id, bookData) => api.put(`/book/${id}`, bookData);
export const deleteBook = (id) => api.delete(`/book/${id}`);

export const registerUser = (userData) => api.post('/auth/register', userData);
export const registerPublisher = (publisherData) => api.post('/auth/register-publisher', publisherData);
export const loginUser = (loginData) => api.post('/auth/login', loginData);

export const getAllUsers = () => api.get('/auth');
export const getUserById = (id) => api.get(`/auth/${id}`);
export const getUserByUsername = (username) => api.get(`/auth/username/${username}`);
export const updateUser = (id, userData) => api.put(`/auth/${id}`, userData);
export const deleteUser = (id) => api.delete(`/auth/${id}`);
export const getUserCount = () => api.get('/auth/count');
export const getUsersByRole = (role) => api.get(`/auth/role/${role}`);

export const getUserStatistics = (userId) => api.get(`/auth/statistics/${userId}`);

export const getUserFavorites = (userId) => api.get(`/favoritebook/user/${userId}`);
export const addToFavorites = (userData) => api.post('/favoritebook/add', userData);
export const removeFromFavorites = (userData) => api.delete('/favoritebook/remove', { data: userData });
export const checkIfFavorite = (userId, bookId) => api.get(`/favoritebook/check/${userId}/${bookId}`);

export const getAllBorrowRequests = () => api.get('/borrowrequest');
export const getUserBorrowRequests = (userId) => api.get(`/borrowrequest/user/${userId}`);
export const getPublisherBorrowRequests = (publisherId) => api.get(`/borrowrequest/publisher/${publisherId}`);
export const createBorrowRequest = (requestData) => api.post('/borrowrequest', requestData);
export const getBorrowRequestById = (id) => api.get(`/borrowrequest/${id}`);
export const updateBorrowRequestStatus = (id, statusData) => api.put(`/borrowrequest/${id}/status`, statusData);
export const deleteBorrowRequest = (id) => api.delete(`/borrowrequest/${id}`);

export default api; 