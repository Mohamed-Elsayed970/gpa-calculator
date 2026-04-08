// ─── Grade Data ───────────────────────────────────────────────
const GRADES = [
  { letter: "A",  points: 4.0, color: "#6366f1" },
  { letter: "A-", points: 3.7, color: "#818cf8" },
  { letter: "B+", points: 3.3, color: "#10b981" },
  { letter: "B",  points: 3.0, color: "#10b981" },
  { letter: "B-", points: 2.7, color: "#34d399" },
  { letter: "C+", points: 2.3, color: "#f59e0b" },
  { letter: "C",  points: 2.0, color: "#f59e0b" },
  { letter: "C-", points: 1.7, color: "#fbbf24" },
  { letter: "D+", points: 1.3, color: "#f97316" },
  { letter: "D",  points: 1.0, color: "#f97316" },
  { letter: "D-", points: 0.7, color: "#fb923c" },
  { letter: "F",  points: 0.0, color: "#ef4444" },
];

// Lookup maps for quick access
const GRADE_POINTS = {};
const GRADE_COLORS = {};
GRADES.forEach(g => {
  GRADE_POINTS[g.letter] = g.points;
  GRADE_COLORS[g.letter] = g.color;
});

// ─── State ────────────────────────────────────────────────────
let courses = [
  { id: 1, name: "Mathematics", grade: "A",  credits: 3 },
  { id: 2, name: "English",     grade: "B+", credits: 3 },
  { id: 3, name: "Physics",     grade: "A-", credits: 4 },
];
let nextId = 4;

// ─── DOM References ───────────────────────────────────────────
const courseListEl   = document.getElementById("courseList");
const emptyStateEl   = document.getElementById("emptyState");
const gpaValueEl     = document.getElementById("gpaValue");
const ringFillEl     = document.getElementById("ringFill");
const statsRowEl     = document.getElementById("statsRow");
const statCoursesEl  = document.getElementById("statCourses");
const statCreditsEl  = document.getElementById("statCredits");
const statStandingEl = document.getElementById("statStanding");
const courseNameEl   = document.getElementById("courseName");
const courseGradeEl  = document.getElementById("courseGrade");
const courseCreditsEl= document.getElementById("courseCredits");
const addBtnEl       = document.getElementById("addBtn");
const gradeScaleEl   = document.getElementById("gradeScale");

// ─── Build grade <select> options ────────────────────────────
function buildGradeOptions(selectEl, selectedGrade) {
  selectEl.innerHTML = "";
  GRADES.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.letter;
    opt.textContent = g.letter;
    if (g.letter === selectedGrade) opt.selected = true;
    selectEl.appendChild(opt);
  });
  // Color the select based on selected grade
  colorGradeSelect(selectEl, selectedGrade);
}

function colorGradeSelect(selectEl, grade) {
  selectEl.style.color = GRADE_COLORS[grade] || "#6366f1";
}

// ─── Build grade scale reference ─────────────────────────────
function buildGradeScale() {
  gradeScaleEl.innerHTML = "";
  GRADES.forEach(g => {
    const chip = document.createElement("div");
    chip.className = "grade-chip";
    chip.innerHTML = `
      <span class="grade-chip-letter" style="color:${g.color}">${g.letter}</span>
      <span class="grade-chip-pts">${g.points.toFixed(1)}</span>
    `;
    gradeScaleEl.appendChild(chip);
  });
}

// ─── GPA Calculation ─────────────────────────────────────────
function calcGPA() {
  if (courses.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  courses.forEach(c => {
    totalPoints  += GRADE_POINTS[c.grade] * c.credits;
    totalCredits += c.credits;
  });
  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}

function getGPAColor(gpa) {
  if (gpa >= 3.7) return "#6366f1";
  if (gpa >= 3.0) return "#10b981";
  if (gpa >= 2.0) return "#f59e0b";
  if (gpa >= 1.0) return "#f97316";
  return "#ef4444";
}

function getGPALabel(gpa) {
  if (gpa >= 3.7) return "Excellent";
  if (gpa >= 3.0) return "Good";
  if (gpa >= 2.0) return "Average";
  if (gpa >= 1.0) return "Below Average";
  return "Failing";
}

// ─── Update GPA Display ───────────────────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 56; // ≈ 351.86

function updateDisplay() {
  const gpa   = calcGPA();
  const color = getGPAColor(gpa);
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  if (courses.length === 0) {
    gpaValueEl.textContent = "—";
    gpaValueEl.style.color = "#6366f1";
    ringFillEl.style.strokeDashoffset = CIRCUMFERENCE;
    ringFillEl.style.stroke = "#6366f1";
    statsRowEl.style.display = "none";
  } else {
    gpaValueEl.textContent  = gpa.toFixed(2);
    gpaValueEl.style.color  = color;
    ringFillEl.style.stroke = color;
    ringFillEl.style.strokeDashoffset = CIRCUMFERENCE - (gpa / 4.0) * CIRCUMFERENCE;
    statsRowEl.style.display = "flex";
    statCoursesEl.textContent  = courses.length;
    statCreditsEl.textContent  = totalCredits;
    statStandingEl.textContent = getGPALabel(gpa);
    statStandingEl.style.color = color;
  }
}

// ─── Render Course List ───────────────────────────────────────
function renderCourses() {
  // Remove all course rows (keep emptyState)
  const rows = courseListEl.querySelectorAll(".course-row");
  rows.forEach(r => r.remove());

  if (courses.length === 0) {
    emptyStateEl.style.display = "block";
    updateDisplay();
    return;
  }

  emptyStateEl.style.display = "none";

  courses.forEach(course => {
    const row = document.createElement("div");
    row.className = "course-row";
    row.dataset.id = course.id;

    // Color bar
    const bar = document.createElement("div");
    bar.className = "course-bar";
    bar.style.background = GRADE_COLORS[course.grade];

    // Name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "course-name-input";
    nameInput.value = course.name;
    nameInput.placeholder = "Course name";
    nameInput.addEventListener("input", () => {
      course.name = nameInput.value;
    });

    // Grade select
    const gradeSelect = document.createElement("select");
    gradeSelect.className = "course-grade-select";
    buildGradeOptions(gradeSelect, course.grade);
    gradeSelect.addEventListener("change", () => {
      course.grade = gradeSelect.value;
      bar.style.background = GRADE_COLORS[course.grade];
      colorGradeSelect(gradeSelect, course.grade);
      ptsEl.textContent = GRADE_POINTS[course.grade].toFixed(1) + " pts";
      updateDisplay();
    });

    // Credits select
    const creditsSelect = document.createElement("select");
    creditsSelect.className = "course-credits-select select";
    [1, 2, 3, 4, 5, 6].forEach(n => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n + " cr";
      if (n === course.credits) opt.selected = true;
      creditsSelect.appendChild(opt);
    });
    creditsSelect.addEventListener("change", () => {
      course.credits = Number(creditsSelect.value);
      updateDisplay();
    });

    // Points label
    const ptsEl = document.createElement("span");
    ptsEl.className = "course-pts";
    ptsEl.textContent = GRADE_POINTS[course.grade].toFixed(1) + " pts";

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "course-remove";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove course";
    removeBtn.addEventListener("click", () => {
      courses = courses.filter(c => c.id !== course.id);
      renderCourses();
    });

    row.append(bar, nameInput, gradeSelect, creditsSelect, ptsEl, removeBtn);
    courseListEl.appendChild(row);
  });

  updateDisplay();
}

// ─── Add Course ───────────────────────────────────────────────
function addCourse() {
  const name = courseNameEl.value.trim();
  if (!name) return;

  courses.push({
    id: nextId++,
    name: name,
    grade: courseGradeEl.value,
    credits: Number(courseCreditsEl.value),
  });

  courseNameEl.value = "";
  addBtnEl.disabled = true;
  renderCourses();
}

// ─── Event Listeners ──────────────────────────────────────────
courseNameEl.addEventListener("input", () => {
  addBtnEl.disabled = courseNameEl.value.trim() === "";
});

courseNameEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addCourse();
});

addBtnEl.addEventListener("click", addCourse);

courseGradeEl.addEventListener("change", () => {
  colorGradeSelect(courseGradeEl, courseGradeEl.value);
});

// ─── Init ─────────────────────────────────────────────────────
buildGradeOptions(courseGradeEl, "A");
buildGradeScale();
renderCourses();
