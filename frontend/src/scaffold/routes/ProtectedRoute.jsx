import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../state/store.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useStore();
  const loc = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
