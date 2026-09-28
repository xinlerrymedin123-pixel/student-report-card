// ==========================================
// GRADE CALCULATION
// ==========================================

// Calculate percentage for a table by summing all score cells
function calculateTablePercentage(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return 0;

    const rows = table.querySelectorAll('tbody tr');
    const highestRow = rows[0].querySelectorAll('td:not(.label)');
    const learnerRow = rows[1].querySelectorAll('td:not(.label)');

    let totalHighest = 0;
    let totalLearner = 0;

    for (let i = 0; i < highestRow.length; i++) {
        let hScore = parseFloat(highestRow[i].innerText) || 0;
        let lScore = parseFloat(learnerRow[i].innerText) || 0;
        totalHighest += hScore;
        totalLearner += lScore;
    }

    if (totalHighest === 0) return 0;
    return (totalLearner / totalHighest) * 100;
}

function calculateFinalGrade() {
    // Find the tables by their position in the page
    const tables = document.querySelectorAll('.score-table');
    
    const wwPercent = calculateTablePercentageByElement(tables[0]);
    const ptPercent = calculateTablePercentageByElement(tables[1]);
    const exPercent = calculateTablePercentageByElement(tables[2]);

    document.getElementById('ww-percentage').innerText = wwPercent.toFixed(2) + '%';
    document.getElementById('pt-percentage').innerText = ptPercent.toFixed(2) + '%';
    document.getElementById('ex-percentage').innerText = exPercent.toFixed(2) + '%';

    const finalGrade = (wwPercent * 0.20) + (ptPercent * 0.50) + (exPercent * 0.30);
    document.getElementById('final-grade').innerText = finalGrade.toFixed(2);
}

// Helper function that takes a table element directly
function calculateTablePercentageByElement(table) {
    if (!table) return 0;

    const rows = table.querySelectorAll('tbody tr');
    const highestRow = rows[0].querySelectorAll('td:not(.label)');
    const learnerRow = rows[1].querySelectorAll('td:not(.label)');

    let totalHighest = 0;
    let totalLearner = 0;

    for (let i = 0; i < highestRow.length; i++) {
        let hScore = parseFloat(highestRow[i].innerText) || 0;
        let lScore = parseFloat(learnerRow[i].innerText) || 0;
        totalHighest += hScore;
        totalLearner += lScore;
    }

    if (totalHighest === 0) return 0;
    return (totalLearner / totalHighest) * 100;
}

document.addEventListener('input', function(event) {
    if (event.target.hasAttribute('contenteditable')) {
        calculateFinalGrade();
    }
});

// ==========================================
// DATA MANAGEMENT (Multiple Students)
// ==========================================

function getAllStudents() {
    const data = localStorage.getItem('studentsData');
    return data ? JSON.parse(data) : {};
}

function saveAllStudents(students) {
    localStorage.setItem('studentsData', JSON.stringify(students));
}

function getCurrentStudentId() {
    return document.getElementById('studentList').value;
}

function refreshStudentDropdown() {
    const students = getAllStudents();
    const dropdown = document.getElementById('studentList');
    const currentId = dropdown.value;

    dropdown.innerHTML = '<option value="">-- Select a student --</option>';
    
    Object.keys(students).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = students[id].studentName || 'Unnamed Student';
        dropdown.appendChild(option);
    });

    if (students[currentId]) {
        dropdown.value = currentId;
    }
}

function saveData() {
    const studentId = getCurrentStudentId();

    if (!studentId) {
        alert('⚠️ Please create a new student first by clicking "➕ New Student".');
        return;
    }

    const students = getAllStudents();
    const tables = document.querySelectorAll('.score-table');

    students[studentId] = {
        studentName: document.getElementById('studentName').value,
        gradeSection: document.getElementById('gradeSection').value,
        term: document.getElementById('term').value,
        subject: document.getElementById('subject').value,
        teacher: document.getElementById('teacher').value,
        schoolYear: document.getElementById('schoolYear').value,
        wwScores: getTableScores(tables[0]),
        ptScores: getTableScores(tables[1]),
        exScores: getTableScores(tables[2]),
        teacherComment: document.getElementById('teacherComment').value,
        parentComment: document.getElementById('parentComment').value
    };

    saveAllStudents(students);
    refreshStudentDropdown();
    alert('✅ Data Saved!');
}

function getTableScores(table) {
    if (!table) return null;
    const rows = table.querySelectorAll('tbody tr');
    const scores = { highest: [], learner: [] };
    
    rows[0].querySelectorAll('td:not(.label)').forEach(cell => scores.highest.push(cell.innerText));
    rows[1].querySelectorAll('td:not(.label)').forEach(cell => scores.learner.push(cell.innerText));
    
    return scores;
}

function setTableScores(table, scores) {
    if (!scores || !table) return;
    const rows = table.querySelectorAll('tbody tr');
    
    rows[0].querySelectorAll('td:not(.label)').forEach((cell, index) => {
        if(scores.highest[index] !== undefined) cell.innerText = scores.highest[index];
    });
    rows[1].querySelectorAll('td:not(.label)').forEach((cell, index) => {
        if(scores.learner[index] !== undefined) cell.innerText = scores.learner[index];
    });
}

function loadSelectedStudent() {
    const studentId = getCurrentStudentId();
    if (!studentId) return;

    const students = getAllStudents();
    const data = students[studentId];
    if (!data) return;

    document.getElementById('studentName').value = data.studentName || '';
    document.getElementById('gradeSection').value = data.gradeSection || '';
    document.getElementById('term').value = data.term || '';
    document.getElementById('subject').value = data.subject || '';
    document.getElementById('teacher').value = data.teacher || '';
    document.getElementById('schoolYear').value = data.schoolYear || '';

    const tables = document.querySelectorAll('.score-table');
    setTableScores(tables[0], data.wwScores);
    setTableScores(tables[1], data.ptScores);
    setTableScores(tables[2], data.exScores);

    document.getElementById('teacherComment').value = data.teacherComment || '';
    document.getElementById('parentComment').value = data.parentComment || '';

    calculateFinalGrade();
}

function createNewStudent() {
    const currentId = getCurrentStudentId();
    if (currentId && document.getElementById('studentName').value) {
        saveData();
    }

    const newId = 'student_' + Date.now();
    const name = prompt('Enter the new student\'s full name:');
    
    if (!name) return;

    const students = getAllStudents();
    students[newId] = {
        studentName: name,
        gradeSection: '',
        term: '',
        subject: '',
        teacher: '',
        schoolYear: '',
        wwScores: null,
        ptScores: null,
        exScores: null,
        teacherComment: '',
        parentComment: ''
    };

    saveAllStudents(students);
    refreshStudentDropdown();
    
    document.getElementById('studentList').value = newId;
    loadSelectedStudent();
}

function deleteStudent() {
    const studentId = getCurrentStudentId();
    if (!studentId) {
        alert('⚠️ No student is selected.');
        return;
    }

    const students = getAllStudents();
    const name = students[studentId].studentName;

    if (confirm(`⚠️ Are you sure you want to DELETE "${name}"?\nThis cannot be undone.`)) {
        delete students[studentId];
        saveAllStudents(students);
        refreshStudentDropdown();
        clearForm();
        alert('🗑️ Student deleted.');
    }
}

function clearForm() {
    document.getElementById('studentName').value = '';
    document.getElementById('gradeSection').value = '';
    document.getElementById('term').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('teacher').value = '';
    document.getElementById('schoolYear').value = '';
    document.getElementById('teacherComment').value = '';
    document.getElementById('parentComment').value = '';
    document.getElementById('final-grade').innerText = '0';
    document.getElementById('ww-percentage').innerText = '0%';
    document.getElementById('pt-percentage').innerText = '0%';
    document.getElementById('ex-percentage').innerText = '0%';

    document.querySelectorAll('.score-table').forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows[1].querySelectorAll('td:not(.label)').forEach(cell => cell.innerText = '0');
    });
}

// ==========================================
// INITIAL LOAD
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    refreshStudentDropdown();
    calculateFinalGrade();
});