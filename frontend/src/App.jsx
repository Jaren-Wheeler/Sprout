// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import "./styles/components/modal.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Layout from "./components/Layout.jsx";

import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/budgeting/Budgets";
import BudgetDetail from "./pages/budgeting/BudgetDetail";

import Calendar from "./pages/calendar/Calendar";
import Fitness from "./pages/fitness/Fitness";
import Notes from "./pages/notes/Notes";
import NoteEditor from "./pages/notes/NoteEditor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/*" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="budgets" element={<Budgets />} />
        <Route path="budgets/:id" element={<BudgetDetail />} />

        <Route path="calendar" element={<Calendar />} />
        <Route path="fitness" element={<Fitness />} />
        <Route path="notes" element={<Notes />} />
        <Route path="note-editor" element={<NoteEditor />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}