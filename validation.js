const branchMap = {
  "B.Tech": ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AIML", "AIDS"],
  "M.Tech": ["CSE", "VLSI", "POWER"],
  "Diploma": ["MECH", "EEE", "CIVIL", "CME"]
};


const phoneRules = {
  "+91": /^[6-9]\d{9}$/,         // India - 10 digits starting with 6-9
  "+1": /^\d{10}$/,               // USA/Canada - 10 digits
  "+44": /^\d{10}$/,              // UK - 10 digits
  "+61": /^\d{9}$/,               // Australia - 9 digits
  "+49": /^\d{11}$/,              // Germany - 11 digits
  "+33": /^\d{9}$/,               // France - 9 digits
  "+81": /^\d{10}$/,              // Japan - 10 digits
  "+55": /^\d{11}$/,              // Brazil - 11 digits
  "+27": /^\d{9}$/,               // South Africa - 9 digits
  "+7": /^\d{10}$/,               // Russia - 10 digits
  "+86": /^\d{11}$/,              // China - 11 digits
  "+971": /^\d{9}$/               // UAE - 9 digits
};

const submitBtn = document.getElementById("submitBtn");

const form = document.getElementById("registerForm");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const countryCodeInput = document.getElementById("countryCode");
const phoneInput = document.getElementById("phone");
const courseInput = document.getElementById("course");
const branchInput = document.getElementById("branch");
const bloodInput = document.getElementById("blood");
const lastDonationInput = document.getElementById("lastDonation");

const fields = {
  studentId: /^[a-zA-Z0-9]{6,12}$/,
  name: /^[a-zA-Z ]{3,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/
};
function setError(id, message) {
  const input = document.getElementById(id);
  const group = input.closest(".form-group");
  const error = group.querySelector(".error");

  error.textContent = message;
  input.classList.add("error-border");
}

function clearError(id) {
  const input = document.getElementById(id);
  const group = input.closest(".form-group");
  const error = group.querySelector(".error");

  error.textContent = "";
  input.classList.remove("error-border");
}


form.addEventListener("submit", e => {
  e.preventDefault();
  let valid = true;

  // Student ID
  if (!fields.studentId.test(studentId.value)) {
    setError("studentId", "6–12 alphanumeric characters required");
    valid = false;
  } else clearError("studentId");

  // Name
  if (!fields.name.test(nameInput.value))
 {
    setError("name", "Only alphabets, min 3 characters");
    valid = false;
  } else clearError("name");

  // Email
  if (!fields.email.test(email.value)) {
    setError("email", "Invalid email format");
    valid = false;
  } else clearError("email");

  // Age
  if (age.value < 18 || age.value > 60) {
    setError("age", "Age must be between 18 and 60");
    valid = false;
  } else clearError("age");

  // Gender
  if (!gender.value) {
    setError("gender", "Gender is required");
    valid = false;
  } else clearError("gender");

  // Country Code
if (!countryCodeInput.value) {
  setError("phone", "Select country code");
  valid = false;
} 
// Phone Number
else if (!phoneRules[countryCodeInput.value].test(phoneInput.value)) {
  setError("phone", `Enter valid number for ${countryCodeInput.value}`);
  valid = false;
} 
else {
  clearError("phone");
}


  // Course
  if (!course.value.trim()) {
    setError("course", "Select a course");
    valid = false;
  } else clearError("course");

  // Branch
  if (!branch.value.trim()) {
    setError("branch", "Select a branch");
    valid = false;
  } else clearError("branch");

  // Blood Group
  if (!blood.value) {
    setError("blood", "Select blood group");
    valid = false;
  } else clearError("blood");

  // Donation Date
  if (!lastDonationInput.value) {
  setError("lastDonation", "Donation date is required");
  valid = false;
}
else if (new Date(lastDonationInput.value) > new Date()) {
  setError("lastDonation", "Future date not allowed");
  valid = false;
}
else clearError("lastDonation");

  
  if (valid) {
  saveToLocalStorage();
  showToast();
  form.reset();
  submitBtn.disabled = true;
  submitBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  submitBtn.classList.remove("bg-red-600");
}


});

form.addEventListener("input", () => {
  submitBtn.disabled = false;
  submitBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
  submitBtn.classList.add("bg-red-600");
});


function updateBranches() {
  const course = document.getElementById("course").value;
  const branch = document.getElementById("branch");

  branch.innerHTML = `<option value="">Select Branch</option>`;

  if (branchMap[course]) {
    branchMap[course].forEach(b => {
      const opt = document.createElement("option");
      opt.textContent = b;
      opt.value = b;
      branch.appendChild(opt);
    });
  }
}

function saveToLocalStorage() {
  const students = JSON.parse(localStorage.getItem("students")) || [];

  students.push({
    studentId: studentId.value,
    name: nameInput.value.trim(),
    email: email.value,
    age: age.value,
    gender: gender.value,
    phone: `${countryCode.value} ${phone.value}`,
    course: course.value,
    branch: branch.value,
    blood: blood.value,
    last: lastDonation.value
  });

  localStorage.setItem("students", JSON.stringify(students));
}


function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}


