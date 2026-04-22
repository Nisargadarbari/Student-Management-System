import './style.css'

// State management
let students = JSON.parse(localStorage.getItem('students')) || [];

// DOM Elements
const studentForm = document.getElementById('student-form');
const studentTableBody = document.getElementById('student-table-body');
const studentCountBadge = document.getElementById('student-count');
const searchInput = document.getElementById('search');
const emptyState = document.getElementById('empty-state');

// Functions
function saveStudents() {
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

function addStudent(e) {
  e.preventDefault();
  
  const newStudent = {
    id: Date.now(), // Unique internal ID
    studentID: document.getElementById('studentID').value,
    rollNumber: document.getElementById('rollNumber').value,
    age: document.getElementById('age').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    address: document.getElementById('address').value,
    timestamp: new Date().toLocaleDateString()
  };

  students.push(newStudent);
  studentForm.reset();
  saveStudents();
}

function deleteStudent(id) {
  students = students.filter(student => student.id !== id);
  saveStudents();
}

function renderStudents(filteredStudents = students) {
  studentTableBody.innerHTML = '';
  
  if (filteredStudents.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    
    filteredStudents.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="badge" style="background: var(--primary); color: white;">#${student.studentID}</span></td>
        <td>${student.rollNumber}</td>
        <td>${student.age}</td>
        <td>${student.phoneNumber}</td>
        <td>
          <button class="action-btn" onclick="window.deleteStudent(${student.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
  }

  studentCountBadge.innerText = `${students.length} Student${students.length !== 1 ? 's' : ''}`;
}

function handleSearch(e) {
  const term = e.target.value.toLowerCase();
  const filtered = students.filter(s => 
    s.studentID.toString().includes(term) || 
    s.rollNumber.toString().includes(term) ||
    s.phoneNumber.includes(term)
  );
  renderStudents(filtered);
}

// Global expose for onclick
window.deleteStudent = deleteStudent;

// Event Listeners
studentForm.addEventListener('submit', addStudent);
searchInput.addEventListener('input', handleSearch);

// Initial Render
renderStudents();
