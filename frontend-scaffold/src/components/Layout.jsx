import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav.jsx";

export default function Layout() {
  return (
    <div className="appShell">
      <Nav />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
