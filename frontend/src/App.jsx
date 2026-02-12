import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Notes from './pages/notes/Notes';
import Fitness from './pages/fitness/Fitness';
import BudgetPage from './pages/budgeting/BudgetPage';
import Calendar from './pages/calendar/Calendar';
import DietPage from './pages/fitness/diet/DietPage';
import WorkoutPage from './pages/fitness/workout/WorkoutPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/notes" element={<Notes />} />
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/calendar" element={<Calendar />} />

      <Route path="/diet" element={<DietPage />} />
      <Route path="/workout" element={<WorkoutPage />} />
    </Routes>
  );
}
