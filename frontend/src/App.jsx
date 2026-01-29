import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Budgets from "./pages/budgeting/Budgets";
import BudgetDetail from "./pages/budgeting/BudgetDetail";

import Calendar from "./pages/calendar/Calendar";
import Fitness from "./pages/fitness/Fitness";
import Notes from "./pages/notes/Notes";
import NoteEditor from "./pages/notes/NoteEditor";
import Chatbot from "./pages/chatbot/Chatbot";


// =====================================================
// Application Routing
// =====================================================
// Defines all client-side routes for the Sprout frontend.
// Each route maps a URL path to a corresponding page
// component. React Router handles rendering and navigation
// without full page reloads.
//
// Dynamic segments (e.g. :id) are used for pages that
// require contextual data such as individual budget views.
// =====================================================

function App() {
  return (
    <Routes>

      // =================================================
      // Public Routes
      // =================================================

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      // =================================================
      // Core Application Pages
      // =================================================

      <Route path="/dashboard" element={<Dashboard />} />

      // =================================================
      // Budgeting Module
      // =================================================
      // Budget list page displays all user budgets.
      // Budget detail page displays a single budget and
      // its related expenses using a dynamic parameter.
      // =================================================

      <Route path="/budgets" element={<Budgets />} />
      <Route path="/budgets/:id" element={<BudgetDetail />} />

      // =================================================
      // Other Feature Modules
      // =================================================

      <Route path="/calendar" element={<Calendar />} />
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/note-editor" element={<NoteEditor />} />
      <Route path="/chatbot" element={<Chatbot />} />

    </Routes>
  );
}

export default App;
