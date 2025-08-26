# 📚 Bosta Library Management System

A **robust library management system** built with **Node.js, Express, and Prisma**.  
This system enables efficient management of books, users, and borrowing operations with **role-based access control** and **detailed reporting capabilities**.

---

## ✨ Features

### 👤 User Management
- User registration and authentication with **JWT**
- Role-based access control (**USER / ADMIN**)
- Secure password hashing with **bcrypt**

### 📖 Book Management
- CRUD operations for books
- Search by **title, author, or ISBN**
- Inventory tracking with available quantities

### 📋 Borrowing System
- Borrow request creation and **approval workflow**
- Due date tracking and **overdue management**
- Return processing with automatic inventory updates
- Status tracking (**PENDING, APPROVED, REJECTED, RETURNED**)

### 📊 Analytics & Reporting
- Comprehensive **borrowing reports**
- Export capabilities (**CSV, Excel**)
- Top borrowed books analytics
- Most active borrowers tracking
- Overdue books monitoring

### 🔒 Security Features
- **Rate limiting** and **CORS** protection
- **Helmet** security headers
- Input validation and sanitization
- SQL injection protection via **Prisma**

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL with Prisma ORM  
- **Authentication:** JWT with bcrypt  
- **Testing:** Jest, Supertest  
- **Security:** Helmet, express-rate-limit, CORS  
- **Export:** json2csv, xlsx  
- **Containerization:** Docker, Docker Compose  

---

## 🚀 Getting Started

### 📌 Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/)  
- [PostgreSQL](https://www.postgresql.org/)  
- [Docker](https://www.docker.com/) (optional, for containerization)  

### 📥 Installation
```bash
# Clone the repository
git clone https://github.com/omaraymanatia/Bosta-library-management-system.git

# Navigate into the project folder
cd Bosta-library-management-system

# Install dependencies
npm install
