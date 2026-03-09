import { Routes, Route, Navigate } from 'react-router-dom';
import {useState, useEffect } from 'react';
import Home from './pages/Home';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import NotesPage from './pages/notes/NotesPage';
import BudgetPage from './pages/budgeting/BudgetPage';
import Calendar from './pages/calendar/Calendar';
import DietDashboard from './pages/fitness/DietDashboard';
import DashboardPage from './pages/main/DashboardPage';

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    async function loadUser() {
      try {
        const data = await apiFetch("/api/user/me");
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
      <Route path="/login" element={<Login setUser={setUser}/>} />
      <Route path="/signup" element={<Signup setUser={setUser}/>} />
      <Route path="/dashboard" element={<DashboardPage user={user} />} />
      <Route path="/habitat" element={<Dashboard />} /> 

      <Route path="/notes" element={<NotesPage />} />
     
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/calendar" element={<Calendar />} />

      <Route path="/diet" element={<DietDashboard />} />

    </Routes>
  );
}
