import './style.css'

// --- State ---
let currentUser = JSON.parse(sessionStorage.getItem('portal_current_user')) || null;
const API_BASE = '/api';

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

  // Header & Profile
  navUserName.innerText = firstName;
  miniAvatar.innerText = initial;
  profName.innerText = currentUser.name;
  profUsn.innerText = `USN: ${currentUser.usn}`;
  profDept.innerText = currentUser.dept;
  profId.innerText = currentUser.studentId;
  profMarks.innerText = `${currentUser.marks}%`;
  profilePhotoInit.innerText = initial;

  // Stats
  const statAttendance = document.getElementById('stat-attendance');
  const statCgpa = document.getElementById('stat-cgpa');
  const statFees = document.getElementById('stat-fees');

  if (statAttendance) statAttendance.innerText = `${currentUser.attendance || 0}%`;
  if (statCgpa) statCgpa.innerText = (currentUser.marks / 10).toFixed(1);
  if (statFees) {
    statFees.innerText = currentUser.feeStatus || 'Pending';
    statFees.className = 'stat-value ' + (currentUser.feeStatus === 'Paid' ? 'text-success' : 'text-warning');
  }

  // Render Attendance Table
  const attendanceBody = document.getElementById('attendance-table-body');
  if (attendanceBody && currentUser.attendance_details) {
    attendanceBody.innerHTML = currentUser.attendance_details.map(item => `
      <tr>
        <td>${item.subject}</td>
        <td>${item.total}</td>
        <td>${item.attended}</td>
        <td>${item.percent}%</td>
        <td><span class="status-pill ${item.percent >= 75 ? 'success' : 'warning'}">
          ${item.percent >= 85 ? 'Good' : (item.percent >= 75 ? 'Average' : 'Critical')}
        </span></td>
      </tr>
    `).join('');
  }

  // Render Subjects Grid
  const subjectsGrid = document.getElementById('subjects-grid');
  if (subjectsGrid && currentUser.subjects) {
    subjectsGrid.innerHTML = currentUser.subjects.map(sub => `
      <div class="subject-card card">
        <div class="subject-icon">${sub.code}</div>
        <h4>${sub.name}</h4>
        <p>Credits: ${sub.credits}</p>
        <span class="prof">${sub.prof}</span>
      </div>
    `).join('');
  }

  // Render Marks Table
  const marksBody = document.getElementById('marks-table-body');
  if (marksBody && currentUser.semester_results) {
    marksBody.innerHTML = currentUser.semester_results.map(res => `
      <tr>
        <td>${res.sem}</td>
        <td>${res.sgpa}</td>
        <td>${res.credits}</td>
        <td><span class="status-pill success">${res.result}</span></td>
      </tr>
    `).join('');
  }

  // Render Assignments
  const assignmentsList = document.getElementById('assignments-list');
  if (assignmentsList && currentUser.assignments) {
    assignmentsList.innerHTML = currentUser.assignments.map(ass => `
      <div class="assignment-card card">
        <div class="assign-header">
          <span class="category">${ass.subject}</span>
          <span class="due-date">Due ${ass.due}</span>
        </div>
        <h4>${ass.title}</h4>
        <p>${ass.desc}</p>
        <div class="assign-footer">
          <button class="primary-btn-sm">Submit Now</button>
        </div>
      </div>
    `).join('');
  }

  // Render Notifications
  const notifList = document.getElementById('notifications-list');
  const overviewNotifList = document.getElementById('overview-notifications');
  
  if (currentUser.notifications) {
    const notifHTML = currentUser.notifications.map(n => `
      <div class="notif-item-large">
        <div class="notif-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
        <div class="notif-text">
          <h4>${n.title}</h4>
          <p>${n.desc}</p>
          <span>${n.time}</span>
        </div>
      </div>
    `).join('');
    if (notifList) notifList.innerHTML = notifHTML;

    if (overviewNotifList) {
      overviewNotifList.innerHTML = currentUser.notifications.map(n => `
        <li class="notification-item">
          <div class="notif-dot ${n.title.includes('Holiday') ? 'blue' : 'green'}"></div>
          <div class="notif-content">
            <p>${n.title}</p>
            <span>${n.time}</span>
          </div>
        </li>
      `).join('');
    }
  }
}

// --- Interactive Features ---
document.querySelector('.edit-photo-btn')?.addEventListener('click', async () => {
  const newName = prompt("Enter new name:", currentUser.name);
  if (newName && newName !== currentUser.name) {
    try {
      const response = await fetch(`${API_BASE}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usn: currentUser.usn,
          updates: { name: newName }
        })
      });
      const data = await response.json();
      if (data.success) {
        currentUser = data.user;
        sessionStorage.setItem('portal_current_user', JSON.stringify(data.user));
        updateDashboard();
        alert("Profile updated!");
      }
    } catch (e) {
      alert("Failed to update profile.");
    }
  }
});

document.querySelectorAll('.toggle-switch').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    if (toggle.previousElementSibling.innerText === 'Dark Mode') {
      document.body.classList.toggle('light-mode');
    }
  });
});

// --- Initial Init ---
if (currentUser) {
  showScreen('dashboard');
} else {
  showScreen('auth');
}
