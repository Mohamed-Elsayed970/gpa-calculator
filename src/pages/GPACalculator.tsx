import { useState } from "react";

type LetterGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F";

interface Course {
  id: number;
  name: string;
  grade: LetterGrade;
  credits: number;
}

const GRADE_POINTS: Record<LetterGrade, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "D-": 0.7,
  "F": 0.0,
};

const GRADE_COLORS: Record<string, string> = {
  "A+": "#6366f1",
  "A": "#6366f1",
  "A-": "#818cf8",
  "B+": "#10b981",
  "B": "#10b981",
  "B-": "#34d399",
  "C+": "#f59e0b",
  "C": "#f59e0b",
  "C-": "#fbbf24",
  "D+": "#f97316",
  "D": "#f97316",
  "D-": "#fb923c",
  "F": "#ef4444",
};

const ALL_GRADES: LetterGrade[] = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

function getGPAColor(gpa: number): string {
  if (gpa >= 3.7) return "#6366f1";
  if (gpa >= 3.0) return "#10b981";
  if (gpa >= 2.0) return "#f59e0b";
  if (gpa >= 1.0) return "#f97316";
  return "#ef4444";
}

function getGPALabel(gpa: number): string {
  if (gpa >= 3.7) return "Excellent";
  if (gpa >= 3.0) return "Good";
  if (gpa >= 2.0) return "Average";
  if (gpa >= 1.0) return "Below Average";
  return "Failing";
}

let nextId = 1;

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: nextId++, name: "Mathematics", grade: "A", credits: 3 },
    { id: nextId++, name: "English", grade: "B+", credits: 3 },
    { id: nextId++, name: "Physics", grade: "A-", credits: 4 },
  ]);

  const [newCourseName, setNewCourseName] = useState("");
  const [newGrade, setNewGrade] = useState<LetterGrade>("A");
  const [newCredits, setNewCredits] = useState(3);

  function calcGPA(courseList: Course[]): number {
    if (courseList.length === 0) return 0;
    const totalPoints = courseList.reduce(
      (sum, c) => sum + GRADE_POINTS[c.grade] * c.credits,
      0
    );
    const totalCredits = courseList.reduce((sum, c) => sum + c.credits, 0);
    if (totalCredits === 0) return 0;
    return totalPoints / totalCredits;
  }

  const gpa = calcGPA(courses);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const gpaColor = getGPAColor(gpa);

  function addCourse() {
    if (!newCourseName.trim()) return;
    setCourses([
      ...courses,
      {
        id: nextId++,
        name: newCourseName.trim(),
        grade: newGrade,
        credits: newCredits,
      },
    ]);
    setNewCourseName("");
    setNewGrade("A");
    setNewCredits(3);
  }

  function removeCourse(id: number) {
    setCourses(courses.filter((c) => c.id !== id));
  }

  function updateCourse(id: number, field: keyof Course, value: string | number) {
    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  }

  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference - (gpa / 4.0) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">GPA Calculator</h1>
          <p className="mt-1 text-gray-500 text-sm">Add your courses, grades, and credits to compute your GPA</p>
        </div>

        {/* GPA Display Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-4">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64" cy="64" r="56"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="64" cy="64" r="56"
                fill="none"
                stroke={gpaColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={courses.length === 0 ? circumference : dashOffset}
                style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: gpaColor }}>
                {courses.length === 0 ? "—" : gpa.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">GPA</span>
            </div>
          </div>

          {courses.length > 0 && (
            <div className="flex gap-6 text-sm text-center">
              <div>
                <div className="text-xl font-bold text-gray-800">{courses.length}</div>
                <div className="text-gray-400">Courses</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{totalCredits}</div>
                <div className="text-gray-400">Credits</div>
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: gpaColor }}>
                  {getGPALabel(gpa)}
                </div>
                <div className="text-gray-400">Standing</div>
              </div>
            </div>
          )}
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Your Courses</h2>
          </div>

          {courses.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm">No courses yet. Add your first course below!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {courses.map((course) => (
                <div key={course.id} className="course-row flex items-center gap-3 px-5 py-3">
                  <div
                    className="w-2 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: GRADE_COLORS[course.grade] }}
                  />
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                    className="flex-1 text-sm font-medium text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1 transition-colors"
                    placeholder="Course name"
                  />
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, "grade", e.target.value as LetterGrade)}
                    className="text-sm font-bold px-2 py-1 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer"
                    style={{ color: GRADE_COLORS[course.grade] }}
                  >
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <select
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", Number(e.target.value))}
                    className="text-sm text-gray-600 px-2 py-1 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer w-20"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} cr</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-400 w-12 text-right font-mono">
                    {GRADE_POINTS[course.grade].toFixed(1)} pts
                  </span>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-1 text-lg leading-none font-light"
                    title="Remove course"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Course Form */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Add a Course</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCourse()}
              placeholder="Course name (e.g. Chemistry 101)"
              className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
            />
            <select
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value as LetterGrade)}
              className="text-sm font-semibold px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer"
              style={{ color: GRADE_COLORS[newGrade] }}
            >
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              value={newCredits}
              onChange={(e) => setNewCredits(Number(e.target.value))}
              className="text-sm text-gray-600 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} credit{n > 1 ? "s" : ""}</option>
              ))}
            </select>
            <button
              onClick={addCourse}
              disabled={!newCourseName.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#6366f1" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6366f1")}
            >
              Add Course
            </button>
          </div>
        </div>

        {/* Grade Scale Reference */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Grade Scale Reference</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ALL_GRADES.map((g) => (
              <div key={g} className="flex flex-col items-center py-2 px-1 rounded-xl bg-gray-50">
                <span className="text-sm font-bold" style={{ color: GRADE_COLORS[g] }}>{g}</span>
                <span className="text-xs text-gray-400 mt-0.5">{GRADE_POINTS[g].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Click on any course name, grade, or credits to edit them directly.
        </p>
      </div>
    </div>
  );
}
