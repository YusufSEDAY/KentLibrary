# 📚 Library Management API (Summer Internship Project)

This project is a **.NET Core Web API** developed as part of my **summer internship**.  
It provides a backend service for a **Library Management System**, enabling users and publishers to manage books, categories, borrow requests, and favorite books.

---

## 🚀 Features

- **User & Publisher Authentication** (Register, Login, JWT-based authorization)  
- **Book Management** (CRUD operations, multiple categories per book)  
- **Category Management** (Create, update, delete, list categories)  
- **Borrow Requests** (Users can request to borrow books)  
- **Favorite Books** (Users can add/remove books from their favorites)  
- **Profile Management** (Update personal info, change password, forgot password via email)  
- **Entity Framework Core with Migrations** for database handling  

---

## 🛠️ Technologies Used

- **.NET 8 Web API**  
- **Entity Framework Core** (Code-First, Migrations)  
- **SQLite**  
- **JWT Authentication**  
- **Swagger (OpenAPI)** for API documentation  
- **C# 12**  

---

## 📂 Project Structure

```
├── Context/
│   └── BookDbContext.cs
├── Controllers/
│   ├── AuthController.cs
│   ├── BookController.cs
│   ├── BorrowRequestController.cs
│   ├── CategoryController.cs
│   └── FavoriteBookController.cs
├── Models/
│   ├── Book.cs
│   ├── User.cs
│   ├── Category.cs
│   ├── BorrowRequest.cs
│   ├── FavoriteBook.cs
│   └── DTOs
├── Migrations/
└── Program.cs / Startup.cs
```


## 📌 Example API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` → Register user or publisher  
- `POST /api/auth/login` → Login and receive JWT  

### 📚 Books
- `GET /api/books` → Get all books  
- `POST /api/books` → Add new book  
- `PUT /api/books/{id}` → Update book  
- `DELETE /api/books/{id}` → Delete book  

### 🏷️ Categories
- `GET /api/categories` → List categories  
- `POST /api/categories` → Create category
- `PUT /api/categories` → Update category
- `DELETE /api/categories` → Delete category  

### ⭐ Favorites
- `POST /api/favorites/{bookId}` → Add book to favorites  
- `DELETE /api/favorites/{bookId}` → Remove from favorites  

### 📖 Borrow Requests
- `POST /api/borrow` → Create borrow request  
- `GET /api/borrow` → List user’s borrow requests  

---

## 👤 Author

**Yusuf Seday**  
💼 Summer Internship Project - Kent Yazılım  

