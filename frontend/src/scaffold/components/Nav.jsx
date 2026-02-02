import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../state/store.jsx";
import Button from "./Button.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ["nav__item", isActive ? "nav__item--active" : ""].join(" ")}
      end
    >
      {children}
    </NavLink>
  );
}

export default function Nav() {
  const { currentUser, dispatch } = useStore();
  const nav = useNavigate();
  const user = currentUser();

  const logout = () => {
    dispatch({ type: "auth/logout" });
    nav("/login");
  };

  return (
    <div className="nav">
      <div className="nav__brand">
        <div className="nav__logo">🌱</div>
        <div>
          <div className="nav__title">Sprout</div>
          <div className="nav__subtitle">Low-fidelity functional prototype</div>
        </div>
      </div>

      <div className="nav__links">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/budgets">Budgeting</NavItem>
        <NavItem to="/fitness">Fitness & Diet</NavItem>
        <NavItem to="/calendar">Calendar</NavItem>
        <NavItem to="/notes">Notes</NavItem>
        <NavItem to="/chatbot">AI Chatbot</NavItem>
      </div>

      <div className="nav__footer">
        <div className="muted" style={{ fontSize: 13 }}>
          Signed in as <span className="badge">{user?.email ?? "—"}</span>
        </div>
        <Button variant="ghost" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
