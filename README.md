# 🎓 Student Management System

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20JS-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

A professional Student Management Portal with persistent cloud storage, dynamic dashboards, and theme support.

---

## 🚀 Setup Instructions

### 1. Database (MongoDB Atlas)
1.  Create a free account at [mongodb.com](https://www.mongodb.com/).
2.  Create a cluster and click **"Connect"**.
3.  Choose **"Drivers"** and copy the connection string.
4.  **Important**: In Vercel Settings -> Environment Variables, add:
    *   `MONGODB_URI`: `your_connection_string_here` (remember to replace `<password>` with your real password).

### 2. Local Setup
1. Create a `.env` file in the root directory:
```bash
MONGODB_URI=your_mongodb_connection_string
```

2. Install dependencies and run:
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
- **Cloud Persistence**: Data saved securely to MongoDB Atlas.
- **Dynamic Dashboard**: Personalized views for Attendance, Subjects, Marks, and Assignments.
- **Theme Support**: Integrated Dark Mode and Light Mode toggle.
- **Profile Management**: Update student details with instant database sync.
- **Vercel Ready**: Fully optimized for serverless deployment with SSL handshake fixes for macOS.

---

<p align="center">
  Made with ❤️ by Nisarga Darbari
</p>
