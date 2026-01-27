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
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/budget-detail" element={<BudgetDetail/>} />
      <Route path="/budgets" element={<Budgets />} />
      <Route path="/calendar" element={<Calendar/>} />
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/notes" element={<Notes/>} />
      <Route path="/note-editor" element={<NoteEditor/>} />
      <Route path="/chatbot" element={<Chatbot/>} /> {/* Make this a component after testing */}
    </Routes>
  );
}

export default App;
