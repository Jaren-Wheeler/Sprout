import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import Budgets from "./pages/budgeting/Budgets.jsx";
import BudgetDetail from "./pages/budgeting/BudgetDetail.jsx";

import Fitness from "./pages/fitness/Fitness.jsx";
import Notes from "./pages/notes/Notes.jsx";
import Calendar from "./pages/calendar/Calendar.jsx";
import Chatbot from "./pages/chatbot/Chatbot.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="budgets/:budgetId" element={<BudgetDetail />} />
        <Route path="fitness" element={<Fitness />} />
        <Route path="notes" element={<Notes />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="chatbot" element={<Chatbot />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
