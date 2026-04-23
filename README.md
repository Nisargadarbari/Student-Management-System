# 🎓 Student Management System

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20JS-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

A professional Student Management Portal with persistent cloud storage.

---

## 🚀 Setup Instructions

### 1. Database (MongoDB Atlas)
1.  Create a free account at [mongodb.com](https://www.mongodb.com/).
2.  Create a cluster and click **"Connect"**.
3.  Choose **"Drivers"** and copy the connection string.
4.  **Important**: In Vercel Settings -> Environment Variables, add:
    *   `MONGODB_URI`: `your_connection_string_here` (remember to replace `<password>` with your real password).

### 2. Local Setup
```bash
pip install -r requirements.txt
python api/index.py
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

---

## 📂 Features
- **Cloud Persistence**: Data saved to MongoDB Atlas.
- **Vercel Ready**: Optimized for serverless deployment.
- **Modern UI**: Clean, dark-themed student dashboard.

---

<p align="center">
  Made with ❤️ by Nisarga Darbari
</p>
