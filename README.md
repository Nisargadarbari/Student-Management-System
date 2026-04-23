# 🎓 Student Management System

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20JS-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Pandas](https://img.shields.io/badge/Database-Excel%20%2F%20Pandas-150458?style=for-the-badge&logo=pandas)](https://pandas.pydata.org/)

A modern, responsive, and feature-rich **Student Management Portal** designed to streamline academic records, attendance tracking, and fee management. Built with a sleek dark-themed aesthetic and a robust Python-based backend.

---

## ✨ Key Features

### 🔐 Secure Authentication
- **Dual-mode Access**: Seamless Login and Sign-up functionality for students.
- **Unique Identification**: Uses USN and Name for secure profile access.

### 📊 Interactive Dashboard
- **Real-time Overview**: Instant view of Attendance, CGPA, Fee Status, and Pending Tasks.
- **Modern UI**: Sidebar navigation with smooth transitions and glassmorphism effects.

### 📚 Academic Management
- **Attendance Tracking**: Subject-wise attendance visualization with status indicators (Good/Average).
- **Marks & Results**: Semester-wise SGPA and credit history tracking.
- **Subject Portal**: Dedicated section for course details and professors.

### 💳 Financial & Scheduling
- **Fee History**: Track tuition, library, and other fees with payment status.
- **Smart Timetable**: Dynamic weekly schedule with color-coded slots.
- **Assignments**: Dedicated list for upcoming tasks with submission tracking.

### 🔔 Notifications & Settings
- **Instant Updates**: System notifications for results, assignments, and holidays.
- **Personalization**: Dark mode support and notification preferences.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vite, JavaScript (ES6+), Vanilla CSS (Modern Flex/Grid) |
| **Backend** | Python, Flask, Flask-CORS |
| **Data Storage** | Microsoft Excel (via Pandas) |
| **Styling** | Modern CSS with Custom Properties (Variables) |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (for Frontend)
- [Python 3.8+](https://www.python.org/) (for Backend)

### 2. Backend Setup
```bash
# Navigate to the project root
# Install Python dependencies
pip install flask flask-cors pandas openpyxl

# Run the backend server
python server.py
```
*The server will start at `http://127.0.0.1:5000`.*

### 3. Frontend Setup
```bash
# Install Node dependencies
npm install

# Start the development server
npm run dev
```
*Access the portal at the URL provided by Vite (usually `http://localhost:5173`).*

---

## 📂 Project Structure

```text
student-system/
├── src/                # Frontend logic & styles
│   ├── main.js         # Core JS & routing
│   └── style.css       # Design system & layouts
├── public/             # Static assets
├── index.html          # Main entry point
├── server.py           # Flask API & Excel integration
├── students.xlsx       # Database (Auto-generated)
└── package.json        # Node dependencies
```

---

## 📝 Configuration

- **Database**: The system uses `students.xlsx`. If the file doesn't exist, `server.py` will automatically initialize it with the required schema.
- **Port**: Backend runs on `5000`, Frontend typically on `5173`. Ensure these ports are available.

---

## 🔮 Future Scope
- [ ] Multi-user roles (Admin, Faculty, Student).
- [ ] Integration with SQL/MongoDB for larger datasets.
- [ ] PDF Report Generation for marks and fee receipts.
- [ ] Mobile App integration using React Native or PWA.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Nisargadarbari">Nisarga Darbari</a>
</p>
