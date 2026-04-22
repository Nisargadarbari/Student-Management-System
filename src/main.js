import './style.css'

// --- State ---
let currentUser = JSON.parse(sessionStorage.getItem('portal_current_user')) || null;
const API_BASE = 'http://127.0.0.1:5000/api';

// --- DOM Elements ---
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const logoutBtn = document.getElementById('logout-btn');

// Sidebar Nav
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.dashboard-section');
const sectionTitle = document.getElementById('section-title');

// Profile Elements
const profName = document.getElementById('prof-name');
const profUsn = document.getElementById('prof-usn');
const profDept = document.getElementById('prof-dept');
const profId = document.getElementById('prof-id');
const profMarks = document.getElementById('prof-marks');
const profilePhotoInit = document.getElementById('profile-photo-init');
const miniAvatar = document.getElementById('mini-avatar');
const navUserName = document.getElementById('nav-user-name');

// --- Navigation Logic ---
function showScreen(screen) {
  authScreen.style.display = screen === 'auth' ? 'block' : 'none';
  dashboardScreen.style.display = screen === 'dashboard' ? 'block' : 'none';
  if (screen === 'dashboard') {
    document.body.style.display = 'block'; // Ensure body isn't centering dashboard layout
    document.body.style.alignItems = 'stretch';
    updateDashboard();
  } else {
    document.body.style.display = 'flex';
    document.body.style.alignItems = 'center';
  }
}

function switchSection(sectionId) {
  // Update Active Nav Item
  navItems.forEach(item => {
    if (item.dataset.section === sectionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Show Selected Section
  sections.forEach(section => {
    if (section.id === `section-${sectionId}`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Update Header Title
  sectionTitle.innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
}

// Add Click Listeners to Nav Items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    switchSection(item.dataset.section);
  });
});

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
});

tabSignup.addEventListener('click', () => {
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  signupForm.style.display = 'block';
  loginForm.style.display = 'none';
});

// --- Auth Logic ---
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const newUser = {
    name: document.getElementById('signup-name').value.trim(),
    usn: document.getElementById('signup-usn').value.trim(),
    dept: document.getElementById('signup-dept').value.trim(),
    studentId: document.getElementById('signup-id').value.trim(),
    marks: document.getElementById('signup-marks').value.trim()
  };

  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (data.success) {
      alert("Account created! Please login.");
      tabLogin.click();
      signupForm.reset();
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    alert("Backend server is not running! Start server.py first.");
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const credentials = {
    name: document.getElementById('login-name').value.trim(),
    usn: document.getElementById('login-usn').value.trim()
  };

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (data.success) {
      currentUser = data.user;
      sessionStorage.setItem('portal_current_user', JSON.stringify(data.user));
      showScreen('dashboard');
    } else {
      alert(data.message || "Invalid credentials");
    }
  } catch (error) {
    alert("Backend server is not running!");
  }
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  sessionStorage.removeItem('portal_current_user');
  showScreen('auth');
});

// --- Dashboard Logic ---
function updateDashboard() {
  if (!currentUser) return;

  const firstName = currentUser.name.split(' ')[0];
  const initial = currentUser.name.charAt(0).toUpperCase();

  // Header
  navUserName.innerText = firstName;
  miniAvatar.innerText = initial;

  // Profile Section
  profName.innerText = currentUser.name;
  profUsn.innerText = `USN: ${currentUser.usn}`;
  profDept.innerText = currentUser.dept;
  profId.innerText = currentUser.studentId;
  profMarks.innerText = `${currentUser.marks}%`;
  profilePhotoInit.innerText = initial;

  // Dashboard Overview Stats
  const statAttendance = document.getElementById('stat-attendance');
  const statCgpa = document.getElementById('stat-cgpa');
  const statFees = document.getElementById('stat-fees');

  if (statAttendance) statAttendance.innerText = `${currentUser.attendance || 0}%`;
  if (statCgpa) statCgpa.innerText = (currentUser.marks / 10).toFixed(1);
  if (statFees) {
    statFees.innerText = currentUser.feeStatus || 'Pending';
    statFees.className = 'stat-value ' + (currentUser.feeStatus === 'Paid' ? 'text-success' : 'text-warning');
  }
}

// --- Initial Init ---
if (currentUser) {
  showScreen('dashboard');
} else {
  showScreen('auth');
}
