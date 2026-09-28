// Function to calculate the percentage for a specific table
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

// Main function to calculate everything
function calculateFinalGrade() {
    const wwPercent = calculateTablePercentage('ww-table');
    const ptPercent = calculateTablePercentage('pt-table');
    const exPercent = calculateTablePercentage('ex-table');

    document.getElementById('ww-percentage').innerText = wwPercent.toFixed(2) + '%';
    document.getElementById('pt-percentage').innerText = ptPercent.toFixed(2) + '%';
    document.getElementById('ex-percentage').innerText = exPercent.toFixed(2) + '%';

    const finalGrade = (wwPercent * 0.20) + (ptPercent * 0.50) + (exPercent * 0.30);
    document.getElementById('final-grade').innerText = finalGrade.toFixed(2);
}

// Event Listener for typing in tables
document.addEventListener('input', function(event) {
    if (event.target.hasAttribute('contenteditable')) {
        calculateFinalGrade();
    }
});

// ==========================================
// SAVE AND LOAD DATA FEATURE
// ==========================================

function saveData() {
    const dataToSave = {
        studentName: document.getElementById('studentName').value,
        gradeSection: document.getElementById('gradeSection').value,
        term: document.getElementById('term').value,
        subject: document.getElementById('subject').value,
        teacher: document.getElementById('teacher').value,
        schoolYear: document.getElementById('schoolYear').value,
        wwScores: getTableScores('ww-table'),
        ptScores: getTableScores('pt-table'),
        exScores: getTableScores('ex-table'),
        teacherComment: document.querySelector('.comment-box:nth-child(1) textarea').value,
        parentComment: document.querySelector('.comment-box:nth-child(2) textarea').value
    };

    localStorage.setItem('reportCardData', JSON.stringify(dataToSave));
    alert('Data Saved Successfully! You can now close the browser.');
}

function getTableScores(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    const scores = { highest: [], learner: [] };
    
    rows[0].querySelectorAll('td:not(.label)').forEach(cell => scores.highest.push(cell.innerText));
    rows[1].querySelectorAll('td:not(.label)').forEach(cell => scores.learner.push(cell.innerText));
    
    return scores;
}

function loadData() {
    const savedData = localStorage.getItem('reportCardData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        document.getElementById('studentName').value = data.studentName || '';
        document.getElementById('gradeSection').value = data.gradeSection || '';
        document.getElementById('term').value = data.term || '';
        document.getElementById('subject').value = data.subject || '';
        document.getElementById('teacher').value = data.teacher || '';
        document.getElementById('schoolYear').value = data.schoolYear || '';
        
        setTableScores('ww-table', data.wwScores);
        setTableScores('pt-table', data.ptScores);
        setTableScores('ex-table', data.exScores);
        
        document.querySelector('.comment-box:nth-child(1) textarea').value = data.teacherComment || '';
        document.querySelector('.comment-box:nth-child(2) textarea').value = data.parentComment || '';

        calculateFinalGrade();
    }
}

function setTableScores(tableId, scores) {
    if (!scores) return;
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    
    rows[0].querySelectorAll('td:not(.label)').forEach((cell, index) => {
        if(scores.highest[index]) cell.innerText = scores.highest[index];
    });
    rows[1].querySelectorAll('td:not(.label)').forEach((cell, index) => {
        if(scores.learner[index]) cell.innerText = scores.learner[index];
    });
}

function clearData() {
    if (confirm("Are you sure you want to clear all saved data? This cannot be undone.")) {
        localStorage.removeItem('reportCardData');
        location.reload();
    }
}

// Initial load when page opens
window.addEventListener('DOMContentLoaded', () => {
    loadData(); 
    calculateFinalGrade(); 
});