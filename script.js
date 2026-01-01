let students = JSON.parse(localStorage.getItem("students")) || [];
let filtered = [...students];
let currentPage = 1;
const rowsPerPage = 10;
const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");



function showSearchField() {
  document.getElementById("searchInput").style.display = "block";
}

function applyFilters() {
  const type = searchType.value;
  const text = searchInput.value.toLowerCase();
  const gender = genderFilter.value;

  filtered = students.filter(s => {
    let match = true;
    if (type && text) match = s[type]?.toLowerCase().includes(text);
    if (gender) match = match && s.gender === gender;
    return match;
  });

  currentPage = 1;
  render();
}
let eligibilityApplied = false;

function filterEligible() {
  const today = new Date();

  if (!eligibilityApplied) {
    // Apply eligibility on top of current filtered data
    filtered = filtered.filter(s => {
      const last = new Date(s.last);
      const weeks = (today - last) / (1000 * 60 * 60 * 24 * 7);
      return s.gender === "Male" ? weeks >= 12 : weeks >= 18;
    });
    eligibilityBtn.textContent = "Remove Eligibility";
  } else {
    // Remove eligibility → restore search/gender filters
    filtered = applyOtherFilters();
    eligibilityBtn.textContent = "Apply Eligibility";
  }

  eligibilityApplied = !eligibilityApplied;
  currentPage = 1;
  render();
}



function applyOtherFilters() {
  let temp = [...students];
  const type = searchType.value;
  const text = searchInput.value.toLowerCase();
  const gender = genderFilter.value;

  if (type && text) {
    temp = temp.filter(s => s[type]?.toLowerCase().includes(text));
  }
  if (gender) {
    temp = temp.filter(s => s.gender === gender);
  }

  return temp;
}



document.getElementById("nextPageBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
});

const eligibilityBtn = document.getElementById("eligibilityBtn");
eligibilityBtn.addEventListener("click", filterEligible);



// Render function for table and pagination
function render() {
  const tableBody = document.getElementById("tableBody");

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filtered.slice(start, end);

  // Render table rows
  tableBody.innerHTML = pageData.map(s => `
    <tr class="hover:bg-gray-50">
      <td class="p-3">${s.name}</td>
      <td class="p-3">${s.blood}</td>
      <td class="p-3">${s.gender}</td>
      <td class="p-3">${s.branch}</td>
      <td class="p-3">${s.course}</td>
      <td class="p-3">${s.last}</td>
      <td class="p-3">
  <button 
    class="bg-blue-800 text-white px-3 py-1 rounded text-sm"
    onclick="updateDonationDate('${s.studentId}')">
    Update
  </button>
</td>

    </tr>
  `).join("");

  // Update pagination info
  document.getElementById("paginationInfo").textContent =
    `Page ${currentPage} / ${totalPages} | Total Records: ${totalRecords}`;

  // Disable buttons when at limits
  document.getElementById("prevPageBtn").disabled = currentPage === 1;
  document.getElementById("nextPageBtn").disabled = currentPage === totalPages || totalPages === 0;
}

// Next Page
document.getElementById("nextPageBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
});

// Previous Page
document.getElementById("prevPageBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

searchInput.addEventListener("input", () => {
  filtered = applyOtherFilters();
  if (eligibilityApplied) filterEligibleOnly();
  currentPage = 1;
  render();
});

searchType.addEventListener("change", () => {
  searchInput.value = ""; // clear old input
  filtered = applyOtherFilters();
  if (eligibilityApplied) filterEligibleOnly();
  currentPage = 1;
  render();
});

genderFilter.addEventListener("change", () => {
  filtered = applyOtherFilters();
  if (eligibilityApplied) filterEligibleOnly();
  currentPage = 1;
  render();
});

// Helper to apply eligibility only without toggling
function filterEligibleOnly() {
  const today = new Date();
  filtered = filtered.filter(s => {
    const last = new Date(s.last);
    const weeks = (today - last) / (1000 * 60 * 60 * 24 * 7);
    return s.gender === "Male" ? weeks >= 12 : weeks >= 18;
  });
}


function loadStudents() {
  students = JSON.parse(localStorage.getItem("students")) || [];
  filtered = [...students];
  currentPage = 1;
  render();
}





function updateDonationDate(studentId) {
  const newDate = prompt("Enter new donation date (YYYY-MM-DD):");

  if (!newDate) return;

  const dateObj = new Date(newDate);
  if (isNaN(dateObj.getTime()) || dateObj > new Date()) {
    alert("Invalid date");
    return;
  }

  let students = JSON.parse(localStorage.getItem("students")) || [];

  const index = students.findIndex(s => s.studentId === studentId);

  if (index !== -1) {
    students[index].last = newDate;
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents(); // reload dashboard
  }
}


loadStudents();

