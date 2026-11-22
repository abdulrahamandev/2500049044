const studentList = document.querySelector("#student-list");
const studentForm = document.querySelector("#student-form");
const searchForm = document.querySelector("#search-form");
const message = document.querySelector("#message");
const cancelButton = document.querySelector("#cancel-button");
let editingId = null;
let students = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: options.body ? { "Content-Type": "application/json" } : {}
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Request failed.");
  return result;
}

async function loadStudents(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim()) params.set(key, value.trim());
  });

  try {
    students = await request(`/api/students?${params.toString()}`);
    message.textContent = "";
    renderStudents();
  } catch (error) {
    message.textContent = error.message;
  }
}

function renderStudents() {
  studentList.replaceChildren();
  for (const student of students) {
    const row = document.createElement("tr");
    [student.name, student.rollNumber, student.department, student.year].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const actions = document.createElement("td");
    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.addEventListener("click", () => editStudent(student));
    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteStudent(student));
    actions.append(edit, remove);
    row.append(actions);
    studentList.append(row);
  }
}

studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(studentForm));
  data.year = Number(data.year);

  try {
    await request(editingId ? `/api/students/${editingId}` : "/api/students", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(data)
    });
    resetForm();
    await loadStudents();
  } catch (error) {
    message.textContent = error.message;
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadStudents(Object.fromEntries(new FormData(searchForm)));
});

searchForm.addEventListener("reset", () => {
  setTimeout(() => loadStudents(), 0);
});

cancelButton.addEventListener("click", resetForm);

function editStudent(student) {
  editingId = student._id;
  for (const field of ["name", "rollNumber", "department", "year"]) {
    studentForm.elements[field].value = student[field];
  }
  document.querySelector("#form-title").textContent = "Update Student";
  document.querySelector("#save-button").textContent = "Save Changes";
  cancelButton.hidden = false;
  studentForm.elements.name.focus();
}

async function deleteStudent(student) {
  if (!confirm(`Delete ${student.name}?`)) return;
  try {
    await request(`/api/students/${student._id}`, { method: "DELETE" });
    await loadStudents();
  } catch (error) {
    message.textContent = error.message;
  }
}

function resetForm() {
  editingId = null;
  studentForm.reset();
  document.querySelector("#form-title").textContent = "Add Student";
  document.querySelector("#save-button").textContent = "Add Student";
  cancelButton.hidden = true;
}

loadStudents();
