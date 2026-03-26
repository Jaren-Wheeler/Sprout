import { useState } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import "../styles/navigation.css";

export default function AppLayout({
  title,
  children,
  shellClassName = "",
  contentClassName = "",
  plainShell = false,
  headerClassName = "",
  headerButtonClassName = "",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shellBaseClass = plainShell ? "relative min-h-screen" : "sprout-page-shell";

  return (
    <div className={`${shellBaseClass} ${shellClassName}`.trim()}>
      <Header
        title={title}
        onMenuClick={() => setMenuOpen(prev => !prev)}
        className={headerClassName}
        buttonClassName={headerButtonClassName}
      />

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={`sprout-page-content ${contentClassName}`.trim()}>{children}</main>
    </div>
  );
}
