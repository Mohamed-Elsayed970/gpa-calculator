# GPA Calculator — Project Documentation

## Overview

A simple, colorful, and modern GPA (Grade Point Average) calculator web app built as a course project for Web Programming. The app allows students to add their courses, assign grades and credit hours, and instantly see their calculated GPA.

---

## Features

- Add courses with a name, letter grade (A+ through F), and credit count
- Edit existing course details directly in the table
- Remove courses with a single click
- Real-time GPA calculation that updates as you make changes
- Animated circular progress ring showing GPA visually
- Color-coded grades (purple for A, green for B, yellow for C, orange for D, red for F)
- Academic standing label (Excellent / Good / Average / Below Average / Failing)
- Grade Scale Reference table for quick lookup
- Responsive layout that works on both desktop and mobile

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework (component-based structure) |
| TypeScript | Type-safe JavaScript |
| Vite | Fast development server and build tool |
| Tailwind CSS v4 | Utility-based styling |
| pnpm | Package manager |

---

## Project Structure

```
artifacts/gpa-calculator/
├── src/
│   ├── main.tsx              # App entry point — mounts React to the DOM
│   ├── App.tsx               # Root component — renders GPACalculator
│   ├── index.css             # Global styles, CSS variables, Tailwind setup
│   └── pages/
│       └── GPACalculator.tsx # Main GPA calculator component
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

---

## How It Works

### 1. Grade Points System

Each letter grade maps to a numeric grade point value using a standard 4.0 scale:

```typescript
const GRADE_POINTS = {
  "A+": 4.0,  "A": 4.0,  "A-": 3.7,
  "B+": 3.3,  "B": 3.0,  "B-": 2.7,
  "C+": 2.3,  "C": 2.0,  "C-": 1.7,
  "D+": 1.3,  "D": 1.0,  "D-": 0.7,
  "F":  0.0,
};
```

### 2. GPA Calculation Formula

GPA is calculated using a weighted average based on credit hours:

```
GPA = (Sum of grade_points × credits for each course)
      ÷ (Total credit hours)
```

**Example:**
- Math: A (4.0) × 3 credits = 12.0 points
- English: B+ (3.3) × 3 credits = 9.9 points
- Physics: A- (3.7) × 4 credits = 14.8 points
- Total points = 36.7 ÷ 10 total credits = **3.67 GPA**

In code:
```typescript
function calcGPA(courseList: Course[]): number {
  const totalPoints = courseList.reduce(
    (sum, c) => sum + GRADE_POINTS[c.grade] * c.credits,
    0
  );
  const totalCredits = courseList.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits === 0) return 0;
  return totalPoints / totalCredits;
}
```

### 3. State Management

The app uses React's built-in `useState` hook to manage the list of courses. No external state library is needed because this is a simple, single-page app.

```typescript
const [courses, setCourses] = useState<Course[]>([...]);
```

Each course is an object with four fields:
```typescript
interface Course {
  id: number;        // Unique identifier for React rendering
  name: string;      // Course name
  grade: LetterGrade; // Letter grade
  credits: number;   // Number of credit hours
}
```

### 4. Adding a Course

When the user fills in the form at the bottom and clicks "Add Course":
1. The new course object is created
2. It is appended to the existing courses array using `setCourses`
3. The input fields reset to their defaults
4. GPA recalculates automatically because it's derived from the `courses` state

```typescript
function addCourse() {
  if (!newCourseName.trim()) return;
  setCourses([
    ...courses,
    { id: nextId++, name: newCourseName.trim(), grade: newGrade, credits: newCredits },
  ]);
  setNewCourseName("");
}
```

### 5. Editing a Course

Each row in the table has editable inputs. When the user changes a value:
```typescript
function updateCourse(id: number, field: keyof Course, value: string | number) {
  setCourses(courses.map((c) => c.id === id ? { ...c, [field]: value } : c));
}
```
The spread operator (`...c`) copies the existing course and only overwrites the changed field.

### 6. Removing a Course

Clicking the `×` button filters out the course with the matching `id`:
```typescript
function removeCourse(id: number) {
  setCourses(courses.filter((c) => c.id !== id));
}
```

### 7. Circular Progress Ring

The animated ring is drawn using an SVG `<circle>` element and the `stroke-dasharray` / `stroke-dashoffset` technique:

```typescript
const circumference = 2 * Math.PI * 56; // radius = 56
const dashOffset = circumference - (gpa / 4.0) * circumference;
```

- `stroke-dasharray` sets the total length of the dashes
- `stroke-dashoffset` shifts the dash start position — a higher offset means less of the circle is visible
- CSS `transition` on `stroke-dashoffset` creates the smooth animation

---

## CSS and Styling

The app uses **Tailwind CSS v4** with utility classes for layout and spacing. Custom color values are defined as CSS variables in `index.css`:

```css
:root {
  --primary: 252 100% 69%;   /* indigo-purple */
  --background: 240 10% 97%; /* light gray */
  ...
}
```

Color-coded grade indicators use inline `style` props so the exact hex color from `GRADE_COLORS` can be applied dynamically:

```tsx
<span style={{ color: GRADE_COLORS[course.grade] }}>
  {course.grade}
</span>
```

A simple slide-in animation is applied to new course rows using a CSS keyframe:

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.course-row {
  animation: slideIn 0.2s ease-out;
}
```

---

## How to Run the Project

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Steps

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm --filter @workspace/gpa-calculator run dev
```

The app will be available at `http://localhost:<PORT>/`.

### Build for Production

```bash
pnpm --filter @workspace/gpa-calculator run build
```

Output is placed in `artifacts/gpa-calculator/dist/public/`.

---

## Key Concepts Used (Web Programming Course)

| Concept | Where Used |
|---|---|
| HTML forms and inputs | Course name input, grade/credits dropdowns |
| CSS styling | Tailwind utility classes, CSS variables, animations |
| JavaScript functions | `calcGPA`, `addCourse`, `removeCourse`, `updateCourse` |
| Arrays and `.map()` | Rendering course list |
| Arrays and `.filter()` | Removing a course |
| Arrays and `.reduce()` | GPA calculation |
| Event handling | `onChange`, `onClick`, `onKeyDown` |
| Conditional rendering | Empty state message, GPA label color |
| SVG graphics | Circular progress ring |
| React components | Single-file component pattern |
| React useState | Managing course list and form inputs |
| TypeScript interfaces | `Course`, `LetterGrade` types |

---

## Grade Standing Reference

| GPA Range | Standing |
|---|---|
| 3.7 – 4.0 | Excellent |
| 3.0 – 3.69 | Good |
| 2.0 – 2.99 | Average |
| 1.0 – 1.99 | Below Average |
| 0.0 – 0.99 | Failing |

---

## Author Notes

This project was built to demonstrate core web programming concepts:
- How to manage application state with React
- How to handle user input and form events
- How to do simple math computations in JavaScript
- How to visually represent data using SVG
- How to structure a clean, reusable component
