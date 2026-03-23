import { useState } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import "../styles/navigation.css";

export default function AppLayout({ title, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen backdrop-blur-sm rounded-2xl bg-white/25"> {/* "relative" is the anchor for the dropdown */}
      <Header 
        title={title} 
        onMenuClick={() => setMenuOpen(prev => !prev)} 
      />
      
      {/* The Menu now sits "on top" of the content instead of pushing it */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="p-4">{children}</main>
    </div>
  );
}