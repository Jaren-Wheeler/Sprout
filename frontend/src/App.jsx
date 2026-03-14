import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/home/Home';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import BudgetPage from './pages/budgeting/BudgetPage';
import Calendar from './pages/calendar/Calendar';
import Dashboard from './pages/dashboard/Dashboard';
import DietDashboard from './pages/fitness/pages/DietDashboard';
import DashboardPage from './pages/main/DashboardPage';
import NotesPage from './pages/notes/NotesPage';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiFetch('/api/user/me');
        setUser(data);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/signup" element={<Signup setUser={setUser} />} />
      <Route path="/dashboard" element={<DashboardPage user={user} />} />
      <Route path="/habitat" element={<Dashboard />} />

      <Route path="/notes" element={<NotesPage />} />

      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/calendar" element={<Calendar />} />

      <Route path="/diet" element={<DietDashboard />} />
    </Routes>
  );
}
