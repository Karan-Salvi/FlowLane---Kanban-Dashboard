# 🌊 FlowLane

**FlowLane** is a sleek and responsive Kanban-style task management application built with **Vite** and **TypeScript**. It helps you organize your tasks into projects and visually manage them using drag-and-drop across three standard columns: **To Do**, **In Progress**, and **Done**.

---

### 🔗 Demo Link

Checkout the live demo of CartLoop:

👉 [FlowLane](https://flowlane.vercel.app)

---

## ✨ Features

### 🔷 1. Project Sidebar

- Left sidebar listing all projects
- Ability to create, rename, and delete projects
- Select a project to view its board

### 🗂️ 2. Board Layout

- 3 fixed columns per project: To Do, In Progress, Done
- Responsive layout

### 📝 3. Task Card

- Title (required)
- Optional description
- Created date
- Edit and Delete options

### ➕ 4. Add/Edit Task

- Modal or form-based interface
- Title validation required
- Select initial column when creating

### 📦 5. Drag and Drop

- Move tasks across columns
- Uses `@dnd-kit/core` for smooth drag-and-drop

### 💾 6. Persistence

- All data (projects + tasks) are saved in `localStorage`

---

## ⚙️ Tech Stack

- 💙 React + TypeScript
- 💨 Tailwind CSS
- 🧠 Zustand (state management)
- 🧩 @dnd-kit/core (drag-and-drop)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Karan-Salvi/FlowLane---Kanban-Dashboard.git
cd FlowLane---Kanban-Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run App Locally

```bash
npm run dev
```

### 4. Check on brower on port 5173

```bash
http://localhost:5173
```
