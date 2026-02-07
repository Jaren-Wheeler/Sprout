import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Notes from './pages/notes/Notes';
import Fitness from './pages/fitness/Fitness';
import Budget from './pages/budgeting/Budget';
import Calendar from './pages/calendar/Calendar';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/notes" element={<Notes />} />
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/calendar" element={<Calendar />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
