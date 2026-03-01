import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import NotesPage from './pages/notes/NotesPage';
import BudgetPage from './pages/budgeting/BudgetPage';
import Calendar from './pages/calendar/Calendar';
import DietDashboard from './pages/fitness/DietDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/notes" element={<NotesPage />} />
     
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/calendar" element={<Calendar />} />

      <Route path="/diet" element={<DietDashboard />} />

    </Routes>
  );
}
