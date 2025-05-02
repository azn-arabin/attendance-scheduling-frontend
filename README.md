# 🎓 Smart Attendance & Scheduling System — Frontend

This is the **frontend** of the Smart Attendance & Scheduling System, designed to manage student attendance, batch scheduling, instructor statistics, and administrative controls. Built with a modern React + TypeScript stack, this interface provides a responsive, user-friendly experience for students, instructors, and admins.

> 🔗 **Backend Repo**: [https://github.com/azn-arabin/attendance-scheduling-backend](https://github.com/azn-arabin/attendance-scheduling-backend)
> ⚠️ This frontend depends on the backend APIs — ensure the backend is running at `http://localhost:8000/api`.

---

## 🚀 Features Implemented

* 🔐 Authentication using JWT (Login/Register)
* 📅 Admin scheduling for batches and class timings
* 🧑‍🏫 Instructor dashboard with batch-wise attendance tracking and student performance trends
* 🎓 Student dashboard for viewing upcoming classes and attendance history
* 📊 Charts for performance trends using `recharts`
* 🌙 Light/Dark mode with `next-themes`
* 🧩 Component-based form system using `react-hook-form` + `zod` validation
* 💅 UI built with `shadcn/ui`, `tailwindcss`, and `radix-ui`
* 📁 Reusable tables with support for sorting, filtering, and actions (edit/delete)
* 🔄 API integration via `axios` with secure bearer token handling
* 💬 Toast notifications via `sonner`

---

## 🧪 Tech Stack & Libraries

* **React 19 + TypeScript**
* **Vite** — blazing fast build tool
* **Tailwind CSS 4**
* **ShadCN/UI** — for accessible, headless UI components
* **Radix UI** — dialog, select, tooltip, popover, and more
* **React Router v7**
* **React Hook Form + Zod** — form management & validation
* **Axios** — API integration
* **Lucide React** — clean, customizable icons
* **Recharts** — data visualization
* **Date-fns** — date formatting
* **TanStack Table v8** — powerful table API

---

## 🛠️ Setup Instructions

Follow these steps to get the frontend running locally:

1. **Clone the project**

   ```bash
   git clone https://github.com/azn-arabin/attendance-scheduling-frontend.git
   cd attendance-scheduling-frontend
   ```

2. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` to match your backend API URL (typically: `http://localhost:8000/api`)

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Visit the app at: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Backend Requirement

To use this frontend:

* The backend must be up and running at [http://localhost:8000/api](http://localhost:8000/api)
* Follow backend setup from the repo: [attendance-scheduling-backend](https://github.com/azn-arabin/attendance-scheduling-backend)

---

## 📦 Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Run in development mode          |
| `npm run build`   | Build for production             |
| `npm run lint`    | Run ESLint for code quality      |
| `npm run preview` | Preview production build locally |

---

Feel free to customize and contribute to this project.
For any questions, open an issue or reach out via the GitHub repository.

