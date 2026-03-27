import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home/Home';

import { sendChatMessage } from './api/chatbot';
import { apiFetch } from './api/client';
import Sprout from './components/chatbot/Sprout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import BudgetPage from './pages/budgeting/BudgetPage';
import Calendar from './pages/calendar/Calendar';
import Dashboard from './pages/dashboard/Dashboard';
import DietDashboard from './pages/fitness/pages/DietDashboard';
import DashboardPage from './pages/main/DashboardPage';
import NotesPage from './pages/notes/NotesPage';

function AppSprout() {
  const location = useLocation();
  const hiddenRoutes = new Set([
    '/',
    '/login',
    '/signup',
    '/dashboard',
    '/habitat',
  ]);

  if (hiddenRoutes.has(location.pathname)) {
    return null;
  }

  async function handleSend(message) {
    let reply;

    if (location.pathname === '/calendar') {
      const now = new Date();

      reply = await sendChatMessage(message, {
        clientNowIso: now.toISOString(),
        clientLocalDate: `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        clientTimezoneOffsetMinutes: now.getTimezoneOffset(),
      });

      window.dispatchEvent(new Event('eventsUpdated'));
    } else if (location.pathname === '/notes') {
      reply = await sendChatMessage(message);

      window.dispatchEvent(new Event('notesUpdated'));
    } else {
      reply = await sendChatMessage(message);
    }

    return reply;
  }

  return <Sprout onSend={handleSend} />;
}

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
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={<DashboardPage user={user} setUser={user} />}
        />
        <Route path="/habitat" element={<Dashboard />} />

        <Route path="/notes" element={<NotesPage />} />

        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/calendar" element={<Calendar />} />

        <Route path="/diet" element={<DietDashboard />} />
      </Routes>

      <AppSprout />
    </>
  );
}
